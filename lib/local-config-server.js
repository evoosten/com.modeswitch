'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const apiHandlers = require('../api');
const manifest = require('../app.json');

class LocalConfigServer {
  constructor({ app, basePort = 7790, maxPort = 7800 }) {
    if (!app) throw new Error('LocalConfigServer requires app');
    this.app = app;
    this.basePort = basePort;
    this.maxPort = maxPort;
    this.server = null;
    this.port = null;
    this.host = '0.0.0.0';
    this.indexPath = path.join(__dirname, '..', 'assets', 'config', 'index.html');
    this.localeDir = path.join(__dirname, '..', 'locales');
    this._localeCache = new Map();
  }

  _getOrCreateToken() {
    let token = String(this.app.homey.settings.get('local_config_token') || '').trim();
    if (token.length < 24) {
      token = crypto.randomBytes(32).toString('hex');
      this.app.homey.settings.set('local_config_token', token);
    }
    return token;
  }

  regenerateToken() {
    const token = crypto.randomBytes(32).toString('hex');
    this.app.homey.settings.set('local_config_token', token);
    return token;
  }

  _validToken(value) {
    const expected = this._getOrCreateToken();
    const actual = String(value || '');
    if (!actual || actual.length !== expected.length) return false;
    try {
      return crypto.timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
    } catch (_) {
      return false;
    }
  }

  _language() {
    try {
      const language = String(this.app.homey.i18n.getLanguage() || 'en').toLowerCase();
      return language === 'no' ? 'nb' : language;
    } catch (_) {
      return 'en';
    }
  }

  _flattenLocale(value, prefix = '', result = {}) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return result;
    for (const [key, item] of Object.entries(value)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (item && typeof item === 'object' && !Array.isArray(item)) this._flattenLocale(item, fullKey, result);
      else if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') result[fullKey] = String(item);
    }
    return result;
  }

  async _loadLocale(language) {
    const requested = String(language || 'en').toLowerCase();
    const fileLanguage = requested === 'no' ? 'nb' : requested;
    if (this._localeCache.has(fileLanguage)) return this._localeCache.get(fileLanguage);
    let parsed = {};
    try {
      const raw = await fs.promises.readFile(path.join(this.localeDir, `${fileLanguage}.json`), 'utf8');
      parsed = JSON.parse(raw);
    } catch (error) {
      if (fileLanguage !== 'en') return this._loadLocale('en');
      this.app.error('Could not load English locale for local configuration', error);
    }
    const flattened = this._flattenLocale(parsed);
    this._localeCache.set(fileLanguage, flattened);
    return flattened;
  }

  async _getLocaleBundle() {
    const language = this._language();
    const translations = await this._loadLocale(language);
    const fallbackTranslations = language === 'en' ? translations : await this._loadLocale('en');
    return { language, translations, fallbackTranslations };
  }

  _isPrivateIPv4(address) {
    if (!/^\d{1,3}(?:\.\d{1,3}){3}$/.test(address)) return false;
    const parts = address.split('.').map(Number);
    if (parts.some(part => part < 0 || part > 255)) return false;
    return parts[0] === 10
      || (parts[0] === 192 && parts[1] === 168)
      || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31);
  }

  getLanAddresses() {
    const result = [];
    const seen = new Set();
    const interfaces = os.networkInterfaces() || {};
    for (const [name, entries] of Object.entries(interfaces)) {
      for (const entry of entries || []) {
        const family = typeof entry.family === 'string' ? entry.family : (entry.family === 4 ? 'IPv4' : String(entry.family));
        if (family !== 'IPv4' || entry.internal || !entry.address || entry.address === '127.0.0.1') continue;
        if (seen.has(entry.address)) continue;
        seen.add(entry.address);
        result.push({ address: entry.address, name, private: this._isPrivateIPv4(entry.address) });
      }
    }
    result.sort((a, b) => {
      const rank = item => item.address.startsWith('192.168.') ? 0 : item.address.startsWith('10.') ? 1 : item.private ? 2 : 3;
      return rank(a) - rank(b) || a.address.localeCompare(b.address, undefined, { numeric: true });
    });
    return result;
  }

  getInfo() {
    const token = this._getOrCreateToken();
    const addresses = this.getLanAddresses();
    const preferred = addresses[0]?.address || '';
    const port = this.port || Number(this.app.homey.settings.get('local_config_server_port')) || this.basePort;
    const makeUrl = address => address ? `http://${address}:${port}/?key=${encodeURIComponent(token)}` : '';
    return {
      running: Boolean(this.server && this.server.listening),
      port,
      address: preferred,
      url: makeUrl(preferred),
      urls: addresses.map(item => ({ ...item, url: makeUrl(item.address) })),
      language: this._language(),
      token,
    };
  }

  async start() {
    if (this.server && this.server.listening) return this.getInfo();
    this._getOrCreateToken();
    let lastError = null;
    for (let port = this.basePort; port <= this.maxPort; port += 1) {
      try {
        await this._listen(port);
        this.port = port;
        this.app.homey.settings.set('local_config_server_port', port);
        const info = this.getInfo();
        this.app.log(`Local configuration server listening on port ${port}${info.address ? ` (${info.address})` : ''}`);
        return info;
      } catch (error) {
        lastError = error;
        if (!error || error.code !== 'EADDRINUSE') break;
      }
    }
    throw lastError || new Error('Could not start local configuration server');
  }

  _listen(port) {
    return new Promise((resolve, reject) => {
      const server = http.createServer((req, res) => {
        this._handle(req, res).catch(error => {
          this.app.error('Local configuration request failed', error);
          this._sendJson(res, 500, { error: error?.message || String(error) });
        });
      });
      const onError = error => {
        server.removeListener('listening', onListening);
        try { server.close(); } catch (_) {}
        reject(error);
      };
      const onListening = () => {
        server.removeListener('error', onError);
        this.server = server;
        resolve();
      };
      server.once('error', onError);
      server.once('listening', onListening);
      server.listen(port, this.host);
    });
  }

  async close() {
    const server = this.server;
    this.server = null;
    if (!server) return;
    await new Promise(resolve => {
      try { server.close(() => resolve()); } catch (_) { resolve(); }
    });
  }

  _sendJson(res, status, payload) {
    if (res.headersSent) return;
    const body = JSON.stringify(payload ?? null);
    res.writeHead(status, {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(body),
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    res.end(body);
  }

  _sendHtml(res, status, body) {
    if (res.headersSent) return;
    res.writeHead(status, {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': Buffer.byteLength(body),
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
    });
    res.end(body);
  }

  async _readJson(req, maxBytes = 5 * 1024 * 1024) {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
      size += chunk.length;
      if (size > maxBytes) {
        const error = new Error('Request body too large');
        error.statusCode = 413;
        throw error;
      }
      chunks.push(chunk);
    }
    if (!chunks.length) return {};
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  }

  _routeFor(method, pathname) {
    const denied = new Set([
      '/local_config_info',
      '/local_config_origin',
      '/local_config_token/regenerate',
      '/local_config_bootstrap',
      '/local_config_api',
      '/export',
    ]);
    if (denied.has(pathname)) return null;
    const api = manifest.api || {};
    for (const [name, definition] of Object.entries(api)) {
      const methods = Array.isArray(definition.method) ? definition.method : [definition.method];
      if (String(definition.path || '') === pathname && methods.map(String).map(value => value.toUpperCase()).includes(method)) {
        const handler = apiHandlers[name];
        if (typeof handler === 'function') return { name, handler };
      }
    }
    return null;
  }

  async _dispatch(method, pathname, body, url) {
    const route = this._routeFor(method, pathname);
    if (!route) {
      const error = new Error(`Unknown local configuration API route: ${method} ${pathname}`);
      error.statusCode = 404;
      throw error;
    }
    const query = Object.fromEntries(url.searchParams.entries());
    return route.handler({ homey: this.app.homey, body: body ?? null, query });
  }

  async _handle(req, res) {
    const method = String(req.method || 'GET').toUpperCase();
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

    if (method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
      const html = await fs.promises.readFile(this.indexPath, 'utf8');
      this._sendHtml(res, 200, html);
      return;
    }

    if (method === 'GET' && url.pathname === '/health') {
      const info = this.getInfo();
      this._sendJson(res, 200, { ok: true, version: this.app.homey.manifest?.version || '', port: info.port });
      return;
    }

    if (method === 'GET' && url.pathname === '/bootstrap') {
      if (!this._validToken(url.searchParams.get('key'))) {
        this._sendJson(res, 403, { error: 'Invalid local configuration key' });
        return;
      }
      const locale = await this._getLocaleBundle();
      this._sendJson(res, 200, {
        ok: true,
        language: locale.language,
        version: this.app.homey.manifest?.version || '',
        translations: locale.translations,
        fallbackTranslations: locale.fallbackTranslations,
      });
      return;
    }

    if (method === 'POST' && url.pathname === '/api') {
      const payload = await this._readJson(req);
      if (!this._validToken(payload.key)) {
        this._sendJson(res, 403, { error: 'Invalid local configuration key' });
        return;
      }
      const targetMethod = String(payload.method || 'GET').toUpperCase();
      const targetUrl = new URL(String(payload.path || '/'), 'http://local-config.invalid');
      const result = await this._dispatch(targetMethod, targetUrl.pathname, payload.body, targetUrl);
      this._sendJson(res, 200, result);
      return;
    }

    this._sendJson(res, 404, { error: 'Not found' });
  }
}

module.exports = LocalConfigServer;
