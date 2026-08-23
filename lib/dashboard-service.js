'use strict';

class DashboardService {
  constructor({ app }) {
    if (!app) throw new Error('DashboardService requires app');
    this.app = app;
    this.schemaVersion = 1;
  }

  _timestamp(value) {
    if (value === null || value === undefined || value === '') return null;
    const number = Number(value);
    const date = Number.isFinite(number) ? new Date(number) : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  _mode() {
    const currentId = this.app.getCurrentMode();
    const parentId = this.app.getParentMode(currentId);
    const sub = this.app.getSubModes().find(item => item.id === currentId) || null;
    return {
      current: { id: currentId, name: this.app.getModeLabel(currentId) },
      main: { id: parentId, name: this.app.getModeLabel(parentId) },
      sub: sub ? { id: sub.id, name: sub.label, parentMode: sub.parentMode } : null,
      available: this.app.getAvailableModes().map(id => ({
        id,
        name: this.app.getModeLabel(id),
        parentMode: this.app.getParentMode(id),
        isSubMode: !['home', 'sleep', 'away', 'vacation'].includes(id),
      })),
    };
  }

  _monitoring() {
    const states = this.app.getApplianceState();
    return this.app.getApplianceRules()
      .filter(rule => rule && rule.enabled !== false)
      .map(rule => {
        const state = states[rule.id] && typeof states[rule.id] === 'object' ? states[rule.id] : {};
        const rawStatus = state.status || 'idle';
        const status = rawStatus === 'ready' ? 'finished' : rawStatus;
        const durationMs = Math.max(0, Number(state.finalDurationMs ?? state.durationMs ?? 0) || 0);
        return {
          id: rule.id,
          name: rule.name || rule.id,
          type: rule.type || 'appliance',
          deviceId: rule.deviceId || '',
          status,
          sourceStatus: rawStatus,
          power: Number.isFinite(Number(state.lastPower)) ? Number(state.lastPower) : null,
          startedAt: this._timestamp(state.runStartedAt || state.startedAt),
          finishedAt: this._timestamp(state.readyAt || state.finishedAt),
          durationMs,
          duration: this.app._formatDuration(durationMs, this.app._getHomeyLanguage()),
          energyKwh: Math.round(Math.max(0, Number(state.finalEnergyKwh ?? state.energyKwh ?? 0) || 0) * 1000) / 1000,
          waitingForReset: rawStatus === 'ready',
        };
      });
  }

  _activities() {
    const now = Date.now();
    const states = this.app.getActivityState();
    return this.app.getActivityRules()
      .filter(rule => rule && rule.enabled !== false)
      .map(rule => {
        const state = states[rule.id] && typeof states[rule.id] === 'object' ? states[rule.id] : {};
        const active = state.status === 'active';
        const durationMs = active && state.startedAt
          ? Math.max(0, now - Number(state.startedAt))
          : Math.max(0, Number(state.durationMs || 0));
        return {
          id: rule.id,
          name: rule.name || rule.id,
          status: active ? 'active' : 'standby',
          active,
          startedAt: this._timestamp(state.startedAt),
          endedAt: this._timestamp(state.endedAt),
          durationMs,
          duration: this.app._formatDuration(durationMs, this.app._getHomeyLanguage()),
          waterUsed: Math.round(Math.max(0, Number(state.waterUsed || 0)) * 1000) / 1000,
          energyKwh: Math.round(Math.max(0, Number(state.energyKwh || 0)) * 1000) / 1000,
          gasUsed: Math.round(Math.max(0, Number(state.gasUsed || 0)) * 1000) / 1000,
        };
      });
  }

  _schedules() {
    const rules = this.app.getScheduleRules().filter(rule => rule && rule.enabled !== false);
    const currentMode = this.app.getCurrentMode();
    const mapRule = rule => {
      const modeIds = Array.isArray(rule.modeIds) ? [...rule.modeIds] : [];
      const modeRestricted = modeIds.length > 0;
      const modeMatch = !modeRestricted || modeIds.includes(currentMode);
      return {
        id: rule.id,
        name: rule.name || rule.id,
        enabled: rule.enabled !== false,
        action: rule.action || null,
        timeMode: rule.timeMode || null,
        fixedTime: rule.fixedTime || null,
        days: Array.isArray(rule.days) ? rule.days : [],
        modeIds,
        requiredModeIds: modeIds,
        modeRestricted,
        modeMatch,
        currentMode,
      };
    };
    const allItems = rules.map(mapRule);
    const items = allItems.filter(item => item.modeMatch);
    return {
      next: this.app._getNextDashboardSchedule(),
      enabledCount: rules.length,
      visibleCount: items.length,
      currentMode,
      items,
      // Kept separately for diagnostics/settings clients. Dashboard consumers
      // should use `items`, which contains only schedules valid for the current mode.
      allItems,
    };
  }

  _presence() {
    const settings = this.app.getAutoModeSettings();
    const autoState = this.app.homey.settings.get('auto_state') || {};
    return {
      available: Boolean(settings && settings.enabled),
      source: settings?.presenceSource || 'devices',
      selectedDeviceCount: Array.isArray(settings?.presenceDeviceIds) ? settings.presenceDeviceIds.length : 0,
      lastPresenceAt: this._timestamp(autoState.lastPresenceAt || autoState.lastHomeAt),
      lastAbsenceAt: this._timestamp(autoState.lastAbsenceAt || autoState.lastAwayAt),
      vacationSince: this._timestamp(autoState.vacationSince),
    };
  }

  _history() {
    const activityHistory = this.app.getActivityHistory();
    const items = [];
    for (const [activityId, entries] of Object.entries(activityHistory || {})) {
      if (!Array.isArray(entries)) continue;
      for (const entry of entries) {
        items.push({ activityId, ...entry });
      }
    }
    items.sort((a, b) => Number(b.endedAt || b.startedAt || b.timestamp || 0) - Number(a.endedAt || a.startedAt || a.timestamp || 0));
    return items.slice(0, 50);
  }

  _attention(monitoring, activities) {
    const attention = [];
    for (const item of monitoring) {
      if (item.status === 'finished') {
        attention.push({ id: `monitoring:${item.id}`, type: 'appliance_finished', severity: 'info', title: item.name, message: `${item.name} is klaar`, sourceId: item.id });
      }
    }
    for (const item of activities) {
      if (item.active) {
        attention.push({ id: `activity:${item.id}`, type: 'activity_active', severity: 'info', title: item.name, message: `${item.name} is actief`, sourceId: item.id });
      }
    }
    return attention;
  }

  getModes() { return this._mode(); }
  getMonitoring() { return this._monitoring(); }
  getActivities() { return this._activities(); }
  getSchedules() { return this._schedules(); }
  getPresence() { return this._presence(); }
  getHistory() { return this._history(); }

  getDashboard() {
    const monitoring = this._monitoring();
    const activities = this._activities();
    const schedules = this._schedules();
    const attention = this._attention(monitoring, activities);
    const mode = this._mode();
    return {
      schemaVersion: this.schemaVersion,
      apiVersion: this.schemaVersion,
      app: {
        id: this.app.homey.manifest?.id || 'com.modeswitch',
        version: this.app.homey.manifest?.version || '3.1.0',
      },
      appId: this.app.homey.manifest?.id || 'com.modeswitch',
      appVersion: this.app.homey.manifest?.version || '3.1.0',
      updatedAt: new Date().toISOString(),
      mode,
      presence: this._presence(),
      monitoring,
      activities,
      schedules,
      attention,
      // Backwards-compatible aliases for Home Overview 1.2.x.
      mainMode: mode.main,
      subMode: mode.sub,
      currentMode: mode.current,
      appliances: monitoring,
      nextSchedule: schedules.next,
      summary: {
        monitoringTotal: monitoring.length,
        appliancesRunning: monitoring.filter(item => item.status === 'running').length,
        appliancesFinished: monitoring.filter(item => item.status === 'finished').length,
        activitiesActive: activities.filter(item => item.active).length,
        attentionCount: attention.length,
      },
    };
  }
}

module.exports = DashboardService;
