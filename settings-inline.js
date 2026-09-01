

let HomeyInstance;
let APP_LANG = detectSupportedLanguage(navigator.language || 'nl');
function detectSupportedLanguage(value){
  const code = String(value || 'nl').toLowerCase().split('-')[0];
  if(code==='nb') return 'no';
  return ['nl','en','de','fr','es','no','sv','it'].includes(code) ? code : 'en';
}
document.documentElement.lang = APP_LANG;
  document.documentElement.style.setProperty('--hero-kicker', JSON.stringify(t('settings.hero.kicker')));

const I18N = {
  nl: {
    'settings.hero.description': 'Modussen, zoneregels, deur/raamcontacten, planning, zon/zonsondergang, lux en automatische modus.',
    'settings.current_mode.loading': 'Huidige modus: laden...',
    'settings.menu.section': 'Onderdeel',
    'common.refresh': 'Ververs',
    'common.save_all': 'Alles opslaan',
    'common.expand_all': 'Alles open',
    'common.collapse_all': 'Alles dicht',
    'common.select_all': 'Alles selecteren',
    'tabs.modes': 'Modussen',
    'tabs.zones': 'Zones & sensoren',
    'tabs.temperature': 'Temperatuur',
    'tabs.monitoring': 'Monitoring',
    'tabs.schedule': 'Planning',
    'tabs.import_export': 'Import/Export',
    'tabs.automatic_mode': 'Automatische modus',
    'tabs.mode_switch_devices': 'Mode & Switch devices',
    'tabs.activities': 'Activiteiten',
    'tabs.keypads': "Keypads",
    'settings.keypads.title': "Keypads",
    'settings.keypads.description': "Koppel een PIN rechtstreeks aan een modus. De PIN wordt na opslaan niet leesbaar bewaard.",
    'settings.keypads.add': "+ Keypad-mapping toevoegen",
    'tabs.debug': 'Debug',
    'settings.main_modes.title': 'Hoofdmodussen',
    'settings.main_modes.description': 'Pas alleen de zichtbare namen aan. De interne IDs blijven home, sleep, away en vacation zodat bestaande flows en regels blijven werken.',
    'settings.mode_switch_devices.title': 'Mode & Switch devices',
    'settings.mode_switch_devices.description': 'Koppel acties aan de lijstmodussen en aan/uit-knoppen van aangemaakte Mode & Switch devices.',
    'settings.mode_switch_devices.hint': 'Hier kun je per device en per modus apparaten of lampen aan of uit laten zetten, net als bij de oorspronkelijke controller.',
    'settings.mode_switch_devices.refresh': 'Devices verversen',
    'settings.activities.title': 'Activiteitenmonitoring',
    'settings.activities.description': 'Herken activiteiten op basis van meerdere voorwaarden, zoals water, gas, stroom, apparaatstatus of sensoren.',
    'settings.activities.hint': 'Klik een activiteit open om de naam, voorwaarden, drempels en historie-instellingen te wijzigen.',
    'settings.activities.add': 'Nieuwe activiteit',
    'settings.debug.title': 'Crashlog',
    'settings.debug.description': 'De laatste fouten van de app. Deze blijven bewaard na een automatische herstart.',
    'settings.debug.refresh': 'Crashlog verversen',
    'settings.debug.clear': 'Crashlog wissen',
    'settings.debug.not_loaded': 'Nog niet geladen.',
    'settings.submodes.title': 'Submodussen',
    'settings.submodes.description': 'Maak extra keuzes onder een hoofdmodus, bijvoorbeeld TV kijken onder Thuis.',
    'settings.submodes.add': 'Nieuwe submodus',
    'settings.zones.title': 'Zoneregels',
    'settings.zones.description': 'Beweging, deur/raamcontacten, subzones, lampen, dimmen en voorwaarden.',
    'settings.zones.add': 'Nieuwe zoneregel',
    'settings.temperature.title': 'Temperatuur per modus en zone',
    'settings.temperature.description': 'Stel per één of meerdere modussen en zone de gewenste temperatuur in. Apparaten met target_temperature worden automatisch aangepast bij een moduswissel.',
    'settings.temperature.add': 'Nieuwe temperatuurregel',
    'settings.display.title': 'Weergave huidige modus',
    'settings.display.description': 'Kies welk temperatuurapparaat rechtsboven in Huidige modus wordt getoond en of de Mode-widget live context toont.',
    'settings.display.temperature_device': 'Temperatuur in Huidige modus',
    'settings.display.temperature_device_hint': 'Kies een apparaat met temperatuurmeting. Leeg = geen badge tonen.',
    'settings.display.live_context': 'Weerbeeld als achtergrond bij hoofdmodussen',
    'settings.display.live_context_hint': 'Geeft de hoofdmodusknoppen automatisch een dag/nacht-achtergrond met zon, maan, wolken, regen, sneeuw, mist of onweer. Gebruikt het gekozen temperatuur-/weer-apparaat waar mogelijk.',
    'settings.appliances.title': 'Apparaatmeldingen',
    'settings.appliances.description': 'Detecteer starten en klaar zijn via stroomverbruik van een slimme stekker of apparaat met measure_power.',
    'settings.appliances.add': 'Nieuw apparaat',
    'settings.schedule.title': 'Planning',
    'settings.schedule.description': 'Zet lampen/apparaten aan of uit op vaste tijd, random tijd, zonsopkomst of zonsondergang. Gebruik eventueel lux per zone.',
    'settings.schedule.add': 'Nieuwe planning',
    'settings.import_export.title': 'Importeren / exporteren',
    'settings.import_export.description': 'Maak een back-up van alles of kies welke onderdelen je wilt meenemen.',
    'settings.export.title': 'Exporteren',
    'settings.export.description': 'Kies onderdelen en kopieer een JSON-back-up.',
    'settings.export.copy_json': 'Kopieer JSON',
    'settings.import.title': 'Importeren',
    'settings.import.description': 'Kies een eerder gemaakte JSON-back-up. Je kunt daarna selecteren welke onderdelen teruggezet worden.',
    'settings.import.placeholder': 'Plak hier eventueel de JSON-export als bestand kiezen niet werkt',
    'settings.import.load_from_text': 'JSON laden uit tekstveld',
    'settings.import.no_file': 'Nog geen bestand gekozen.',
    'settings.import.apply': 'Import toepassen'
  },
  en: {
    'settings.hero.description': 'Modes, zone rules, door/window contacts, schedules, sunrise/sunset, lux and automatic mode.',
    'settings.current_mode.loading': 'Current mode: loading...',
    'settings.menu.section': 'Section',
    'common.refresh': 'Refresh',
    'common.save_all': 'Save all',
    'common.expand_all': 'Expand all',
    'common.collapse_all': 'Collapse all',
    'common.select_all': 'Select all',
    'tabs.modes': 'Modes',
    'tabs.zones': 'Zones & sensors',
    'tabs.temperature': 'Temperature',
    'tabs.monitoring': 'Monitoring',
    'tabs.schedule': 'Schedule',
    'tabs.import_export': 'Import/Export',
    'tabs.automatic_mode': 'Automatic mode',
    'tabs.mode_switch_devices': 'Mode & Switch devices',
    'tabs.activities': 'Activities',
    'tabs.keypads': "Keypads",
    'settings.keypads.title': "Keypads",
    'settings.keypads.description': "Link a PIN directly to a mode. The PIN is not stored in readable form after saving.",
    'settings.keypads.add': "+ Add keypad mapping",
    'tabs.debug': 'Debug',
    'settings.main_modes.title': 'Main modes',
    'settings.main_modes.description': 'Only change the visible names. The internal IDs remain home, sleep, away and vacation so existing flows and rules keep working.',
    'settings.mode_switch_devices.title': 'Mode & Switch devices',
    'settings.mode_switch_devices.description': 'Link actions to the list modes and on/off switches of created Mode & Switch devices.',
    'settings.mode_switch_devices.hint': 'Configure devices or lights to switch on or off per device and mode, just like with the original controller.',
    'settings.mode_switch_devices.refresh': 'Refresh devices',
    'settings.activities.title': 'Activity monitoring',
    'settings.activities.description': 'Detect activities using multiple conditions such as water, gas, power, device status or sensors.',
    'settings.activities.hint': 'Open an activity to change its name, conditions, thresholds and history settings.',
    'settings.activities.add': 'New activity',
    'settings.debug.title': 'Crash log',
    'settings.debug.description': 'The latest app errors. These remain available after an automatic restart.',
    'settings.debug.refresh': 'Refresh crash log',
    'settings.debug.clear': 'Clear crash log',
    'settings.debug.not_loaded': 'Not loaded yet.',
    'settings.submodes.title': 'Sub modes',
    'settings.submodes.description': 'Create extra choices under a main mode, for example Watch TV under Home.',
    'settings.submodes.add': 'New sub mode',
    'settings.zones.title': 'Zone rules',
    'settings.zones.description': 'Motion, door/window contacts, subzones, lights, dimming and conditions.',
    'settings.zones.add': 'New zone rule',
    'settings.temperature.title': 'Temperature per mode and zone',
    'settings.temperature.description': 'Set the desired temperature for one or more modes per zone. Devices with target_temperature are updated automatically when the mode changes.',
    'settings.temperature.add': 'New temperature rule',
    'settings.display.title': 'Current mode display',
    'settings.display.description': 'Choose which temperature device is shown in the top-right of Current mode and whether the Mode widget shows live context.',
    'settings.display.temperature_device': 'Temperature in Current mode',
    'settings.display.temperature_device_hint': 'Choose a device with temperature measurement. Empty = hide badge.',
    'settings.display.live_context': 'Weather background on main modes',
    'settings.display.live_context_hint': 'Automatically gives the main mode buttons a day/night background with sun, moon, clouds, rain, snow, fog or thunder. Uses the selected temperature/weather device where possible.',
    'settings.appliances.title': 'Appliance notifications',
    'settings.appliances.description': 'Detect start and ready status using power consumption from a smart plug or device with measure_power.',
    'settings.appliances.add': 'New appliance',
    'settings.schedule.title': 'Schedule',
    'settings.schedule.description': 'Switch lights/devices on or off at a fixed time, random time, sunrise or sunset. Optionally use lux per zone.',
    'settings.schedule.add': 'New schedule',
    'settings.import_export.title': 'Import / export',
    'settings.import_export.description': 'Create a backup of everything or choose which sections to include.',
    'settings.export.title': 'Export',
    'settings.export.description': 'Choose sections and copy a JSON backup.',
    'settings.export.copy_json': 'Copy JSON',
    'settings.import.title': 'Import',
    'settings.import.description': 'Choose a previously created JSON backup. You can then select which sections to restore.',
    'settings.import.placeholder': 'Paste the JSON export here if choosing a file does not work',
    'settings.import.load_from_text': 'Load JSON from text field',
    'settings.import.no_file': 'No file selected yet.',
    'settings.import.apply': 'Apply import'
  }
,
  de: {
      "settings.__lang": "de",
      "settings.hero.description": "Modi, Zonenregeln, Tür-/Fensterkontakte, Zeitpläne, Sonnenauf-/untergang, Lux und automatischer Modus.",
      "settings.current_mode.loading": "Aktueller Modus: wird geladen...",
      "settings.menu.section": "Bereich",
      "common.refresh": "Aktualisieren",
      "common.save_all": "Alles speichern",
      "common.expand_all": "Alle öffnen",
      "common.collapse_all": "Alle schließen",
      "common.select_all": "Alle auswählen",
      "tabs.modes": "Modi",
      "tabs.zones": "Zonen & Sensoren",
      "tabs.temperature": "Temperatur",
      "tabs.monitoring": "Überwachung",
      "tabs.schedule": "Zeitplan",
      "tabs.import_export": "Import/Export",
      "tabs.automatic_mode": "Automatischer Modus",
    "tabs.mode_switch_devices": 'Mode-&-Switch-Geräte',
    "tabs.activities": 'Aktivitäten',
    'tabs.keypads': "Keypads",
    'settings.keypads.title': "Keypads",
    'settings.keypads.description': "Verknüpfe eine PIN direkt mit einem Modus. Die PIN wird nach dem Speichern nicht lesbar gespeichert.",
    'settings.keypads.add': "+ Keypad-Zuordnung hinzufügen",
    "tabs.debug": 'Debug',
    "settings.main_modes.title": 'Hauptmodi',
    "settings.main_modes.description": 'Ändere nur die sichtbaren Namen. Die internen IDs bleiben home, sleep, away und vacation, damit bestehende Flows und Regeln weiter funktionieren.',
    "settings.mode_switch_devices.title": 'Mode-&-Switch-Geräte',
    "settings.mode_switch_devices.description": 'Verknüpfe Aktionen mit den Listenmodi und Ein/Aus-Schaltern erstellter Mode-&-Switch-Geräte.',
    "settings.mode_switch_devices.hint": 'Hier kannst du pro Gerät und Modus Geräte oder Lampen ein- oder ausschalten lassen, wie beim ursprünglichen Controller.',
    "settings.mode_switch_devices.refresh": 'Geräte aktualisieren',
    "settings.activities.title": 'Aktivitätsüberwachung',
    "settings.activities.description": 'Erkenne Aktivitäten anhand mehrerer Bedingungen wie Wasser, Gas, Strom, Gerätestatus oder Sensoren.',
    "settings.activities.hint": 'Öffne eine Aktivität, um Name, Bedingungen, Schwellenwerte und Verlaufseinstellungen zu ändern.',
    "settings.activities.add": 'Neue Aktivität',
    "settings.debug.title": 'Absturzprotokoll',
    "settings.debug.description": 'Die letzten Fehler der App. Sie bleiben nach einem automatischen Neustart erhalten.',
    "settings.debug.refresh": 'Absturzprotokoll aktualisieren',
    "settings.debug.clear": 'Absturzprotokoll löschen',
    "settings.debug.not_loaded": 'Noch nicht geladen.',
      "settings.submodes.title": "Untermodi",
      "settings.submodes.description": "Erstelle zusätzliche Auswahlmöglichkeiten unter einem Hauptmodus, zum Beispiel Fernsehen unter Zuhause.",
      "settings.submodes.add": "Neuer Untermodus",
      "settings.zones.title": "Zonenregeln",
      "settings.zones.description": "Bewegung, Tür-/Fensterkontakte, Unterzonen, Lampen, Dimmen und Bedingungen.",
      "settings.zones.add": "Neue Zonenregel",
      "settings.temperature.title": "Temperatur pro Modus und Zone",
      "settings.temperature.description": "Lege die gewünschte Temperatur pro Modus und Zone fest. Geräte mit target_temperature werden bei einem Moduswechsel automatisch angepasst.",
      "settings.temperature.add": "Neue Temperaturregel",
      "settings.display.title": "Anzeige aktueller Modus",
      "settings.display.description": "Wähle, welches Temperaturgerät oben rechts im aktuellen Modus angezeigt wird und ob das Modus-Widget Live-Kontext zeigt.",
      "settings.display.temperature_device": "Temperatur im aktuellen Modus",
      "settings.display.temperature_device_hint": "Wähle ein Gerät mit Temperaturmessung. Leer = Badge ausblenden.",
      "settings.display.live_context": "Wetterhintergrund bei Hauptmodi",
      "settings.display.live_context_hint": "Gibt den Hauptmodus-Schaltflächen automatisch einen Tag-/Nacht-Hintergrund mit Sonne, Mond, Wolken, Regen, Schnee, Nebel oder Gewitter. Nutzt nach Möglichkeit das ausgewählte Temperatur-/Wettergerät.",
      "settings.appliances.title": "Gerätemeldungen",
      "settings.appliances.description": "Erkenne Start und Fertigstatus über den Stromverbrauch einer smarten Steckdose oder eines Geräts mit measure_power.",
      "settings.appliances.add": "Neues Gerät",
      "settings.schedule.title": "Zeitplan",
      "settings.schedule.description": "Schalte Lampen/Geräte zu festen Zeiten, zufällig, bei Sonnenaufgang oder Sonnenuntergang ein oder aus. Optional Lux pro Zone nutzen.",
      "settings.schedule.add": "Neuer Zeitplan",
      "settings.import_export.title": "Importieren / exportieren",
      "settings.import_export.description": "Erstelle ein Backup von allem oder wähle die Bereiche aus.",
      "settings.export.title": "Exportieren",
      "settings.export.description": "Wähle Bereiche und kopiere ein JSON-Backup.",
      "settings.export.copy_json": "JSON kopieren",
      "settings.import.title": "Importieren",
      "settings.import.description": "Wähle ein zuvor erstelltes JSON-Backup. Danach kannst du auswählen, welche Bereiche wiederhergestellt werden.",
      "settings.import.placeholder": "Füge hier den JSON-Export ein, wenn die Dateiauswahl nicht funktioniert",
      "settings.import.load_from_text": "JSON aus Textfeld laden",
      "settings.import.no_file": "Noch keine Datei ausgewählt.",
      "settings.import.apply": "Import anwenden"
  },
  fr: {
      "settings.__lang": "fr",
      "settings.hero.description": "Modes, règles de zone, contacts porte/fenêtre, plannings, lever/coucher du soleil, lux et mode automatique.",
      "settings.current_mode.loading": "Mode actuel : chargement...",
      "settings.menu.section": "Section",
      "common.refresh": "Actualiser",
      "common.save_all": "Tout enregistrer",
      "common.expand_all": "Tout ouvrir",
      "common.collapse_all": "Tout fermer",
      "common.select_all": "Tout sélectionner",
      "tabs.modes": "Modes",
      "tabs.zones": "Zones & capteurs",
      "tabs.temperature": "Température",
      "tabs.monitoring": "Surveillance",
      "tabs.schedule": "Planning",
      "tabs.import_export": "Import/Export",
      "tabs.automatic_mode": "Mode automatique",
    "tabs.mode_switch_devices": 'Appareils Mode & Switch',
    "tabs.activities": 'Activités',
    'tabs.keypads': "Claviers",
    'settings.keypads.title': "Claviers",
    'settings.keypads.description': "Associez directement un code PIN à un mode. Le code PIN n’est pas enregistré sous une forme lisible après l’enregistrement.",
    'settings.keypads.add': "+ Ajouter une association de clavier",
    "tabs.debug": 'Débogage',
    "settings.main_modes.title": 'Modes principaux',
    "settings.main_modes.description": 'Modifie uniquement les noms affichés. Les identifiants internes restent home, sleep, away et vacation afin que les flows et règles existants continuent de fonctionner.',
    "settings.mode_switch_devices.title": 'Appareils Mode & Switch',
    "settings.mode_switch_devices.description": 'Associe des actions aux modes de liste et aux interrupteurs marche/arrêt des appareils Mode & Switch créés.',
    "settings.mode_switch_devices.hint": 'Tu peux ici allumer ou éteindre des appareils ou lampes par appareil et par mode, comme avec le contrôleur d’origine.',
    "settings.mode_switch_devices.refresh": 'Actualiser les appareils',
    "settings.activities.title": 'Surveillance des activités',
    "settings.activities.description": 'Détecte les activités selon plusieurs conditions comme l’eau, le gaz, l’électricité, l’état d’un appareil ou des capteurs.',
    "settings.activities.hint": 'Ouvre une activité pour modifier son nom, ses conditions, ses seuils et ses paramètres d’historique.',
    "settings.activities.add": 'Nouvelle activité',
    "settings.debug.title": 'Journal des erreurs',
    "settings.debug.description": 'Les dernières erreurs de l’application. Elles restent disponibles après un redémarrage automatique.',
    "settings.debug.refresh": 'Actualiser le journal',
    "settings.debug.clear": 'Effacer le journal',
    "settings.debug.not_loaded": 'Pas encore chargé.',
      "settings.submodes.title": "Sous-modes",
      "settings.submodes.description": "Crée des choix supplémentaires sous un mode principal, par exemple Regarder la TV sous Maison.",
      "settings.submodes.add": "Nouveau sous-mode",
      "settings.zones.title": "Règles de zone",
      "settings.zones.description": "Mouvement, contacts porte/fenêtre, sous-zones, lampes, variation et conditions.",
      "settings.zones.add": "Nouvelle règle de zone",
      "settings.temperature.title": "Température par mode et zone",
      "settings.temperature.description": "Définis la température souhaitée par mode et zone. Les appareils avec target_temperature sont ajustés automatiquement lors du changement de mode.",
      "settings.temperature.add": "Nouvelle règle de température",
      "settings.display.title": "Affichage du mode actuel",
      "settings.display.description": "Choisis quel appareil de température s’affiche en haut à droite du mode actuel et si le widget Mode affiche le contexte en direct.",
      "settings.display.temperature_device": "Température dans le mode actuel",
      "settings.display.temperature_device_hint": "Choisis un appareil avec mesure de température. Vide = masquer le badge.",
      "settings.display.live_context": "Arrière-plan météo sur les modes principaux",
      "settings.display.live_context_hint": "Donne automatiquement aux boutons de mode principal un arrière-plan jour/nuit avec soleil, lune, nuages, pluie, neige, brouillard ou orage. Utilise si possible l’appareil température/météo sélectionné.",
      "settings.appliances.title": "Notifications d’appareils",
      "settings.appliances.description": "Détecte le démarrage et l’état prêt via la consommation d’une prise connectée ou d’un appareil avec measure_power.",
      "settings.appliances.add": "Nouvel appareil",
      "settings.schedule.title": "Planning",
      "settings.schedule.description": "Allume ou éteins les lampes/appareils à heure fixe, aléatoire, au lever ou au coucher du soleil. Utilise éventuellement les lux par zone.",
      "settings.schedule.add": "Nouveau planning",
      "settings.import_export.title": "Importer / exporter",
      "settings.import_export.description": "Crée une sauvegarde complète ou choisis les sections à inclure.",
      "settings.export.title": "Exporter",
      "settings.export.description": "Choisis les sections et copie une sauvegarde JSON.",
      "settings.export.copy_json": "Copier le JSON",
      "settings.import.title": "Importer",
      "settings.import.description": "Choisis une sauvegarde JSON créée précédemment. Tu peux ensuite sélectionner les sections à restaurer.",
      "settings.import.placeholder": "Colle ici l’export JSON si le choix de fichier ne fonctionne pas",
      "settings.import.load_from_text": "Charger le JSON depuis le champ texte",
      "settings.import.no_file": "Aucun fichier sélectionné.",
      "settings.import.apply": "Appliquer l’import"
  },
  es: {
      "settings.__lang": "es",
      "settings.hero.description": "Modos, reglas de zona, contactos de puerta/ventana, programación, amanecer/atardecer, lux y modo automático.",
      "settings.current_mode.loading": "Modo actual: cargando...",
      "settings.menu.section": "Sección",
      "common.refresh": "Actualizar",
      "common.save_all": "Guardar todo",
      "common.expand_all": "Abrir todo",
      "common.collapse_all": "Cerrar todo",
      "common.select_all": "Seleccionar todo",
      "tabs.modes": "Modos",
      "tabs.zones": "Zonas y sensores",
      "tabs.temperature": "Temperatura",
      "tabs.monitoring": "Monitorización",
      "tabs.schedule": "Programación",
      "tabs.import_export": "Importar/Exportar",
      "tabs.automatic_mode": "Modo automático",
    "tabs.mode_switch_devices": 'Dispositivos Mode & Switch',
    "tabs.activities": 'Actividades',
    'tabs.keypads': "Teclados",
    'settings.keypads.title': "Teclados",
    'settings.keypads.description': "Vincula directamente un PIN a un modo. El PIN no se guarda de forma legible después de guardar.",
    'settings.keypads.add': "+ Añadir asignación de teclado",
    "tabs.debug": 'Depuración',
    "settings.main_modes.title": 'Modos principales',
    "settings.main_modes.description": 'Cambia solo los nombres visibles. Los identificadores internos siguen siendo home, sleep, away y vacation para que los flows y reglas existentes continúen funcionando.',
    "settings.mode_switch_devices.title": 'Dispositivos Mode & Switch',
    "settings.mode_switch_devices.description": 'Vincula acciones a los modos de lista y a los interruptores de encendido/apagado de los dispositivos Mode & Switch creados.',
    "settings.mode_switch_devices.hint": 'Aquí puedes encender o apagar dispositivos o luces por dispositivo y modo, igual que con el controlador original.',
    "settings.mode_switch_devices.refresh": 'Actualizar dispositivos',
    "settings.activities.title": 'Monitorización de actividades',
    "settings.activities.description": 'Detecta actividades mediante varias condiciones, como agua, gas, electricidad, estado del dispositivo o sensores.',
    "settings.activities.hint": 'Abre una actividad para cambiar su nombre, condiciones, umbrales y ajustes del historial.',
    "settings.activities.add": 'Nueva actividad',
    "settings.debug.title": 'Registro de errores',
    "settings.debug.description": 'Los últimos errores de la aplicación. Permanecen disponibles después de un reinicio automático.',
    "settings.debug.refresh": 'Actualizar registro',
    "settings.debug.clear": 'Borrar registro',
    "settings.debug.not_loaded": 'Aún no cargado.',
      "settings.submodes.title": "Submodos",
      "settings.submodes.description": "Crea opciones adicionales bajo un modo principal, por ejemplo Ver TV bajo Casa.",
      "settings.submodes.add": "Nuevo submodo",
      "settings.zones.title": "Reglas de zona",
      "settings.zones.description": "Movimiento, contactos de puerta/ventana, subzonas, luces, regulación y condiciones.",
      "settings.zones.add": "Nueva regla de zona",
      "settings.temperature.title": "Temperatura por modo y zona",
      "settings.temperature.description": "Configura la temperatura deseada por modo y zona. Los dispositivos con target_temperature se ajustan automáticamente al cambiar de modo.",
      "settings.temperature.add": "Nueva regla de temperatura",
      "settings.display.title": "Visualización del modo actual",
      "settings.display.description": "Elige qué dispositivo de temperatura se muestra arriba a la derecha del modo actual y si el widget de modo muestra contexto en vivo.",
      "settings.display.temperature_device": "Temperatura en modo actual",
      "settings.display.temperature_device_hint": "Elige un dispositivo con medición de temperatura. Vacío = ocultar indicador.",
      "settings.display.live_context": "Fondo meteorológico en modos principales",
      "settings.display.live_context_hint": "Da automáticamente a los botones de modo principal un fondo día/noche con sol, luna, nubes, lluvia, nieve, niebla o tormenta. Usa el dispositivo de temperatura/tiempo seleccionado cuando sea posible.",
      "settings.appliances.title": "Notificaciones de aparatos",
      "settings.appliances.description": "Detecta inicio y estado listo mediante el consumo de una toma inteligente o un dispositivo con measure_power.",
      "settings.appliances.add": "Nuevo aparato",
      "settings.schedule.title": "Programación",
      "settings.schedule.description": "Enciende o apaga luces/dispositivos a una hora fija, aleatoria, al amanecer o al atardecer. Opcionalmente usa lux por zona.",
      "settings.schedule.add": "Nueva programación",
      "settings.import_export.title": "Importar / exportar",
      "settings.import_export.description": "Crea una copia de seguridad de todo o elige qué secciones incluir.",
      "settings.export.title": "Exportar",
      "settings.export.description": "Elige secciones y copia una copia JSON.",
      "settings.export.copy_json": "Copiar JSON",
      "settings.import.title": "Importar",
      "settings.import.description": "Elige una copia JSON creada anteriormente. Después puedes seleccionar qué secciones restaurar.",
      "settings.import.placeholder": "Pega aquí la exportación JSON si elegir archivo no funciona",
      "settings.import.load_from_text": "Cargar JSON desde campo de texto",
      "settings.import.no_file": "Aún no se ha seleccionado ningún archivo.",
      "settings.import.apply": "Aplicar importación"
  }};

const PHRASE_I18N = {
  "no": {
      "React immediately to window/door changes": "Reager direkte på endringer i vindu/dør",
      "Optional. When enabled, this temperature rule is reapplied immediately when a selected window or door opens or closes.": "Valgfritt. Når dette er aktivert, brukes temperaturregelen på nytt med én gang et valgt vindu eller en valgt dør åpnes eller lukkes.",
      "live window/door": "direkte vindu/dør",
      "delayed": "forsinket",
      "Delayed actions": "Forsinkede handlinger",
      "Light settings": "Lysinnstillinger",
      "Add light setting": "Legg til lysinnstilling",
      "Light": "Lys",
      "State": "Status",
      "Dim level %": "Dimmenivå %",
      "Color temperature %": "Fargetemperatur %",
      "Color": "Farge",
      "Set color": "Angi farge",
      "Set color when switching on": "Angi farge ved påslåing",
      "Supports: ": "Støtter: ",
      "dimming": "dimming",
      "color temperature": "fargetemperatur",
      "color": "farge",
      "Only on/off is available.": "Bare av/på er tilgjengelig.",
      "Add delayed action": "Legg til forsinket handling",
      "Device / plug": "Enhet / plugg",
      "Action": "Handling",
      "On": "På",
      "Off": "Av",
      "Delay": "Forsinkelse",
      "Seconds": "Sekunder",
      "Minutes": "Minutter",
      "Hours": "Timer",
      "No delayed actions.": "Ingen forsinkede handlinger.",
      "Choose the main mode and enter a clear name for the sub mode.": "Velg hovedmodus og skriv inn et tydelig navn på undermodusen.",
      "For example Watch TV": "For eksempel Se på TV",
      "After adding, you can adjust all remaining settings in the opened item.": "Etter at du har lagt til, kan du justere resten av innstillingene i elementet.",
      "Add": "Legg til",
      "Active under": "Aktiv under",
      "Automatic": "Automatisk",
      "Manual": "Manuell",
      "Choose...": "Velg…",
      "Home": "Hjemme",
      "Current mode": "Gjeldende modus",
      "Mode": "Modus",
      "Modes": "Moduser",
      "Sub mode": "Undermodus",
      "Sub modes": "Undermoduser",
      "Main mode": "Hovedmodus",
      "New sub mode": "Ny undermodus",
      "Delete": "Slett",
      "Name": "Navn",
      "Icon / emoji": "Ikon / emoji",
      "Accent color": "Aksentfarge",
      "Background image URL": "URL til bakgrunnsbilde",
      "Widget styling": "Widget-stil",
      "Automatic sub mode": "Automatisk undermodus",
      "Automatically activate by power measurement": "Aktiver automatisk via effektmåling",
      "Smart plug / device": "Smartplugg / enhet",
      "Condition": "Betingelse",
      "Watt value": "Wattverdi",
      "Delay sec.": "Forsinkelse sek.",
      "Automatic return": "Automatisk retur",
      "Automatically return to main mode": "Gå automatisk tilbake til hovedmodus",
      "Return when value": "Gå tilbake når verdi",
      "Return watt value": "Wattverdi for retur",
      "Return delay sec.": "Returforsinkelse sek.",
      "Devices on": "Enheter på",
      "Devices off": "Enheter av",
      "These devices turn on in this mode.": "Disse enhetene slås på i denne modusen.",
      "These devices turn off in this mode.": "Disse enhetene slås av i denne modusen.",
      "Activate": "Aktiver",
      "Zone rules": "Soneregler",
      "New zone rule": "Ny soneregel",
      "Zone/room": "Sone/rom",
      "Include subzones/rooms": "Ta med undersoner/rom",
      "Motion sensors": "Bevegelsessensorer",
      "Door/window sensors": "Dør-/vindussensorer",
      "Lights": "Lys",
      "Rule active": "Regel aktiv",
      "Turn lights on when motion is detected": "Slå på lys ved bevegelse",
      "Turn lights off after no motion": "Slå av lys etter ingen bevegelse",
      "Turn lights on when contact is active": "Slå på lys når kontakt er aktiv",
      "Turn lights off when contact is inactive": "Slå av lys når kontakt er inaktiv",
      "Invert door/window contact: closed = on, open = off": "Inverter dør-/vinduskontakt: lukket = på, åpen = av",
      "No motion after seconds": "Ingen bevegelse etter sekunder",
      "Dim value": "Dimmeverdi",
      "Only switch on if selected lights are off": "Slå bare på hvis valgte lys er av",
      "Conditions": "Betingelser",
      "Only within time window": "Bare innenfor tidsvindu",
      "From": "Fra",
      "Until": "Til",
      "Only when dark enough": "Bare når det er mørkt nok",
      "Lux sensors": "Luxsensorer",
      "Dark below lux value": "Mørkt under luxverdi",
      "Test zone": "Test sone",
      "Temperature": "Temperatur",
      "Temperature rule": "Temperaturregel",
      "New temperature rule": "Ny temperaturregel",
      "Temperature per mode and zone": "Temperatur per modus og sone",
      "Thermostats": "Termostater",
      "Window/door open": "Vindu/dør åpent",
      "Ignore window/door": "Ignorer vindu/dør",
      "Do not heat when open": "Ikke varm når åpent",
      "Different temperature when open": "Annen temperatur når åpent",
      "Temperature when window/door is open": "Temperatur når vindu/dør er åpent",
      "Window/door sensors": "Vindu-/dørsensorer",
      "Smart heating": "Smart oppvarming",
      "Smart heating using weather device": "Smart oppvarming via værenhet",
      "Weather device / outdoor temperature": "Værenhet / utetemperatur",
      "Cold below °C": "Kaldt under °C",
      "Increase setpoint by °C": "Øk settpunkt med °C",
      "Warm above °C": "Varmt over °C",
      "Decrease setpoint by °C": "Senk settpunkt med °C",
      "Minimum setpoint": "Minimum settpunkt",
      "Maximum setpoint": "Maksimum settpunkt",
      "Appliance notifications": "Apparatvarsler",
      "New appliance": "Nytt apparat",
      "Appliance": "Apparat",
      "Washing machine": "Vaskemaskin",
      "Dryer": "Tørketrommel",
      "Dishwasher": "Oppvaskmaskin",
      "Other": "Annet",
      "Status": "Status",
      "Running": "Kjører",
      "Ready / waiting for reset": "Ferdig / venter på reset",
      "Off / idle": "Av / inaktiv",
      "Start above watts": "Start over watt",
      "Start delay sec.": "Startforsinkelse sek.",
      "Ready below watts": "Ferdig under watt",
      "Ready delay sec.": "Ferdigforsinkelse sek.",
      "Reset after ready": "Reset etter ferdig",
      "Manual / on new run": "Manuelt / ved ny kjøring",
      "After activity": "Etter aktivitet",
      "After fixed time": "Etter fast tid",
      "Reset after sec.": "Reset etter sek.",
      "Reset on motion": "Reset ved bevegelse",
      "Reset on door opened": "Reset når dør åpnes",
      "Reset on light on": "Reset når lys slås på",
      "Monitoring active": "Overvåking aktiv",
      "Flow trigger when started": "Flow-trigger ved start",
      "Flow trigger when ready": "Flow-trigger når ferdig",
      "Repeat ready trigger until reset": "Gjenta ferdig-trigger til reset",
      "Repeat every sec.": "Gjenta hvert sek.",
      "Also add to Activity timeline": "Legg også til på aktivitetstidslinjen",
      "Schedule": "Planlegging",
      "New schedule": "Ny planlegging",
      "Devices/lights": "Enheter/lys",
      "Time type": "Tidstype",
      "Fixed time": "Fast tidspunkt",
      "Random between times": "Tilfeldig mellom tider",
      "Sunrise": "Soloppgang",
      "Sunset": "Solnedgang",
      "Sun offset": "Soloffset",
      "Random from": "Tilfeldig fra",
      "Random until": "Tilfeldig til",
      "Days": "Dager",
      "Follow-up action after running": "Oppfølgingshandling etter kjøring",
      "When this schedule turns on: automatically switch off": "Når planen slår på: slå automatisk av",
      "Switch off by": "Slå av via",
      "Switch off after hours": "Slå av etter timer",
      "Switch off at time": "Slå av kl.",
      "When this schedule turns off: automatically switch on": "Når planen slår av: slå automatisk på",
      "Switch on by": "Slå på via",
      "Switch on after hours": "Slå på etter timer",
      "Switch on at time": "Slå på kl.",
      "Lux condition": "Luxbetingelse",
      "Only run when lux condition matches": "Kjør bare når luxbetingelsen stemmer",
      "Lux value": "Luxverdi",
      "Schedule active": "Planlegging aktiv",
      "Automatic mode": "Automatisk modus",
      "Automatic mode active": "Automatisk modus aktiv",
      "Presence source": "Tilstedeværelseskilde",
      "Presence devices": "Tilstedeværelsesenheter",
      "Homey users": "Homey-brukere",
      "Both sources": "Begge kilder",
      "Presence devices/people": "Tilstedeværelsesenheter/personer",
      "Minimum number at home for Home mode": "Minimum antall hjemme for Hjemme-modus",
      "After how many hours away switch to Vacation": "Etter hvor mange timer borte skal Ferie aktiveres",
      "Automatically enable Sleep mode": "Aktiver Sove-modus automatisk",
      "Automatically return to Home when someone is awake and at home": "Gå automatisk tilbake til Hjemme når noen er våkne og hjemme",
      "Sleep indicators": "Soveindikatorer",
      "All selected sleep indicators must be true": "Alle valgte soveindikatorer må være sanne",
      "Motion sensors without motion": "Bevegelsessensorer uten bevegelse",
      "Door/window contacts closed": "Dør-/vinduskontakter lukket",
      "Socket rules": "Stikkontaktregler",
      "Socket": "Stikkontakt",
      "Wattage": "Effekt",
      "Add socket rule": "Legg til stikkontaktregel",
      "Settings saved": "Innstillinger lagret",
      "Mode applied": "Modus brukt",
      "Reloaded": "Lastet på nytt",
      "JSON copied to clipboard.": "JSON kopiert til utklippstavlen.",
      "Import applied.": "Import utført.",
      "Unknown error": "Ukjent feil",
      "above": "over",
      "below": "under",
      "no zone": "ingen sone",
      "no mode": "ingen modus",
      "all modes": "alle moduser",
      "devices": "enheter",
      "lights": "lys",
      "motion": "bevegelse",
      "door/window": "dør/vindu",
      "incl. subzones": "inkl. undersoner",
      "above or equal to": "over eller lik",
      "below or equal to": "under eller lik",
      "weather compensation on": "værkompensasjon på",
      "weather compensation off": "værkompensasjon av",
      "ignore window": "ignorer vindu",
      "skip when window open": "hopp over når vindu er åpent",
      "No sub modes configured yet.": "Ingen undermoduser er konfigurert ennå.",
      "Sub mode name": "Navn på undermodus",
      "For example 🎬, 🎮 or ♥.": "For eksempel 🎬, 🎮 eller ♥.",
      "Color for glow and active buttons.": "Farge for glød og aktive knapper.",
      "Paste a direct image link. Empty = gradient based on accent color.": "Lim inn en direkte bildelenke. Tomt = gradient basert på aksentfargen.",
      "The ID stays the same so existing rules keep working.": "ID-en forblir den samme slik at eksisterende regler fortsetter å virke.",
      "Choose a device with power measurement (measure_power).": "Velg en enhet med effektmåling (measure_power).",
      "No zone rules yet.": "Ingen soneregler ennå.",
      "Optional 0-1": "Valgfritt 0–1",
      "Zone rule tested": "Soneregel testet",
      "No temperature rules yet.": "Ingen temperaturregler ennå.",
      "Leave empty = all thermostats in this zone.": "La stå tomt = alle termostater i denne sonen.",
      "Uses contact sensors in the same zone.": "Bruker kontaktsensorer i samme sone.",
      "Only used for: Different temperature when open.": "Brukes bare for: Annen temperatur når åpent.",
      "Leave empty = all contact sensors in this zone. Also includes subzones when that option is enabled.": "La stå tomt = alle kontaktsensorer i denne sonen. Undersoner tas også med når dette er aktivert.",
      "Choose a device with measure_temperature, for example your weather app.": "Velg en enhet med measure_temperature, for eksempel værappen din.",
      "Temperature rule added. Do not forget to click Save all.": "Temperaturregel lagt til. Husk å trykke Lagre alt.",
      "no device selected": "ingen enhet valgt",
      "No appliance notifications yet.": "Ingen apparatvarsler ennå.",
      "Reset only after the appliance is ready.": "Reset først etter at apparatet er ferdig.",
      "Only used for fixed time. 0 = no automatic reset.": "Brukes bare ved fast tid. 0 = ingen automatisk reset.",
      "No schedules yet.": "Ingen planlegginger ennå.",
      "After X hours": "Etter X timer",
      "At fixed time": "På fast tidspunkt",
      "Random after X-Y hours": "Tilfeldig etter X–Y timer",
      "Only in modes": "Bare i moduser",
      "Minutes before/after sunrise or sunset. For example -30 or 15.": "Minutter før/etter soloppgang eller solnedgang. For eksempel -30 eller 15.",
      "Empty means: every day.": "Tomt betyr: hver dag.",
      "Select at least 1 section to export.": "Velg minst én del som skal eksporteres.",
      "JSON is ready. Copy it with the button or manually from the text field below.": "JSON er klar. Kopier med knappen eller manuelt fra tekstfeltet under.",
      "Select and copy the JSON manually.": "Velg og kopier JSON manuelt.",
      "Found sections: ": "Fant deler: ",
      "No valid sections found.": "Ingen gyldige deler funnet.",
      "Not a valid Mode Switch export file.": "Ikke en gyldig Mode Switch-eksportfil.",
      "Import file loaded. Select sections and apply import.": "Importfil lastet. Velg deler og bruk import.",
      "Choose an import file first or paste JSON.": "Velg først en importfil eller lim inn JSON.",
      "Select at least 1 section to import.": "Velg minst én del som skal importeres.",
      "Applying import...": "Bruker import…",
      "Import applied: ": "Import utført: ",
      "Import failed: ": "Import mislyktes: ",
      "No socket rules yet. Add below/above + wattage per socket.": "Ingen stikkontaktregler ennå. Legg til under/over + wattverdi per stikkontakt.",
      "Duration": "Varighet",
      "Type": "Type",
      "at ": "kl. ",
      "off:": "av:",
      "on:": "på:",
      "Leave empty = include all Homey users. If your Homey does not return presence data, use Presence devices or Both.": "La stå tomt = ta med alle Homey-brukere. Hvis Homey ikke returnerer tilstedeværelsesdata, bruk Tilstedeværelsesenheter eller Begge.",
      "No Homey users/presence found. Use Presence devices or try Both.": "Ingen Homey-brukere/tilstedeværelse funnet. Bruk Tilstedeværelsesenheter eller prøv Begge.",
      "Use Homey users, presence devices or both. Sleep mode can use combined indicators.": "Bruk Homey-brukere, tilstedeværelsesenheter eller begge. Sove-modus kan bruke kombinerte indikatorer.",
      "Choose Homey users for native Homey Presence, or Both as a safe fallback.": "Velg Homey-brukere for innebygd Homey Presence, eller Begge som sikker reserve.",
      "Only needed when using Presence devices or Both.": "Bare nødvendig ved bruk av Tilstedeværelsesenheter eller Begge.",
      "Switch to Vacation after this many hours away. 0 = disabled.": "Bytt til Ferie etter så mange timer borte. 0 = deaktivert.",
      "Use one or more indicators.": "Bruk én eller flere indikatorer.",
      "Automatically return to Home": "Gå automatisk tilbake til Hjemme",
      "Use sleep indicators": "Bruk soveindikatorer",
      "Only when everyone is away": "Bare når alle er borte",
      "True when all selected motion sensors report no motion.": "Sann når alle valgte bevegelsessensorer melder ingen bevegelse.",
      "True when all selected contacts are closed/inactive.": "Sann når alle valgte kontakter er lukket/inaktive.",
      "For each socket, choose below/above and the wattage value.": "Velg under/over og wattverdi for hver stikkontakt.",
      "The Homey settings API is not ready yet. Reopen the settings page.": "Homey-innstillings-API-et er ikke klart ennå. Åpne innstillingssiden på nytt.",
      "JSON loaded. Select sections and apply import.": "JSON lastet. Velg deler og bruk import."
  },
  "de": {
    "React immediately to window/door changes": "Direkt auf Fenster-/Türänderungen reagieren",
    "Optional. When enabled, this temperature rule is reapplied immediately when a selected window or door opens or closes.": "Optional. Wenn dies aktiviert ist, wird diese Temperaturregel sofort erneut angewendet, sobald sich ein ausgewähltes Fenster oder eine Tür öffnet oder schließt.",
    "live window/door": "Live Fenster/Tür",
    "delayed": "verzögert",
    "Delayed actions": "Verzögerte Aktionen",
    "Light settings": "Lichteinstellungen",
    "Add light setting": "Lichteinstellung hinzufügen",
    "Set on/off, dim level, color temperature, color and an optional delay per light. Only supported options are applied.": "Stelle pro Lampe Ein/Aus, Dimmwert, Farbtemperatur, Farbe und optional eine Verzögerung ein. Es werden nur unterstützte Optionen angewendet.",
    "For this schedule, set on/off, dim level, color temperature, color and an optional delay per light.": "Stelle für diesen Zeitplan pro Lampe Ein/Aus, Dimmwert, Farbtemperatur, Farbe und optional eine Verzögerung ein.",
    "Light": "Lampe",
    "State": "Status",
    "Dim level %": "Dimmwert %",
    "Color temperature %": "Farbtemperatur %",
    "Color": "Farbe",
    "Set color": "Farbe einstellen",
    "Set color when switching on": "Farbe beim Einschalten einstellen",
    "0 = warm, 100 = cool": "0 = warm, 100 = kühl",
    "0 warm - 100 cool": "0 warm - 100 kühl",
    "Supports: ": "Unterstützt: ",
    "dimming": "Dimmen",
    "color temperature": "Farbtemperatur",
    "color": "Farbe",
    "Only on/off is available.": "Nur Ein/Aus ist verfügbar.",
    "Add delayed action": "Verzögerte Aktion hinzufügen",
    "Device / plug": "Gerät / Steckdose",
    "Action": "Aktion",
    "On": "Ein",
    "Off": "Aus",
    "Delay": "Verzögerung",
    "Seconds": "Sekunden",
    "Minutes": "Minuten",
    "Hours": "Stunden",
    "No delayed actions.": "Keine verzögerten Aktionen.",
    "These actions run only if this mode is still active when the delay expires.": "Diese Aktionen werden nur ausgeführt, wenn dieser Modus nach Ablauf der Verzögerung noch aktiv ist.",
    'Choose the main mode and enter a clear name for the sub mode.': 'Wähle den Hauptmodus und gib einen eindeutigen Namen für den Untermodus ein.',
    'For example Watch TV': 'Zum Beispiel Fernsehen',
    'After adding, you can adjust all remaining settings in the opened item.': 'Nach dem Hinzufügen kannst du alle weiteren Einstellungen im geöffneten Eintrag anpassen.',
    'Add': 'Hinzufügen',
    "Active under": "Aktiv unter",
    "Automatic": "Automatisch",
    "Manual": "Manuell",
    "Choose...": "Auswählen...",
    "Home": "Zuhause",
    "Current mode": "Aktueller Modus",
    "Mode": "Modus",
    "Modes": "Modi",
    "Sub mode": "Untermodus",
    "Sub modes": "Untermodi",
    "Main mode": "Hauptmodus",
    "New sub mode": "Neuer Untermodus",
    "Delete": "Löschen",
    "Name": "Name",
    "Icon / emoji": "Icon / Emoji",
    "Accent color": "Akzentfarbe",
    "Background image URL": "Hintergrundbild-URL",
    "Widget styling": "Widget-Styling",
    "Automatic sub mode": "Automatischer Untermodus",
    "Automatically activate by power measurement": "Automatisch über Strommessung aktivieren",
    "Smart plug / device": "Smarte Steckdose / Gerät",
    "Condition": "Bedingung",
    "Watt value": "Wattwert",
    "Delay sec.": "Verzögerung Sek.",
    "Automatic return": "Automatische Rückkehr",
    "Automatically return to main mode": "Automatisch zum Hauptmodus zurückkehren",
    "Return when value": "Zurückkehren, wenn Wert",
    "Return watt value": "Rückkehr-Wattwert",
    "Return delay sec.": "Rückkehrverzögerung Sek.",
    "Devices on": "Geräte ein",
    "Devices off": "Geräte aus",
    "These devices turn on in this mode.": "Diese Geräte werden in diesem Modus eingeschaltet.",
    "These devices turn off in this mode.": "Diese Geräte werden in diesem Modus ausgeschaltet.",
    "Activate": "Aktivieren",
    "Zone rules": "Zonenregeln",
    "New zone rule": "Neue Zonenregel",
    "Zone/room": "Zone/Raum",
    "Include subzones/rooms": "Unterzonen/Räume einbeziehen",
    "Motion sensors": "Bewegungssensoren",
    "Door/window sensors": "Tür-/Fenstersensoren",
    "Lights": "Lampen",
    "Rule active": "Regel aktiv",
    "Turn lights on when motion is detected": "Lampen bei Bewegung einschalten",
    "Turn lights off after no motion": "Lampen nach keiner Bewegung ausschalten",
    "Turn lights on when contact is active": "Lampen bei aktivem Kontakt einschalten",
    "Turn lights off when contact is inactive": "Lampen bei inaktivem Kontakt ausschalten",
    "Invert door/window contact: closed = on, open = off": "Tür-/Fensterkontakt umkehren: geschlossen = ein, offen = aus",
    "No motion after seconds": "Keine Bewegung nach Sekunden",
    "Dim value": "Dimmwert",
    "Only switch on if selected lights are off": "Nur einschalten, wenn ausgewählte Lampen aus sind",
    "Conditions": "Bedingungen",
    "Only within time window": "Nur innerhalb des Zeitfensters",
    "From": "Von",
    "Until": "Bis",
    "Only when dark enough": "Nur wenn es dunkel genug ist",
    "Lux sensors": "Luxsensoren",
    "Dark below lux value": "Dunkel unter Luxwert",
    "Test zone": "Zone testen",
    "Temperature": "Temperatur",
    "Temperature rule": "Temperaturregel",
    "New temperature rule": "Neue Temperaturregel",
    "Temperature per mode and zone": "Temperatur pro Modus und Zone",
    "Thermostats": "Thermostate",
    "Window/door open": "Fenster/Tür offen",
    "Ignore window/door": "Fenster/Tür ignorieren",
    "Do not heat when open": "Bei offenem Fenster nicht heizen",
    "Different temperature when open": "Andere Temperatur wenn offen",
    "Temperature when window/door is open": "Temperatur bei offenem Fenster/Tür",
    "Window/door sensors": "Fenster-/Türsensoren",
    "Smart heating": "Smart Heizen",
    "Smart heating using weather device": "Smart Heizen über Wettergerät",
    "Weather device / outdoor temperature": "Wettergerät / Außentemperatur",
    "Cold below °C": "Kalt unter °C",
    "Increase setpoint by °C": "Sollwert erhöhen um °C",
    "Warm above °C": "Warm über °C",
    "Decrease setpoint by °C": "Sollwert senken um °C",
    "Minimum setpoint": "Minimaler Sollwert",
    "Maximum setpoint": "Maximaler Sollwert",
    "Appliance notifications": "Gerätemeldungen",
    "New appliance": "Neues Gerät",
    "Appliance": "Gerät",
    "Washing machine": "Waschmaschine",
    "Dryer": "Trockner",
    "Dishwasher": "Geschirrspüler",
    "Other": "Sonstiges",
    "Status": "Status",
    "Running": "Aktiv",
    "Ready / waiting for reset": "Fertig / wartet auf Reset",
    "Off / idle": "Aus / inaktiv",
    "Start above watts": "Start über Watt",
    "Start delay sec.": "Startverzögerung Sek.",
    "Ready below watts": "Fertig unter Watt",
    "Ready delay sec.": "Fertig-Verzögerung Sek.",
    "Reset after ready": "Reset nach Fertig",
    "Manual / on new run": "Manuell / bei neuem Lauf",
    "After activity": "Nach Aktivität",
    "After fixed time": "Nach fester Zeit",
    "Reset after sec.": "Reset nach Sek.",
    "Reset on motion": "Reset bei Bewegung",
    "Reset on door opened": "Reset bei Türöffnung",
    "Reset on light on": "Reset bei Licht an",
    "Monitoring active": "Überwachung aktiv",
    "Flow trigger when started": "Flow-Trigger beim Start",
    "Flow trigger when ready": "Flow-Trigger wenn fertig",
    "Repeat ready trigger until reset": "Fertig-Trigger bis Reset wiederholen",
    "Repeat every sec.": "Alle Sek. wiederholen",
    "Also add to Activity timeline": "Auch zur Aktivitäten-Timeline hinzufügen",
    "Schedule": "Zeitplan",
    "New schedule": "Neuer Zeitplan",
    "Action": "Aktion",
    "On": "Ein",
    "Off": "Aus",
    "Devices/lights": "Geräte/Lampen",
    "Time type": "Zeittyp",
    "Fixed time": "Feste Zeit",
    "Random between times": "Zufällig zwischen Zeiten",
    "Sunrise": "Sonnenaufgang",
    "Sunset": "Sonnenuntergang",
    "Sun offset": "Sonnen-Offset",
    "Random from": "Zufällig ab",
    "Random until": "Zufällig bis",
    "Days": "Tage",
    "Follow-up action after running": "Folgeaktion nach Ausführung",
    "When this schedule turns on: automatically switch off": "Wenn dieser Zeitplan einschaltet: automatisch wieder ausschalten",
    "Switch off by": "Ausschalten über",
    "Switch off after hours": "Ausschalten nach Stunden",
    "Switch off at time": "Ausschalten um Uhrzeit",
    "When this schedule turns off: automatically switch on": "Wenn dieser Zeitplan ausschaltet: automatisch wieder einschalten",
    "Switch on by": "Einschalten über",
    "Switch on after hours": "Einschalten nach Stunden",
    "Switch on at time": "Einschalten um Uhrzeit",
    "Lux condition": "Lux-Bedingung",
    "Only run when lux condition matches": "Nur ausführen, wenn Lux-Bedingung passt",
    "Lux value": "Luxwert",
    "Schedule active": "Zeitplan aktiv",
    "Automatic mode": "Automatischer Modus",
    "Automatic mode active": "Automatischer Modus aktiv",
    "Presence source": "Anwesenheitsquelle",
    "Presence devices": "Anwesenheitsgeräte",
    "Homey users": "Homey-Benutzer",
    "Both sources": "Beide Quellen",
    "Presence devices/people": "Anwesenheitsgeräte/Personen",
    "Minimum number at home for Home mode": "Mindestanzahl zuhause für Modus Zuhause",
    "After how many hours away switch to Vacation": "Nach wie vielen Stunden Abwesenheit auf Urlaub schalten",
    "Automatically enable Sleep mode": "Automatisch Schlafmodus aktivieren",
    "Automatically return to Home when someone is awake and at home": "Automatisch zu Zuhause zurück, wenn jemand wach und zuhause ist",
    "Sleep indicators": "Schlafindikatoren",
    "All selected sleep indicators must be true": "Alle ausgewählten Schlafindikatoren müssen wahr sein",
    "Motion sensors without motion": "Bewegungssensoren ohne Bewegung",
    "Door/window contacts closed": "Tür-/Fensterkontakte geschlossen",
    "Socket rules": "Steckdosenregeln",
    "Socket": "Steckdose",
    "Wattage": "Wattzahl",
    "Add socket rule": "Steckdosenregel hinzufügen",
    "Settings saved": "Einstellungen gespeichert",
    "Mode applied": "Modus angewendet",
    "Reloaded": "Neu geladen",
    "JSON copied to clipboard.": "JSON in die Zwischenablage kopiert.",
    "Import applied.": "Import angewendet.",
    "Unknown error": "Unbekannter Fehler",
    "on": "ein",
    "off": "aus",
    "above": "über",
    "below": "unter",
    "no zone": "keine Zone",
    "no mode": "kein Modus",
    "all modes": "alle Modi",
    "devices": "Geräte",
    "lights": "Lampen",
    "motion": "Bewegung",
    "door/window": "Tür/Fenster",
    "incl. subzones": "inkl. Unterzonen",
    "above or equal to": "größer oder gleich",
    "below or equal to": "kleiner oder gleich",
    "sunrise": "Sonnenaufgang",
    "sunset": "Sonnenuntergang",
    "weather compensation on": "Wetterkorrektur ein",
    "weather compensation off": "Wetterkorrektur aus",
    "window open ": "Fenster offen ",
    "ignore window": "Fenster ignorieren",
    "skip when window open": "überspringen bei offenem Fenster"
  ,
    "No sub modes configured yet.": "Noch keine Untermodi eingerichtet.",
    "Nog geen submodussen ingesteld.": "Noch keine Untermodi eingerichtet.",
    "Sub mode name": "Name des Untermodus",
    "Naam submodus": "Name des Untermodus",
    "Verwijderen": "Löschen",
    "For example 🎬, 🎮 or ♥.": "Zum Beispiel 🎬, 🎮 oder ♥.",
    "Bijvoorbeeld 🎬, 🎮 of ♥.": "Zum Beispiel 🎬, 🎮 oder ♥.",
    "Color for glow and active buttons.": "Farbe für Leuchten und aktive Schaltflächen.",
    "Kleur voor glow en actieve knoppen.": "Farbe für Leuchten und aktive Schaltflächen.",
    "Paste a direct image link. Empty = gradient based on accent color.": "Füge einen direkten Bildlink ein. Leer = Verlauf basierend auf der Akzentfarbe.",
    "Plak een directe afbeeldingslink. Leeg = gradient op basis van accentkleur.": "Füge einen direkten Bildlink ein. Leer = Verlauf basierend auf der Akzentfarbe.",
    "The ID stays the same so existing rules keep working.": "Die ID bleibt gleich, damit bestehende Regeln weiter funktionieren.",
    "De ID blijft gelijk zodat bestaande regels blijven werken.": "Die ID bleibt gleich, damit bestehende Regeln weiter funktionieren.",
    "Choose a device with power measurement (measure_power).": "Wähle ein Gerät mit Strommessung (measure_power).",
    "Kies een apparaat met stroommeting (measure_power).": "Wähle ein Gerät mit Strommessung (measure_power).",
    "Example: Watching TV activates above 40W and returns to Home when the smart plug stays below 15W for 5 minutes.": "Beispiel: Fernsehen wird über 40 W aktiviert und kehrt zu Zuhause zurück, wenn die smarte Steckdose 5 Minuten lang unter 15 W bleibt.",
    "Voorbeeld: TV kijken activeert boven 40W en keert terug naar Thuis als het stopcontact 5 minuten onder 15W blijft.": "Beispiel: Fernsehen wird über 40 W aktiviert und kehrt zu Zuhause zurück, wenn die smarte Steckdose 5 Minuten lang unter 15 W bleibt.",
    "No zone rules yet.": "Noch keine Zonenregeln.",
    "Nog geen zoneregels.": "Noch keine Zonenregeln.",
    "Optional 0-1": "Optional 0-1",
    "Optioneel 0-1": "Optional 0-1",
    "Zone rule tested": "Zonenregel getestet",
    "Zoneregel getest": "Zonenregel getestet",
    "No temperature rules yet.": "Noch keine Temperaturregeln.",
    "Nog geen temperatuurregels.": "Noch keine Temperaturregeln.",
    "Leave empty = all thermostats in this zone.": "Leer lassen = alle Thermostate in dieser Zone.",
    "Leeg laten = alle thermostaten in deze zone.": "Leer lassen = alle Thermostate in dieser Zone.",
    "Uses contact sensors in the same zone.": "Verwendet Kontaktsensoren in derselben Zone.",
    "Kijkt naar contact-sensoren in dezelfde zone.": "Verwendet Kontaktsensoren in derselben Zone.",
    "Only used for: Different temperature when open.": "Nur verwendet bei: Andere Temperatur wenn offen.",
    "Alleen gebruikt bij: Andere temperatuur als open.": "Nur verwendet bei: Andere Temperatur wenn offen.",
    "Leave empty = all contact sensors in this zone. Also includes subzones when that option is enabled.": "Leer lassen = alle Kontaktsensoren in dieser Zone. Bezieht auch Unterzonen ein, wenn diese Option aktiviert ist.",
    "Leeg laten = alle contact-sensoren in deze zone. Werkt ook met subzones als die optie aan staat.": "Leer lassen = alle Kontaktsensoren in dieser Zone. Bezieht auch Unterzonen ein, wenn diese Option aktiviert ist.",
    "Choose a device with measure_temperature, for example your weather app.": "Wähle ein Gerät mit measure_temperature, zum Beispiel deine Wetter-App.",
    "Kies een device met measure_temperature, bijvoorbeeld je weerapp.": "Wähle ein Gerät mit measure_temperature, zum Beispiel deine Wetter-App.",
    "Temperature rule added. Do not forget to click Save all.": "Temperaturregel hinzugefügt. Vergiss nicht, auf Alles speichern zu klicken.",
    "Temperatuurregel toegevoegd. Vergeet niet op Alles opslaan te klikken.": "Temperaturregel hinzugefügt. Vergiss nicht, auf Alles speichern zu klicken.",
    "no device selected": "kein Gerät ausgewählt",
    "geen apparaat gekozen": "kein Gerät ausgewählt",
    "No appliance notifications yet.": "Noch keine Gerätemeldungen.",
    "Nog geen apparaatmeldingen.": "Noch keine Gerätemeldungen.",
    "Reset only after the appliance is ready.": "Zurücksetzen erst, nachdem das Gerät fertig ist.",
    "Reset pas nadat het apparaat klaar is.": "Zurücksetzen erst, nachdem das Gerät fertig ist.",
    "Reset na sec.": "Reset nach Sek.",
    "Only used for fixed time. 0 = no automatic reset.": "Nur bei fester Zeit verwendet. 0 = kein automatisches Zurücksetzen.",
    "Alleen gebruikt bij vaste tijd. 0 = niet automatisch.": "Nur bei fester Zeit verwendet. 0 = kein automatisches Zurücksetzen.",
    "Reset bij beweging": "Reset bei Bewegung",
    "Only sensors in the same zone as the selected appliance and child zones.": "Nur Sensoren in derselben Zone wie das ausgewählte Gerät und in Unterzonen.",
    "Alleen sensoren in dezelfde zone als het gekozen apparaat en onderliggende zones.": "Nur Sensoren in derselben Zone wie das ausgewählte Gerät und in Unterzonen.",
    "Reset bij deur open": "Reset bei geöffneter Tür",
    "Reset bij lamp aan": "Reset bei eingeschalteter Lampe",
    "Choose specific lights in the same zone as the selected appliance and child zones.": "Wähle bestimmte Lampen in derselben Zone wie das ausgewählte Gerät und in Unterzonen.",
    "Kies specifieke lampen in dezelfde zone als het gekozen apparaat en onderliggende zones.": "Wähle bestimmte Lampen in derselben Zone wie das ausgewählte Gerät und in Unterzonen.",
    "Herhaal klaar-trigger tot reset": "Fertig-Trigger bis Reset wiederholen",
    "Herhaal elke sec.": "Alle Sek. wiederholen",
    "Ook op Activiteiten-tijdlijn zetten": "Auch zur Aktivitäten-Timeline hinzufügen",
    "Appliance notification added. Do not forget to click Save all.": "Gerätemeldung hinzugefügt. Vergiss nicht, auf Alles speichern zu klicken.",
    "Apparaatmelding toegevoegd. Vergeet niet op Alles opslaan te klikken.": "Gerätemeldung hinzugefügt. Vergiss nicht, auf Alles speichern zu klicken.",
    "No schedules yet.": "Noch keine Zeitpläne.",
    "Nog geen planningen.": "Noch keine Zeitpläne.",
    "After X hours": "Nach X Stunden",
    "Na X uur": "Nach X Stunden",
    "At fixed time": "Zu fester Uhrzeit",
    "Op vaste tijd": "Zu fester Uhrzeit",
    "Random after X-Y hours": "Zufällig nach X-Y Stunden",
    "Random na X-Y uur": "Zufällig nach X-Y Stunden",
    "Only in modes": "Nur in Modi",
    "Alleen in modussen": "Nur in Modi",
    "Minutes before/after sunrise or sunset. For example -30 or 15.": "Minuten vor/nach Sonnenaufgang oder Sonnenuntergang. Zum Beispiel -30 oder 15.",
    "Minuten voor/na zonsopkomst of zonsondergang. Bijvoorbeeld -30 of 15.": "Minuten vor/nach Sonnenaufgang oder Sonnenuntergang. Zum Beispiel -30 oder 15.",
    "Empty means: every day.": "Leer bedeutet: jeden Tag.",
    "Leeg betekent: alle dagen.": "Leer bedeutet: jeden Tag.",
    "Vervolgactie na uitvoeren": "Folgeaktion nach Ausführung",
    "Random after from hours": "Zufällig nach ab Stunden",
    "Random na vanaf uur": "Zufällig nach ab Stunden",
    "Random after until hours": "Zufällig nach bis Stunden",
    "Random na tot uur": "Zufällig nach bis Stunden",
    "Random off from": "Zufällig aus ab",
    "Random uit vanaf": "Zufällig aus ab",
    "Random off until": "Zufällig aus bis",
    "Random uit tot": "Zufällig aus bis",
    "Random on after from hours": "Zufällig ein nach ab Stunden",
    "Random aan na vanaf uur": "Zufällig ein nach ab Stunden",
    "Random on after until hours": "Zufällig ein nach bis Stunden",
    "Random aan na tot uur": "Zufällig ein nach bis Stunden",
    "Random on from": "Zufällig ein ab",
    "Random aan vanaf": "Zufällig ein ab",
    "Random on until": "Zufällig ein bis",
    "Random aan tot": "Zufällig ein bis",
    "Automatic switch-off is only shown for action On. Automatic switch-on is only shown for action Off.": "Automatisches Ausschalten wird nur bei Aktion Ein angezeigt. Automatisches Einschalten wird nur bei Aktion Aus angezeigt.",
    "Automatisch uitzetten verschijnt alleen bij actie Aan. Automatisch aanzetten verschijnt alleen bij actie Uit.": "Automatisches Ausschalten wird nur bei Aktion Ein angezeigt. Automatisches Einschalten wird nur bei Aktion Aus angezeigt.",
    "Alleen uitvoeren bij luxvoorwaarde": "Nur ausführen, wenn die Lux-Bedingung passt",
    "Zone/room for lux": "Zone/Raum für Lux",
    "Zone/kamer voor lux": "Zone/Raum für Lux",
    "Leave empty = all lux sensors in this zone.": "Leer lassen = alle Luxsensoren in dieser Zone.",
    "Leeg laten = alle luxsensoren in deze zone.": "Leer lassen = alle Luxsensoren in dieser Zone.",
    "Select at least 1 section to export.": "Wähle mindestens 1 Bereich zum Exportieren.",
    "Kies minimaal 1 onderdeel om te exporteren.": "Wähle mindestens 1 Bereich zum Exportieren.",
    "JSON is ready. Copy it with the button or manually from the text field below.": "JSON ist bereit. Kopiere es mit der Schaltfläche oder manuell aus dem Textfeld unten.",
    "JSON staat klaar. Kopieer via de knop of handmatig vanuit het tekstveld hieronder.": "JSON ist bereit. Kopiere es mit der Schaltfläche oder manuell aus dem Textfeld unten.",
    "Select and copy the JSON manually.": "Wähle die JSON-Daten aus und kopiere sie manuell.",
    "Selecteer en kopieer de JSON handmatig.": "Wähle die JSON-Daten aus und kopiere sie manuell.",
    "Found sections: ": "Gefundene Bereiche: ",
    "Gevonden onderdelen: ": "Gefundene Bereiche: ",
    "No valid sections found.": "Keine gültigen Bereiche gefunden.",
    "Geen geldige onderdelen gevonden.": "Keine gültigen Bereiche gefunden.",
    "Not a valid Mode Switch export file.": "Keine gültige Mode-Switch-Exportdatei.",
    "Geen geldig Mode Switch exportbestand.": "Keine gültige Mode-Switch-Exportdatei.",
    "Import file loaded. Select sections and apply import.": "Importdatei geladen. Wähle Bereiche und wende den Import an.",
    "Importbestand geladen. Kies onderdelen en klik op import toepassen.": "Importdatei geladen. Wähle Bereiche und wende den Import an.",
    "Choose an import file first or paste JSON.": "Wähle zuerst eine Importdatei oder füge JSON ein.",
    "Kies eerst een importbestand of plak JSON.": "Wähle zuerst eine Importdatei oder füge JSON ein.",
    "Select at least 1 section to import.": "Wähle mindestens 1 Bereich zum Importieren.",
    "Kies minimaal 1 onderdeel om te importeren.": "Wähle mindestens 1 Bereich zum Importieren.",
    "Applying import...": "Import wird angewendet...",
    "Import wordt toegepast...": "Import wird angewendet...",
    "Import applied: ": "Import angewendet: ",
    "Import toegepast: ": "Import angewendet: ",
    "Import failed: ": "Import fehlgeschlagen: ",
    "Import mislukt: ": "Import fehlgeschlagen: ",
    "No socket rules yet. Add below/above + wattage per socket.": "Noch keine Steckdosenregeln. Füge pro Steckdose unter/über + Wattzahl hinzu.",
    "Nog geen stopcontactregels. Voeg per stopcontact onder/boven + wattage toe.": "Noch keine Steckdosenregeln. Füge pro Steckdose unter/über + Wattzahl hinzu.",
    "Verwijder": "Löschen",
    "Stopcontact": "Steckdose",
    "Stopcontactregel toevoegen": "Steckdosenregel hinzufügen",
    "Presence apparaten": "Anwesenheitsgeräte",
    "Homey gebruikers": "Homey-Benutzer",
    "Beide bronnen": "Beide Quellen",
    "Automatische modus actief": "Automatischer Modus aktiv",
    "Aanwezigheidsbron": "Anwesenheitsquelle",
    "Presence apparaten/personen": "Anwesenheitsgeräte/Personen",
    "Minimaal aantal thuis voor modus Thuis": "Mindestanzahl zuhause für Modus Zuhause",
    "Na hoeveel uur afwezig naar Vakantie": "Nach wie vielen Stunden Abwesenheit auf Urlaub schalten",
    "Automatisch terug naar Thuis als iemand wakker én thuis is": "Automatisch zu Zuhause zurückkehren, wenn jemand wach und zuhause ist",
    "Alle gekozen slaapindicaties moeten waar zijn": "Alle ausgewählten Schlafindikatoren müssen wahr sein",
    "Bewegingssensoren zonder beweging": "Bewegungssensoren ohne Bewegung",
    "Deur-/raamcontacten gesloten": "Tür-/Fensterkontakte geschlossen",
    "Stopcontactregels": "Steckdosenregeln",
    "Duration": "Dauer",
    "Type": "Typ",
    "at ": "um ",
    "off:": "aus:",
    "on:": "ein:",
    "window open '+(r.windowTemperature||15)+'°C": "Fenster offen '+(r.windowTemperature||15)+'°C",
    " - home": " - zuhause",
    " - away": " - abwesend",
    " - asleep": " - schläft",
    " - awake": " - wach",
    "Leave empty = include all Homey users. If your Homey does not return presence data, use Presence devices or Both.": "Leer lassen = alle Homey-Benutzer einbeziehen. Wenn dein Homey keine Anwesenheitsdaten liefert, nutze Anwesenheitsgeräte oder Beide.",
    "No Homey users/presence found. Use Presence devices or try Both.": "Keine Homey-Benutzer/Anwesenheit gefunden. Nutze Anwesenheitsgeräte oder versuche Beide.",
    "Use Homey users, presence devices or both. Sleep mode can use combined indicators.": "Nutze Homey-Benutzer, Anwesenheitsgeräte oder beides. Der Schlafmodus kann kombinierte Indikatoren verwenden.",
    "Choose Homey users for native Homey Presence, or Both as a safe fallback.": "Wähle Homey-Benutzer für native Homey-Anwesenheit oder Beide als sichere Fallback-Option.",
    "Only needed when using Presence devices or Both.": "Nur nötig bei Anwesenheitsgeräte oder Beide.",
    "Switch to Vacation after this many hours away. 0 = disabled.": "Nach so vielen Stunden Abwesenheit auf Urlaub schalten. 0 = deaktiviert.",
    "Use one or more indicators.": "Verwende einen oder mehrere Indikatoren.",
    "Automatically return to Home": "Automatisch zu Zuhause zurückkehren",
    "Use sleep indicators": "Schlafindikatoren verwenden",
    "Only when everyone is away": "Nur wenn alle abwesend sind",
    "Deur-/raamcontact omkeren: dicht = aan, open = uit": "Tür-/Fensterkontakt umkehren: geschlossen = ein, offen = aus",
    "raam open '+(r.windowTemperature||15)+'°C": "Fenster offen '+(r.windowTemperature||15)+'°C",
    "Raam/deur sensoren": "Fenster-/Türsensoren",
    "Duur": "Dauer",
    "om ": "um ",
    "uit:": "aus:",
    "aan:": "ein:",
    "JSON gekopieerd naar klembord.": "JSON in die Zwischenablage kopiert.",
    "Import toegepast.": "Import angewendet.",
    " - thuis": " - zuhause",
    " - afwezig": " - abwesend",
    " - slaapt": " - schläft",
    " - wakker": " - wach",
    "Leeg laten = alle Homey gebruikers meenemen. Als jouw Homey geen presence-data teruggeeft, gebruik dan Presence apparaten of Beide.": "Leer lassen = alle Homey-Benutzer einbeziehen. Wenn dein Homey keine Anwesenheitsdaten liefert, nutze Anwesenheitsgeräte oder Beide.",
    "Geen Homey gebruikers/presence gevonden. Gebruik Presence apparaten of probeer Beide.": "Keine Homey-Benutzer/Anwesenheit gefunden. Nutze Anwesenheitsgeräte oder versuche Beide.",
    "Gebruik Homey gebruikers, presence-apparaten of beide. Slaap kan met samengestelde indicaties.": "Nutze Homey-Benutzer, Anwesenheitsgeräte oder beides. Der Schlafmodus kann kombinierte Indikatoren verwenden.",
    "Kies Homey gebruikers voor native Homey Presence, of Beide als veilige fallback.": "Wähle Homey-Benutzer für native Homey-Anwesenheit oder Beide als sichere Fallback-Option.",
    "Alleen nodig bij bron Presence apparaten of Beide.": "Nur nötig bei Anwesenheitsgeräte oder Beide.",
    "Automatisch naar Slapen inschakelen": "Schlafmodus automatisch aktivieren",
    "mode": "Modus",
    "all": "alle",
    "random": "zufällig",
    "True when all selected motion sensors report no motion.": "Wahr, wenn alle ausgewählten Bewegungssensoren keine Bewegung melden.",
    "True when all selected contacts are closed/inactive.": "Wahr, wenn alle ausgewählten Kontakte geschlossen/inaktiv sind.",
    "For each socket, choose below/above and the wattage value.": "Wähle pro Steckdose unter/über und den Wattwert.",
    "The Homey settings API is not ready yet. Reopen the settings page.": "Die Homey-Einstellungs-API ist noch nicht bereit. Öffne die Einstellungsseite erneut.",
    "JSON loaded. Select sections and apply import.": "JSON geladen. Wähle Bereiche und wende den Import an.",
    "modus": "Modus",
    "alle": "alle",
    "Waar als alle gekozen bewegingssensoren geen beweging melden.": "Wahr, wenn alle ausgewählten Bewegungssensoren keine Bewegung melden.",
    "Waar als alle gekozen contacten dicht/inactief zijn.": "Wahr, wenn alle ausgewählten Kontakte geschlossen/inaktiv sind.",
    "Per stopcontact kies je onder/boven en de wattagewaarde.": "Wähle pro Steckdose unter/über und den Wattwert.",
    "Homey settings API is nog niet klaar. Heropen de instellingenpagina.": "Die Homey-Einstellungs-API ist noch nicht bereit. Öffne die Einstellungsseite erneut.",
    "JSON geladen. Kies onderdelen en klik op import toepassen.": "JSON geladen. Wähle Bereiche und wende den Import an."},
  "fr": {
    "React immediately to window/door changes": "Réagir immédiatement aux changements de fenêtre/porte",
    "Optional. When enabled, this temperature rule is reapplied immediately when a selected window or door opens or closes.": "Optionnel. Si cette option est activée, cette règle de température est réappliquée immédiatement lorsqu’une fenêtre ou une porte sélectionnée s’ouvre ou se ferme.",
    "live window/door": "fenêtre/porte en direct",
    "delayed": "différée",
    "Delayed actions": "Actions différées",
    "Light settings": "Réglages d’éclairage",
    "Add light setting": "Ajouter un réglage d’éclairage",
    "Set on/off, dim level, color temperature, color and an optional delay per light. Only supported options are applied.": "Définissez marche/arrêt, variation, température de couleur, couleur et éventuellement un délai par lampe. Seules les options prises en charge sont appliquées.",
    "For this schedule, set on/off, dim level, color temperature, color and an optional delay per light.": "Pour ce planning, définissez par lampe marche/arrêt, variation, température de couleur, couleur et éventuellement un délai.",
    "Light": "Lampe",
    "State": "État",
    "Dim level %": "Niveau de variation %",
    "Color temperature %": "Température de couleur %",
    "Color": "Couleur",
    "Set color": "Définir la couleur",
    "Set color when switching on": "Définir la couleur à l’allumage",
    "0 = warm, 100 = cool": "0 = chaud, 100 = froid",
    "0 warm - 100 cool": "0 chaud - 100 froid",
    "Supports: ": "Prend en charge : ",
    "dimming": "variation",
    "color temperature": "température de couleur",
    "color": "couleur",
    "Only on/off is available.": "Seul marche/arrêt est disponible.",
    "Add delayed action": "Ajouter une action différée",
    "Device / plug": "Appareil / prise",
    "Action": "Action",
    "On": "Allumer",
    "Off": "Éteindre",
    "Delay": "Délai",
    "Seconds": "Secondes",
    "Minutes": "Minutes",
    "Hours": "Heures",
    "No delayed actions.": "Aucune action différée.",
    "These actions run only if this mode is still active when the delay expires.": "Ces actions ne sont exécutées que si ce mode est toujours actif à la fin du délai.",
    'Choose the main mode and enter a clear name for the sub mode.': 'Choisis le mode principal et saisis un nom clair pour le sous-mode.',
    'For example Watch TV': 'Par exemple Regarder la TV',
    'After adding, you can adjust all remaining settings in the opened item.': 'Après l’ajout, tu peux modifier tous les autres paramètres dans l’élément ouvert.',
    'Add': 'Ajouter',
    "Active under": "Actif sous",
    "Automatic": "Automatique",
    "Manual": "Manuel",
    "Choose...": "Choisir...",
    "Home": "Maison",
    "Current mode": "Mode actuel",
    "Mode": "Mode",
    "Modes": "Modes",
    "Sub mode": "Sous-mode",
    "Sub modes": "Sous-modes",
    "Main mode": "Mode principal",
    "New sub mode": "Nouveau sous-mode",
    "Delete": "Supprimer",
    "Name": "Nom",
    "Icon / emoji": "Icône / emoji",
    "Accent color": "Couleur d’accent",
    "Background image URL": "URL de l’image d’arrière-plan",
    "Widget styling": "Style du widget",
    "Automatic sub mode": "Sous-mode automatique",
    "Automatically activate by power measurement": "Activer automatiquement par mesure de puissance",
    "Smart plug / device": "Prise connectée / appareil",
    "Condition": "Condition",
    "Watt value": "Valeur en watts",
    "Delay sec.": "Délai sec.",
    "Automatic return": "Retour automatique",
    "Automatically return to main mode": "Retour automatique au mode principal",
    "Return when value": "Retour quand la valeur",
    "Return watt value": "Valeur watt de retour",
    "Return delay sec.": "Délai de retour sec.",
    "Devices on": "Appareils allumés",
    "Devices off": "Appareils éteints",
    "These devices turn on in this mode.": "Ces appareils s’allument dans ce mode.",
    "These devices turn off in this mode.": "Ces appareils s’éteignent dans ce mode.",
    "Activate": "Activer",
    "Zone rules": "Règles de zone",
    "New zone rule": "Nouvelle règle de zone",
    "Zone/room": "Zone/pièce",
    "Include subzones/rooms": "Inclure les sous-zones/pièces",
    "Motion sensors": "Capteurs de mouvement",
    "Door/window sensors": "Capteurs porte/fenêtre",
    "Lights": "Lampes",
    "Rule active": "Règle active",
    "Turn lights on when motion is detected": "Allumer les lampes en cas de mouvement",
    "Turn lights off after no motion": "Éteindre les lampes après absence de mouvement",
    "Turn lights on when contact is active": "Allumer les lampes quand le contact est actif",
    "Turn lights off when contact is inactive": "Éteindre les lampes quand le contact est inactif",
    "No motion after seconds": "Absence de mouvement après secondes",
    "Dim value": "Valeur de variation",
    "Only switch on if selected lights are off": "Allumer seulement si les lampes sélectionnées sont éteintes",
    "Conditions": "Conditions",
    "Only within time window": "Seulement dans la plage horaire",
    "From": "De",
    "Until": "À",
    "Only when dark enough": "Seulement s’il fait assez sombre",
    "Lux sensors": "Capteurs lux",
    "Dark below lux value": "Sombre sous la valeur lux",
    "Test zone": "Tester la zone",
    "Temperature": "Température",
    "Temperature rule": "Règle de température",
    "New temperature rule": "Nouvelle règle de température",
    "Thermostats": "Thermostats",
    "Window/door open": "Fenêtre/porte ouverte",
    "Ignore window/door": "Ignorer fenêtre/porte",
    "Do not heat when open": "Ne pas chauffer si ouvert",
    "Different temperature when open": "Température différente si ouvert",
    "Temperature when window/door is open": "Température quand fenêtre/porte est ouverte",
    "Smart heating": "Chauffage intelligent",
    "Smart heating using weather device": "Chauffage intelligent via appareil météo",
    "Weather device / outdoor temperature": "Appareil météo / température extérieure",
    "Cold below °C": "Froid sous °C",
    "Increase setpoint by °C": "Augmenter la consigne de °C",
    "Warm above °C": "Chaud au-dessus de °C",
    "Decrease setpoint by °C": "Réduire la consigne de °C",
    "Minimum setpoint": "Consigne minimale",
    "Maximum setpoint": "Consigne maximale",
    "Appliance notifications": "Notifications d’appareils",
    "New appliance": "Nouvel appareil",
    "Appliance": "Appareil",
    "Washing machine": "Lave-linge",
    "Dryer": "Sèche-linge",
    "Dishwasher": "Lave-vaisselle",
    "Other": "Autre",
    "Status": "Statut",
    "Running": "Actif",
    "Ready / waiting for reset": "Prêt / attente de réinitialisation",
    "Off / idle": "Éteint / inactif",
    "Start above watts": "Démarrer au-dessus de watts",
    "Start delay sec.": "Délai de démarrage sec.",
    "Ready below watts": "Prêt sous watts",
    "Ready delay sec.": "Délai prêt sec.",
    "Reset after ready": "Réinitialiser après prêt",
    "Manual / on new run": "Manuel / au nouveau cycle",
    "After activity": "Après activité",
    "After fixed time": "Après durée fixe",
    "Monitoring active": "Surveillance active",
    "Flow trigger when started": "Déclencheur Flow au démarrage",
    "Flow trigger when ready": "Déclencheur Flow quand prêt",
    "Schedule": "Planning",
    "New schedule": "Nouveau planning",
    "Action": "Action",
    "On": "Allumé",
    "Off": "Éteint",
    "Devices/lights": "Appareils/lampes",
    "Time type": "Type d’heure",
    "Fixed time": "Heure fixe",
    "Random between times": "Aléatoire entre heures",
    "Sunrise": "Lever du soleil",
    "Sunset": "Coucher du soleil",
    "Sun offset": "Décalage soleil",
    "Random from": "Aléatoire depuis",
    "Random until": "Aléatoire jusqu’à",
    "Days": "Jours",
    "When this schedule turns on: automatically switch off": "Quand ce planning allume : éteindre automatiquement",
    "Switch off by": "Éteindre via",
    "Switch off after hours": "Éteindre après heures",
    "Switch off at time": "Éteindre à l’heure",
    "When this schedule turns off: automatically switch on": "Quand ce planning éteint : rallumer automatiquement",
    "Switch on by": "Allumer via",
    "Switch on after hours": "Allumer après heures",
    "Switch on at time": "Allumer à l’heure",
    "Lux condition": "Condition lux",
    "Lux value": "Valeur lux",
    "Schedule active": "Planning actif",
    "Automatic mode": "Mode automatique",
    "Automatic mode active": "Mode automatique actif",
    "Presence source": "Source de présence",
    "Presence devices": "Appareils de présence",
    "Homey users": "Utilisateurs Homey",
    "Both sources": "Deux sources",
    "Presence devices/people": "Appareils/personnes de présence",
    "Automatically enable Sleep mode": "Activer automatiquement le mode Sommeil",
    "Sleep indicators": "Indicateurs de sommeil",
    "Socket rules": "Règles de prise",
    "Socket": "Prise",
    "Wattage": "Puissance",
    "Add socket rule": "Ajouter une règle de prise",
    "Settings saved": "Paramètres enregistrés",
    "Mode applied": "Mode appliqué",
    "Reloaded": "Rechargé",
    "Unknown error": "Erreur inconnue",
    "on": "allumé",
    "off": "éteint",
    "above": "au-dessus",
    "below": "en dessous",
    "no zone": "aucune zone",
    "no mode": "aucun mode",
    "all modes": "tous les modes",
    "devices": "appareils",
    "lights": "lampes",
    "motion": "mouvement",
    "door/window": "porte/fenêtre",
    "incl. subzones": "incl. sous-zones",
    "above or equal to": "supérieur ou égal à",
    "below or equal to": "inférieur ou égal à",
    "sunrise": "lever du soleil",
    "sunset": "coucher du soleil",
    "weather compensation on": "correction météo activée",
    "weather compensation off": "correction météo désactivée",
    "ignore window": "ignorer fenêtre",
    "skip when window open": "ignorer si fenêtre ouverte"
  ,
    "No sub modes configured yet.": "Aucun sous-mode configuré pour le moment.",
    "Nog geen submodussen ingesteld.": "Aucun sous-mode configuré pour le moment.",
    "Sub mode name": "Nom du sous-mode",
    "Naam submodus": "Nom du sous-mode",
    "Verwijderen": "Supprimer",
    "For example 🎬, 🎮 or ♥.": "Par exemple 🎬, 🎮 ou ♥.",
    "Bijvoorbeeld 🎬, 🎮 of ♥.": "Par exemple 🎬, 🎮 ou ♥.",
    "Color for glow and active buttons.": "Couleur pour l’éclat et les boutons actifs.",
    "Kleur voor glow en actieve knoppen.": "Couleur pour l’éclat et les boutons actifs.",
    "Paste a direct image link. Empty = gradient based on accent color.": "Colle un lien direct vers une image. Vide = dégradé basé sur la couleur d’accent.",
    "Plak een directe afbeeldingslink. Leeg = gradient op basis van accentkleur.": "Colle un lien direct vers une image. Vide = dégradé basé sur la couleur d’accent.",
    "The ID stays the same so existing rules keep working.": "L’ID reste identique afin que les règles existantes continuent de fonctionner.",
    "De ID blijft gelijk zodat bestaande regels blijven werken.": "L’ID reste identique afin que les règles existantes continuent de fonctionner.",
    "Choose a device with power measurement (measure_power).": "Choisis un appareil avec mesure de puissance (measure_power).",
    "Kies een apparaat met stroommeting (measure_power).": "Choisis un appareil avec mesure de puissance (measure_power).",
    "Example: Watching TV activates above 40W and returns to Home when the smart plug stays below 15W for 5 minutes.": "Exemple : Regarder la TV s’active au-dessus de 40 W et revient à Maison lorsque la prise connectée reste sous 15 W pendant 5 minutes.",
    "Voorbeeld: TV kijken activeert boven 40W en keert terug naar Thuis als het stopcontact 5 minuten onder 15W blijft.": "Exemple : Regarder la TV s’active au-dessus de 40 W et revient à Maison lorsque la prise connectée reste sous 15 W pendant 5 minutes.",
    "No zone rules yet.": "Aucune règle de zone pour le moment.",
    "Nog geen zoneregels.": "Aucune règle de zone pour le moment.",
    "Optional 0-1": "Optionnel 0-1",
    "Optioneel 0-1": "Optionnel 0-1",
    "Zone rule tested": "Règle de zone testée",
    "Zoneregel getest": "Règle de zone testée",
    "No temperature rules yet.": "Aucune règle de température pour le moment.",
    "Nog geen temperatuurregels.": "Aucune règle de température pour le moment.",
    "Leave empty = all thermostats in this zone.": "Laisser vide = tous les thermostats dans cette zone.",
    "Leeg laten = alle thermostaten in deze zone.": "Laisser vide = tous les thermostats dans cette zone.",
    "Uses contact sensors in the same zone.": "Utilise les capteurs de contact dans la même zone.",
    "Kijkt naar contact-sensoren in dezelfde zone.": "Utilise les capteurs de contact dans la même zone.",
    "Only used for: Different temperature when open.": "Utilisé uniquement pour : Température différente si ouvert.",
    "Alleen gebruikt bij: Andere temperatuur als open.": "Utilisé uniquement pour : Température différente si ouvert.",
    "Leave empty = all contact sensors in this zone. Also includes subzones when that option is enabled.": "Laisser vide = tous les capteurs de contact dans cette zone. Inclut aussi les sous-zones si cette option est activée.",
    "Leeg laten = alle contact-sensoren in deze zone. Werkt ook met subzones als die optie aan staat.": "Laisser vide = tous les capteurs de contact dans cette zone. Inclut aussi les sous-zones si cette option est activée.",
    "Choose a device with measure_temperature, for example your weather app.": "Choisis un appareil avec measure_temperature, par exemple ton application météo.",
    "Kies een device met measure_temperature, bijvoorbeeld je weerapp.": "Choisis un appareil avec measure_temperature, par exemple ton application météo.",
    "Temperature rule added. Do not forget to click Save all.": "Règle de température ajoutée. N’oublie pas de cliquer sur Tout enregistrer.",
    "Temperatuurregel toegevoegd. Vergeet niet op Alles opslaan te klikken.": "Règle de température ajoutée. N’oublie pas de cliquer sur Tout enregistrer.",
    "no device selected": "aucun appareil sélectionné",
    "geen apparaat gekozen": "aucun appareil sélectionné",
    "No appliance notifications yet.": "Aucune notification d’appareil pour le moment.",
    "Nog geen apparaatmeldingen.": "Aucune notification d’appareil pour le moment.",
    "Reset only after the appliance is ready.": "Réinitialiser uniquement lorsque l’appareil est prêt.",
    "Reset pas nadat het apparaat klaar is.": "Réinitialiser uniquement lorsque l’appareil est prêt.",
    "Reset after sec.": "Réinitialiser après sec.",
    "Reset na sec.": "Réinitialiser après sec.",
    "Only used for fixed time. 0 = no automatic reset.": "Utilisé uniquement pour une durée fixe. 0 = pas de réinitialisation automatique.",
    "Alleen gebruikt bij vaste tijd. 0 = niet automatisch.": "Utilisé uniquement pour une durée fixe. 0 = pas de réinitialisation automatique.",
    "Reset on motion": "Réinitialiser sur mouvement",
    "Reset bij beweging": "Réinitialiser sur mouvement",
    "Only sensors in the same zone as the selected appliance and child zones.": "Uniquement les capteurs dans la même zone que l’appareil sélectionné et ses sous-zones.",
    "Alleen sensoren in dezelfde zone als het gekozen apparaat en onderliggende zones.": "Uniquement les capteurs dans la même zone que l’appareil sélectionné et ses sous-zones.",
    "Reset on door opened": "Réinitialiser à l’ouverture de porte",
    "Reset bij deur open": "Réinitialiser à l’ouverture de porte",
    "Reset on light on": "Réinitialiser si lampe allumée",
    "Reset bij lamp aan": "Réinitialiser si lampe allumée",
    "Choose specific lights in the same zone as the selected appliance and child zones.": "Choisis des lampes spécifiques dans la même zone que l’appareil sélectionné et ses sous-zones.",
    "Kies specifieke lampen in dezelfde zone als het gekozen apparaat en onderliggende zones.": "Choisis des lampes spécifiques dans la même zone que l’appareil sélectionné et ses sous-zones.",
    "Repeat ready trigger until reset": "Répéter le déclencheur prêt jusqu’à réinitialisation",
    "Herhaal klaar-trigger tot reset": "Répéter le déclencheur prêt jusqu’à réinitialisation",
    "Repeat every sec.": "Répéter toutes les sec.",
    "Herhaal elke sec.": "Répéter toutes les sec.",
    "Also add to Activity timeline": "Ajouter aussi à la chronologie d’activité",
    "Ook op Activiteiten-tijdlijn zetten": "Ajouter aussi à la chronologie d’activité",
    "Appliance notification added. Do not forget to click Save all.": "Notification d’appareil ajoutée. N’oublie pas de cliquer sur Tout enregistrer.",
    "Apparaatmelding toegevoegd. Vergeet niet op Alles opslaan te klikken.": "Notification d’appareil ajoutée. N’oublie pas de cliquer sur Tout enregistrer.",
    "No schedules yet.": "Aucun planning pour le moment.",
    "Nog geen planningen.": "Aucun planning pour le moment.",
    "After X hours": "Après X heures",
    "Na X uur": "Après X heures",
    "At fixed time": "À heure fixe",
    "Op vaste tijd": "À heure fixe",
    "Random after X-Y hours": "Aléatoire après X-Y heures",
    "Random na X-Y uur": "Aléatoire après X-Y heures",
    "Only in modes": "Uniquement dans les modes",
    "Alleen in modussen": "Uniquement dans les modes",
    "Minutes before/after sunrise or sunset. For example -30 or 15.": "Minutes avant/après le lever ou le coucher du soleil. Par exemple -30 ou 15.",
    "Minuten voor/na zonsopkomst of zonsondergang. Bijvoorbeeld -30 of 15.": "Minutes avant/après le lever ou le coucher du soleil. Par exemple -30 ou 15.",
    "Empty means: every day.": "Vide signifie : tous les jours.",
    "Leeg betekent: alle dagen.": "Vide signifie : tous les jours.",
    "Follow-up action after running": "Action de suivi après exécution",
    "Vervolgactie na uitvoeren": "Action de suivi après exécution",
    "Random after from hours": "Aléatoire après depuis heures",
    "Random na vanaf uur": "Aléatoire après depuis heures",
    "Random after until hours": "Aléatoire après jusqu’à heures",
    "Random na tot uur": "Aléatoire après jusqu’à heures",
    "Random off from": "Extinction aléatoire à partir de",
    "Random uit vanaf": "Extinction aléatoire à partir de",
    "Random off until": "Extinction aléatoire jusqu’à",
    "Random uit tot": "Extinction aléatoire jusqu’à",
    "Random on after from hours": "Allumage aléatoire après depuis heures",
    "Random aan na vanaf uur": "Allumage aléatoire après depuis heures",
    "Random on after until hours": "Allumage aléatoire après jusqu’à heures",
    "Random aan na tot uur": "Allumage aléatoire après jusqu’à heures",
    "Random on from": "Allumage aléatoire à partir de",
    "Random aan vanaf": "Allumage aléatoire à partir de",
    "Random on until": "Allumage aléatoire jusqu’à",
    "Random aan tot": "Allumage aléatoire jusqu’à",
    "Automatic switch-off is only shown for action On. Automatic switch-on is only shown for action Off.": "L’extinction automatique s’affiche uniquement pour l’action Allumé. L’allumage automatique s’affiche uniquement pour l’action Éteint.",
    "Automatisch uitzetten verschijnt alleen bij actie Aan. Automatisch aanzetten verschijnt alleen bij actie Uit.": "L’extinction automatique s’affiche uniquement pour l’action Allumé. L’allumage automatique s’affiche uniquement pour l’action Éteint.",
    "Only run when lux condition matches": "Exécuter uniquement si la condition lux correspond",
    "Alleen uitvoeren bij luxvoorwaarde": "Exécuter uniquement si la condition lux correspond",
    "Zone/room for lux": "Zone/pièce pour lux",
    "Zone/kamer voor lux": "Zone/pièce pour lux",
    "Leave empty = all lux sensors in this zone.": "Laisser vide = tous les capteurs lux dans cette zone.",
    "Leeg laten = alle luxsensoren in deze zone.": "Laisser vide = tous les capteurs lux dans cette zone.",
    "Select at least 1 section to export.": "Sélectionne au moins 1 section à exporter.",
    "Kies minimaal 1 onderdeel om te exporteren.": "Sélectionne au moins 1 section à exporter.",
    "JSON is ready. Copy it with the button or manually from the text field below.": "Le JSON est prêt. Copie-le avec le bouton ou manuellement depuis le champ ci-dessous.",
    "JSON staat klaar. Kopieer via de knop of handmatig vanuit het tekstveld hieronder.": "Le JSON est prêt. Copie-le avec le bouton ou manuellement depuis le champ ci-dessous.",
    "Select and copy the JSON manually.": "Sélectionne et copie le JSON manuellement.",
    "Selecteer en kopieer de JSON handmatig.": "Sélectionne et copie le JSON manuellement.",
    "Found sections: ": "Sections trouvées : ",
    "Gevonden onderdelen: ": "Sections trouvées : ",
    "No valid sections found.": "Aucune section valide trouvée.",
    "Geen geldige onderdelen gevonden.": "Aucune section valide trouvée.",
    "Not a valid Mode Switch export file.": "Ce n’est pas un fichier d’export Mode Switch valide.",
    "Geen geldig Mode Switch exportbestand.": "Ce n’est pas un fichier d’export Mode Switch valide.",
    "Import file loaded. Select sections and apply import.": "Fichier d’import chargé. Sélectionne les sections et applique l’import.",
    "Importbestand geladen. Kies onderdelen en klik op import toepassen.": "Fichier d’import chargé. Sélectionne les sections et applique l’import.",
    "Choose an import file first or paste JSON.": "Choisis d’abord un fichier d’import ou colle du JSON.",
    "Kies eerst een importbestand of plak JSON.": "Choisis d’abord un fichier d’import ou colle du JSON.",
    "Select at least 1 section to import.": "Sélectionne au moins 1 section à importer.",
    "Kies minimaal 1 onderdeel om te importeren.": "Sélectionne au moins 1 section à importer.",
    "Applying import...": "Application de l’import...",
    "Import wordt toegepast...": "Application de l’import...",
    "Import applied: ": "Import appliqué : ",
    "Import toegepast: ": "Import appliqué : ",
    "Import failed: ": "Échec de l’import : ",
    "Import mislukt: ": "Échec de l’import : ",
    "No socket rules yet. Add below/above + wattage per socket.": "Aucune règle de prise pour le moment. Ajoute inférieur/supérieur + puissance par prise.",
    "Nog geen stopcontactregels. Voeg per stopcontact onder/boven + wattage toe.": "Aucune règle de prise pour le moment. Ajoute inférieur/supérieur + puissance par prise.",
    "Verwijder": "Supprimer",
    "Stopcontact": "Prise",
    "Stopcontactregel toevoegen": "Ajouter une règle de prise",
    "Presence apparaten": "Appareils de présence",
    "Homey gebruikers": "Utilisateurs Homey",
    "Beide bronnen": "Les deux sources",
    "Automatische modus actief": "Mode automatique actif",
    "Aanwezigheidsbron": "Source de présence",
    "Presence apparaten/personen": "Appareils/personnes de présence",
    "Minimum number at home for Home mode": "Nombre minimum à la maison pour le mode Maison",
    "Minimaal aantal thuis voor modus Thuis": "Nombre minimum à la maison pour le mode Maison",
    "After how many hours away switch to Vacation": "Après combien d’heures d’absence passer en Vacances",
    "Na hoeveel uur afwezig naar Vakantie": "Après combien d’heures d’absence passer en Vacances",
    "Automatically return to Home when someone is awake and at home": "Revenir automatiquement à Maison lorsqu’une personne est réveillée et à la maison",
    "Automatisch terug naar Thuis als iemand wakker én thuis is": "Revenir automatiquement à Maison lorsqu’une personne est réveillée et à la maison",
    "All selected sleep indicators must be true": "Tous les indicateurs de sommeil sélectionnés doivent être vrais",
    "Alle gekozen slaapindicaties moeten waar zijn": "Tous les indicateurs de sommeil sélectionnés doivent être vrais",
    "Motion sensors without motion": "Capteurs de mouvement sans mouvement",
    "Bewegingssensoren zonder beweging": "Capteurs de mouvement sans mouvement",
    "Door/window contacts closed": "Contacts porte/fenêtre fermés",
    "Deur-/raamcontacten gesloten": "Contacts porte/fenêtre fermés",
    "Stopcontactregels": "Règles de prise",
    "Duration": "Durée",
    "Type": "Type",
    "at ": "à ",
    "off:": "éteint :",
    "on:": "allumé :",
    "JSON copied to clipboard.": "JSON copié dans le presse-papiers.",
    "Import applied.": "Import appliqué.",
    "Invert door/window contact: closed = on, open = off": "Inverser le contact porte/fenêtre : fermé = allumé, ouvert = éteint",
    "Window/door sensors": "Capteurs fenêtre/porte",
    "window open '+(r.windowTemperature||15)+'°C": "fenêtre ouverte '+(r.windowTemperature||15)+'°C",
    " - home": " - maison",
    " - away": " - absent",
    " - asleep": " - endormi",
    " - awake": " - réveillé",
    "Leave empty = include all Homey users. If your Homey does not return presence data, use Presence devices or Both.": "Laisser vide = inclure tous les utilisateurs Homey. Si Homey ne renvoie pas de données de présence, utilise Appareils de présence ou Les deux.",
    "No Homey users/presence found. Use Presence devices or try Both.": "Aucun utilisateur/présence Homey trouvé. Utilise Appareils de présence ou essaie Les deux.",
    "Use Homey users, presence devices or both. Sleep mode can use combined indicators.": "Utilise les utilisateurs Homey, les appareils de présence ou les deux. Le mode Sommeil peut utiliser des indicateurs combinés.",
    "Choose Homey users for native Homey Presence, or Both as a safe fallback.": "Choisis Utilisateurs Homey pour la présence native Homey, ou Les deux comme solution de secours.",
    "Only needed when using Presence devices or Both.": "Nécessaire uniquement avec Appareils de présence ou Les deux.",
    "Switch to Vacation after this many hours away. 0 = disabled.": "Passer en Vacances après ce nombre d’heures d’absence. 0 = désactivé.",
    "Use one or more indicators.": "Utilise un ou plusieurs indicateurs.",
    "Automatically return to Home": "Revenir automatiquement à Maison",
    "Use sleep indicators": "Utiliser les indicateurs de sommeil",
    "Only when everyone is away": "Seulement lorsque tout le monde est absent",
    "Deur-/raamcontact omkeren: dicht = aan, open = uit": "Inverser le contact porte/fenêtre : fermé = allumé, ouvert = éteint",
    "raam open '+(r.windowTemperature||15)+'°C": "fenêtre ouverte '+(r.windowTemperature||15)+'°C",
    "Raam/deur sensoren": "Capteurs fenêtre/porte",
    "Duur": "Durée",
    "om ": "à ",
    "uit:": "éteint :",
    "aan:": "allumé :",
    "JSON gekopieerd naar klembord.": "JSON copié dans le presse-papiers.",
    "Import toegepast.": "Import appliqué.",
    " - thuis": " - maison",
    " - afwezig": " - absent",
    " - slaapt": " - endormi",
    " - wakker": " - réveillé",
    "Leeg laten = alle Homey gebruikers meenemen. Als jouw Homey geen presence-data teruggeeft, gebruik dan Presence apparaten of Beide.": "Laisser vide = inclure tous les utilisateurs Homey. Si Homey ne renvoie pas de données de présence, utilise Appareils de présence ou Les deux.",
    "Geen Homey gebruikers/presence gevonden. Gebruik Presence apparaten of probeer Beide.": "Aucun utilisateur/présence Homey trouvé. Utilise Appareils de présence ou essaie Les deux.",
    "Gebruik Homey gebruikers, presence-apparaten of beide. Slaap kan met samengestelde indicaties.": "Utilise les utilisateurs Homey, les appareils de présence ou les deux. Le mode Sommeil peut utiliser des indicateurs combinés.",
    "Kies Homey gebruikers voor native Homey Presence, of Beide als veilige fallback.": "Choisis Utilisateurs Homey pour la présence native Homey, ou Les deux comme solution de secours.",
    "Alleen nodig bij bron Presence apparaten of Beide.": "Nécessaire uniquement avec Appareils de présence ou Les deux.",
    "Automatisch naar Slapen inschakelen": "Activer automatiquement le mode Sommeil",
    "mode": "mode",
    "all": "tous",
    "random": "aléatoire",
    "True when all selected motion sensors report no motion.": "Vrai lorsque tous les capteurs de mouvement sélectionnés ne détectent aucun mouvement.",
    "True when all selected contacts are closed/inactive.": "Vrai lorsque tous les contacts sélectionnés sont fermés/inactifs.",
    "For each socket, choose below/above and the wattage value.": "Pour chaque prise, choisis inférieur/supérieur et la puissance.",
    "The Homey settings API is not ready yet. Reopen the settings page.": "L’API des paramètres Homey n’est pas encore prête. Rouvre la page des paramètres.",
    "JSON loaded. Select sections and apply import.": "JSON chargé. Sélectionne les sections et applique l’import.",
    "modus": "mode",
    "alle": "tous",
    "Waar als alle gekozen bewegingssensoren geen beweging melden.": "Vrai lorsque tous les capteurs de mouvement sélectionnés ne détectent aucun mouvement.",
    "Waar als alle gekozen contacten dicht/inactief zijn.": "Vrai lorsque tous les contacts sélectionnés sont fermés/inactifs.",
    "Per stopcontact kies je onder/boven en de wattagewaarde.": "Pour chaque prise, choisis inférieur/supérieur et la puissance.",
    "Homey settings API is nog niet klaar. Heropen de instellingenpagina.": "L’API des paramètres Homey n’est pas encore prête. Rouvre la page des paramètres.",
    "JSON geladen. Kies onderdelen en klik op import toepassen.": "JSON chargé. Sélectionne les sections et applique l’import."},
  "es": {
    "React immediately to window/door changes": "Reaccionar inmediatamente a cambios de ventana/puerta",
    "Optional. When enabled, this temperature rule is reapplied immediately when a selected window or door opens or closes.": "Opcional. Si se activa, esta regla de temperatura se vuelve a aplicar inmediatamente cuando una ventana o puerta seleccionada se abre o se cierra.",
    "live window/door": "ventana/puerta en vivo",
    "delayed": "retrasada",
    "Delayed actions": "Acciones retrasadas",
    "Light settings": "Ajustes de iluminación",
    "Add light setting": "Añadir ajuste de iluminación",
    "Set on/off, dim level, color temperature, color and an optional delay per light. Only supported options are applied.": "Configura encendido/apagado, nivel de atenuación, temperatura de color, color y un retraso opcional por lámpara. Solo se aplican las opciones compatibles.",
    "For this schedule, set on/off, dim level, color temperature, color and an optional delay per light.": "Para esta programación, configura por lámpara encendido/apagado, atenuación, temperatura de color, color y un retraso opcional.",
    "Light": "Lámpara",
    "State": "Estado",
    "Dim level %": "Nivel de atenuación %",
    "Color temperature %": "Temperatura de color %",
    "Color": "Color",
    "Set color": "Configurar color",
    "Set color when switching on": "Configurar color al encender",
    "0 = warm, 100 = cool": "0 = cálido, 100 = frío",
    "0 warm - 100 cool": "0 cálido - 100 frío",
    "Supports: ": "Compatible con: ",
    "dimming": "atenuación",
    "color temperature": "temperatura de color",
    "color": "color",
    "Only on/off is available.": "Solo está disponible encendido/apagado.",
    "Add delayed action": "Añadir acción retrasada",
    "Device / plug": "Dispositivo / enchufe",
    "Action": "Acción",
    "On": "Encender",
    "Off": "Apagar",
    "Delay": "Retraso",
    "Seconds": "Segundos",
    "Minutes": "Minutos",
    "Hours": "Horas",
    "No delayed actions.": "No hay acciones retrasadas.",
    "These actions run only if this mode is still active when the delay expires.": "Estas acciones solo se ejecutan si este modo sigue activo cuando termina el retraso.",
    'Choose the main mode and enter a clear name for the sub mode.': 'Elige el modo principal e introduce un nombre claro para el submodo.',
    'For example Watch TV': 'Por ejemplo Ver TV',
    'After adding, you can adjust all remaining settings in the opened item.': 'Después de añadirlo, puedes ajustar el resto de opciones en el elemento abierto.',
    'Add': 'Añadir',
    "Active under": "Activo bajo",
    "Automatic": "Automático",
    "Manual": "Manual",
    "Choose...": "Elegir...",
    "Home": "Casa",
    "Current mode": "Modo actual",
    "Mode": "Modo",
    "Modes": "Modos",
    "Sub mode": "Submodo",
    "Sub modes": "Submodos",
    "Main mode": "Modo principal",
    "New sub mode": "Nuevo submodo",
    "Delete": "Eliminar",
    "Name": "Nombre",
    "Icon / emoji": "Icono / emoji",
    "Accent color": "Color de acento",
    "Background image URL": "URL de imagen de fondo",
    "Widget styling": "Estilo del widget",
    "Automatic sub mode": "Submodo automático",
    "Automatically activate by power measurement": "Activar automáticamente por medición de potencia",
    "Smart plug / device": "Enchufe inteligente / dispositivo",
    "Condition": "Condición",
    "Watt value": "Valor en vatios",
    "Delay sec.": "Retraso seg.",
    "Automatic return": "Retorno automático",
    "Automatically return to main mode": "Volver automáticamente al modo principal",
    "Return when value": "Volver cuando el valor",
    "Return watt value": "Valor de retorno en vatios",
    "Return delay sec.": "Retraso de retorno seg.",
    "Devices on": "Dispositivos encendidos",
    "Devices off": "Dispositivos apagados",
    "These devices turn on in this mode.": "Estos dispositivos se encienden en este modo.",
    "These devices turn off in this mode.": "Estos dispositivos se apagan en este modo.",
    "Activate": "Activar",
    "Zone rules": "Reglas de zona",
    "New zone rule": "Nueva regla de zona",
    "Zone/room": "Zona/habitación",
    "Include subzones/rooms": "Incluir subzonas/habitaciones",
    "Motion sensors": "Sensores de movimiento",
    "Door/window sensors": "Sensores puerta/ventana",
    "Lights": "Luces",
    "Rule active": "Regla activa",
    "Turn lights on when motion is detected": "Encender luces al detectar movimiento",
    "Turn lights off after no motion": "Apagar luces tras no detectar movimiento",
    "Turn lights on when contact is active": "Encender luces cuando el contacto esté activo",
    "Turn lights off when contact is inactive": "Apagar luces cuando el contacto esté inactivo",
    "No motion after seconds": "Sin movimiento después de segundos",
    "Dim value": "Valor de regulación",
    "Only switch on if selected lights are off": "Encender solo si las luces seleccionadas están apagadas",
    "Conditions": "Condiciones",
    "Only within time window": "Solo dentro de la ventana horaria",
    "From": "Desde",
    "Until": "Hasta",
    "Only when dark enough": "Solo cuando esté suficientemente oscuro",
    "Lux sensors": "Sensores lux",
    "Dark below lux value": "Oscuro por debajo del valor lux",
    "Test zone": "Probar zona",
    "Temperature": "Temperatura",
    "Temperature rule": "Regla de temperatura",
    "New temperature rule": "Nueva regla de temperatura",
    "Thermostats": "Termostatos",
    "Window/door open": "Ventana/puerta abierta",
    "Ignore window/door": "Ignorar ventana/puerta",
    "Do not heat when open": "No calentar si está abierto",
    "Different temperature when open": "Temperatura diferente si está abierto",
    "Temperature when window/door is open": "Temperatura con ventana/puerta abierta",
    "Smart heating": "Calefacción inteligente",
    "Smart heating using weather device": "Calefacción inteligente con dispositivo meteorológico",
    "Weather device / outdoor temperature": "Dispositivo meteorológico / temperatura exterior",
    "Cold below °C": "Frío por debajo de °C",
    "Increase setpoint by °C": "Aumentar consigna en °C",
    "Warm above °C": "Calor por encima de °C",
    "Decrease setpoint by °C": "Reducir consigna en °C",
    "Minimum setpoint": "Consigna mínima",
    "Maximum setpoint": "Consigna máxima",
    "Appliance notifications": "Notificaciones de aparatos",
    "New appliance": "Nuevo aparato",
    "Appliance": "Aparato",
    "Washing machine": "Lavadora",
    "Dryer": "Secadora",
    "Dishwasher": "Lavavajillas",
    "Other": "Otro",
    "Status": "Estado",
    "Running": "Activo",
    "Ready / waiting for reset": "Listo / esperando reinicio",
    "Off / idle": "Apagado / inactivo",
    "Start above watts": "Iniciar por encima de vatios",
    "Start delay sec.": "Retraso de inicio seg.",
    "Ready below watts": "Listo por debajo de vatios",
    "Ready delay sec.": "Retraso listo seg.",
    "Reset after ready": "Reiniciar después de listo",
    "Manual / on new run": "Manual / en nuevo ciclo",
    "After activity": "Después de actividad",
    "After fixed time": "Después de tiempo fijo",
    "Monitoring active": "Monitorización activa",
    "Flow trigger when started": "Activador Flow al iniciar",
    "Flow trigger when ready": "Activador Flow al estar listo",
    "Schedule": "Programación",
    "New schedule": "Nueva programación",
    "Action": "Acción",
    "On": "Encendido",
    "Off": "Apagado",
    "Devices/lights": "Dispositivos/luces",
    "Time type": "Tipo de hora",
    "Fixed time": "Hora fija",
    "Random between times": "Aleatorio entre horas",
    "Sunrise": "Amanecer",
    "Sunset": "Atardecer",
    "Sun offset": "Desplazamiento solar",
    "Random from": "Aleatorio desde",
    "Random until": "Aleatorio hasta",
    "Days": "Días",
    "When this schedule turns on: automatically switch off": "Cuando esta programación enciende: apagar automáticamente",
    "Switch off by": "Apagar mediante",
    "Switch off after hours": "Apagar después de horas",
    "Switch off at time": "Apagar a la hora",
    "When this schedule turns off: automatically switch on": "Cuando esta programación apaga: encender automáticamente",
    "Switch on by": "Encender mediante",
    "Switch on after hours": "Encender después de horas",
    "Switch on at time": "Encender a la hora",
    "Lux condition": "Condición lux",
    "Lux value": "Valor lux",
    "Schedule active": "Programación activa",
    "Automatic mode": "Modo automático",
    "Automatic mode active": "Modo automático activo",
    "Presence source": "Fuente de presencia",
    "Presence devices": "Dispositivos de presencia",
    "Homey users": "Usuarios Homey",
    "Both sources": "Ambas fuentes",
    "Presence devices/people": "Dispositivos/personas de presencia",
    "Automatically enable Sleep mode": "Activar automáticamente modo Sueño",
    "Sleep indicators": "Indicadores de sueño",
    "Socket rules": "Reglas de enchufe",
    "Socket": "Enchufe",
    "Wattage": "Potencia",
    "Add socket rule": "Añadir regla de enchufe",
    "Settings saved": "Ajustes guardados",
    "Mode applied": "Modo aplicado",
    "Reloaded": "Recargado",
    "Unknown error": "Error desconocido",
    "on": "encendido",
    "off": "apagado",
    "above": "por encima",
    "below": "por debajo",
    "no zone": "sin zona",
    "no mode": "sin modo",
    "all modes": "todos los modos",
    "devices": "dispositivos",
    "lights": "luces",
    "motion": "movimiento",
    "door/window": "puerta/ventana",
    "incl. subzones": "incl. subzonas",
    "above or equal to": "mayor o igual que",
    "below or equal to": "menor o igual que",
    "sunrise": "amanecer",
    "sunset": "atardecer",
    "weather compensation on": "compensación meteorológica activada",
    "weather compensation off": "compensación meteorológica desactivada",
    "ignore window": "ignorar ventana",
    "skip when window open": "omitir con ventana abierta"
  ,
    "No sub modes configured yet.": "Aún no hay submodos configurados.",
    "Nog geen submodussen ingesteld.": "Aún no hay submodos configurados.",
    "Sub mode name": "Nombre del submodo",
    "Naam submodus": "Nombre del submodo",
    "Verwijderen": "Eliminar",
    "For example 🎬, 🎮 or ♥.": "Por ejemplo 🎬, 🎮 o ♥.",
    "Bijvoorbeeld 🎬, 🎮 of ♥.": "Por ejemplo 🎬, 🎮 o ♥.",
    "Color for glow and active buttons.": "Color para brillo y botones activos.",
    "Kleur voor glow en actieve knoppen.": "Color para brillo y botones activos.",
    "Paste a direct image link. Empty = gradient based on accent color.": "Pega un enlace directo a una imagen. Vacío = degradado basado en el color de acento.",
    "Plak een directe afbeeldingslink. Leeg = gradient op basis van accentkleur.": "Pega un enlace directo a una imagen. Vacío = degradado basado en el color de acento.",
    "The ID stays the same so existing rules keep working.": "El ID permanece igual para que las reglas existentes sigan funcionando.",
    "De ID blijft gelijk zodat bestaande regels blijven werken.": "El ID permanece igual para que las reglas existentes sigan funcionando.",
    "Choose a device with power measurement (measure_power).": "Elige un dispositivo con medición de potencia (measure_power).",
    "Kies een apparaat met stroommeting (measure_power).": "Elige un dispositivo con medición de potencia (measure_power).",
    "Example: Watching TV activates above 40W and returns to Home when the smart plug stays below 15W for 5 minutes.": "Ejemplo: Ver TV se activa por encima de 40 W y vuelve a Casa cuando el enchufe inteligente permanece por debajo de 15 W durante 5 minutos.",
    "Voorbeeld: TV kijken activeert boven 40W en keert terug naar Thuis als het stopcontact 5 minuten onder 15W blijft.": "Ejemplo: Ver TV se activa por encima de 40 W y vuelve a Casa cuando el enchufe inteligente permanece por debajo de 15 W durante 5 minutos.",
    "No zone rules yet.": "Aún no hay reglas de zona.",
    "Nog geen zoneregels.": "Aún no hay reglas de zona.",
    "Optional 0-1": "Opcional 0-1",
    "Optioneel 0-1": "Opcional 0-1",
    "Zone rule tested": "Regla de zona probada",
    "Zoneregel getest": "Regla de zona probada",
    "No temperature rules yet.": "Aún no hay reglas de temperatura.",
    "Nog geen temperatuurregels.": "Aún no hay reglas de temperatura.",
    "Leave empty = all thermostats in this zone.": "Dejar vacío = todos los termostatos de esta zona.",
    "Leeg laten = alle thermostaten in deze zone.": "Dejar vacío = todos los termostatos de esta zona.",
    "Uses contact sensors in the same zone.": "Usa sensores de contacto en la misma zona.",
    "Kijkt naar contact-sensoren in dezelfde zone.": "Usa sensores de contacto en la misma zona.",
    "Only used for: Different temperature when open.": "Solo se usa para: Temperatura diferente si está abierto.",
    "Alleen gebruikt bij: Andere temperatuur als open.": "Solo se usa para: Temperatura diferente si está abierto.",
    "Leave empty = all contact sensors in this zone. Also includes subzones when that option is enabled.": "Dejar vacío = todos los sensores de contacto de esta zona. También incluye subzonas si esa opción está activada.",
    "Leeg laten = alle contact-sensoren in deze zone. Werkt ook met subzones als die optie aan staat.": "Dejar vacío = todos los sensores de contacto de esta zona. También incluye subzonas si esa opción está activada.",
    "Choose a device with measure_temperature, for example your weather app.": "Elige un dispositivo con measure_temperature, por ejemplo tu app del tiempo.",
    "Kies een device met measure_temperature, bijvoorbeeld je weerapp.": "Elige un dispositivo con measure_temperature, por ejemplo tu app del tiempo.",
    "Temperature rule added. Do not forget to click Save all.": "Regla de temperatura añadida. No olvides hacer clic en Guardar todo.",
    "Temperatuurregel toegevoegd. Vergeet niet op Alles opslaan te klikken.": "Regla de temperatura añadida. No olvides hacer clic en Guardar todo.",
    "no device selected": "ningún dispositivo seleccionado",
    "geen apparaat gekozen": "ningún dispositivo seleccionado",
    "No appliance notifications yet.": "Aún no hay notificaciones de dispositivos.",
    "Nog geen apparaatmeldingen.": "Aún no hay notificaciones de dispositivos.",
    "Reset only after the appliance is ready.": "Reiniciar solo después de que el dispositivo esté listo.",
    "Reset pas nadat het apparaat klaar is.": "Reiniciar solo después de que el dispositivo esté listo.",
    "Reset after sec.": "Reiniciar después de seg.",
    "Reset na sec.": "Reiniciar después de seg.",
    "Only used for fixed time. 0 = no automatic reset.": "Solo se usa para tiempo fijo. 0 = sin reinicio automático.",
    "Alleen gebruikt bij vaste tijd. 0 = niet automatisch.": "Solo se usa para tiempo fijo. 0 = sin reinicio automático.",
    "Reset on motion": "Reiniciar con movimiento",
    "Reset bij beweging": "Reiniciar con movimiento",
    "Only sensors in the same zone as the selected appliance and child zones.": "Solo sensores en la misma zona que el dispositivo seleccionado y subzonas.",
    "Alleen sensoren in dezelfde zone als het gekozen apparaat en onderliggende zones.": "Solo sensores en la misma zona que el dispositivo seleccionado y subzonas.",
    "Reset on door opened": "Reiniciar al abrir puerta",
    "Reset bij deur open": "Reiniciar al abrir puerta",
    "Reset on light on": "Reiniciar con luz encendida",
    "Reset bij lamp aan": "Reiniciar con luz encendida",
    "Choose specific lights in the same zone as the selected appliance and child zones.": "Elige luces específicas en la misma zona que el dispositivo seleccionado y subzonas.",
    "Kies specifieke lampen in dezelfde zone als het gekozen apparaat en onderliggende zones.": "Elige luces específicas en la misma zona que el dispositivo seleccionado y subzonas.",
    "Repeat ready trigger until reset": "Repetir activador listo hasta reinicio",
    "Herhaal klaar-trigger tot reset": "Repetir activador listo hasta reinicio",
    "Repeat every sec.": "Repetir cada seg.",
    "Herhaal elke sec.": "Repetir cada seg.",
    "Also add to Activity timeline": "Añadir también a la línea de actividad",
    "Ook op Activiteiten-tijdlijn zetten": "Añadir también a la línea de actividad",
    "Appliance notification added. Do not forget to click Save all.": "Notificación de dispositivo añadida. No olvides hacer clic en Guardar todo.",
    "Apparaatmelding toegevoegd. Vergeet niet op Alles opslaan te klikken.": "Notificación de dispositivo añadida. No olvides hacer clic en Guardar todo.",
    "No schedules yet.": "Aún no hay programaciones.",
    "Nog geen planningen.": "Aún no hay programaciones.",
    "After X hours": "Después de X horas",
    "Na X uur": "Después de X horas",
    "At fixed time": "A una hora fija",
    "Op vaste tijd": "A una hora fija",
    "Random after X-Y hours": "Aleatorio después de X-Y horas",
    "Random na X-Y uur": "Aleatorio después de X-Y horas",
    "Only in modes": "Solo en modos",
    "Alleen in modussen": "Solo en modos",
    "Minutes before/after sunrise or sunset. For example -30 or 15.": "Minutos antes/después del amanecer o atardecer. Por ejemplo -30 o 15.",
    "Minuten voor/na zonsopkomst of zonsondergang. Bijvoorbeeld -30 of 15.": "Minutos antes/después del amanecer o atardecer. Por ejemplo -30 o 15.",
    "Empty means: every day.": "Vacío significa: todos los días.",
    "Leeg betekent: alle dagen.": "Vacío significa: todos los días.",
    "Follow-up action after running": "Acción posterior tras ejecutar",
    "Vervolgactie na uitvoeren": "Acción posterior tras ejecutar",
    "Random after from hours": "Aleatorio después desde horas",
    "Random na vanaf uur": "Aleatorio después desde horas",
    "Random after until hours": "Aleatorio después hasta horas",
    "Random na tot uur": "Aleatorio después hasta horas",
    "Random off from": "Apagado aleatorio desde",
    "Random uit vanaf": "Apagado aleatorio desde",
    "Random off until": "Apagado aleatorio hasta",
    "Random uit tot": "Apagado aleatorio hasta",
    "Random on after from hours": "Encendido aleatorio después desde horas",
    "Random aan na vanaf uur": "Encendido aleatorio después desde horas",
    "Random on after until hours": "Encendido aleatorio después hasta horas",
    "Random aan na tot uur": "Encendido aleatorio después hasta horas",
    "Random on from": "Encendido aleatorio desde",
    "Random aan vanaf": "Encendido aleatorio desde",
    "Random on until": "Encendido aleatorio hasta",
    "Random aan tot": "Encendido aleatorio hasta",
    "Automatic switch-off is only shown for action On. Automatic switch-on is only shown for action Off.": "El apagado automático solo se muestra para la acción Encendido. El encendido automático solo se muestra para la acción Apagado.",
    "Automatisch uitzetten verschijnt alleen bij actie Aan. Automatisch aanzetten verschijnt alleen bij actie Uit.": "El apagado automático solo se muestra para la acción Encendido. El encendido automático solo se muestra para la acción Apagado.",
    "Only run when lux condition matches": "Ejecutar solo si coincide la condición lux",
    "Alleen uitvoeren bij luxvoorwaarde": "Ejecutar solo si coincide la condición lux",
    "Zone/room for lux": "Zona/habitación para lux",
    "Zone/kamer voor lux": "Zona/habitación para lux",
    "Leave empty = all lux sensors in this zone.": "Dejar vacío = todos los sensores lux de esta zona.",
    "Leeg laten = alle luxsensoren in deze zone.": "Dejar vacío = todos los sensores lux de esta zona.",
    "Select at least 1 section to export.": "Selecciona al menos 1 sección para exportar.",
    "Kies minimaal 1 onderdeel om te exporteren.": "Selecciona al menos 1 sección para exportar.",
    "JSON is ready. Copy it with the button or manually from the text field below.": "El JSON está listo. Cópialo con el botón o manualmente desde el campo inferior.",
    "JSON staat klaar. Kopieer via de knop of handmatig vanuit het tekstveld hieronder.": "El JSON está listo. Cópialo con el botón o manualmente desde el campo inferior.",
    "Select and copy the JSON manually.": "Selecciona y copia el JSON manualmente.",
    "Selecteer en kopieer de JSON handmatig.": "Selecciona y copia el JSON manualmente.",
    "Found sections: ": "Secciones encontradas: ",
    "Gevonden onderdelen: ": "Secciones encontradas: ",
    "No valid sections found.": "No se encontraron secciones válidas.",
    "Geen geldige onderdelen gevonden.": "No se encontraron secciones válidas.",
    "Not a valid Mode Switch export file.": "No es un archivo de exportación válido de Mode Switch.",
    "Geen geldig Mode Switch exportbestand.": "No es un archivo de exportación válido de Mode Switch.",
    "Import file loaded. Select sections and apply import.": "Archivo de importación cargado. Selecciona secciones y aplica la importación.",
    "Importbestand geladen. Kies onderdelen en klik op import toepassen.": "Archivo de importación cargado. Selecciona secciones y aplica la importación.",
    "Choose an import file first or paste JSON.": "Elige primero un archivo de importación o pega JSON.",
    "Kies eerst een importbestand of plak JSON.": "Elige primero un archivo de importación o pega JSON.",
    "Select at least 1 section to import.": "Selecciona al menos 1 sección para importar.",
    "Kies minimaal 1 onderdeel om te importeren.": "Selecciona al menos 1 sección para importar.",
    "Applying import...": "Aplicando importación...",
    "Import wordt toegepast...": "Aplicando importación...",
    "Import applied: ": "Importación aplicada: ",
    "Import toegepast: ": "Importación aplicada: ",
    "Import failed: ": "Error de importación: ",
    "Import mislukt: ": "Error de importación: ",
    "No socket rules yet. Add below/above + wattage per socket.": "Aún no hay reglas de enchufe. Añade por enchufe por debajo/por encima + potencia.",
    "Nog geen stopcontactregels. Voeg per stopcontact onder/boven + wattage toe.": "Aún no hay reglas de enchufe. Añade por enchufe por debajo/por encima + potencia.",
    "Verwijder": "Eliminar",
    "Stopcontact": "Enchufe",
    "Stopcontactregel toevoegen": "Añadir regla de enchufe",
    "Presence apparaten": "Dispositivos de presencia",
    "Homey gebruikers": "Usuarios Homey",
    "Beide bronnen": "Ambas fuentes",
    "Automatische modus actief": "Modo automático activo",
    "Aanwezigheidsbron": "Fuente de presencia",
    "Presence apparaten/personen": "Dispositivos/personas de presencia",
    "Minimum number at home for Home mode": "Número mínimo en casa para modo Casa",
    "Minimaal aantal thuis voor modus Thuis": "Número mínimo en casa para modo Casa",
    "After how many hours away switch to Vacation": "Después de cuántas horas fuera cambiar a Vacaciones",
    "Na hoeveel uur afwezig naar Vakantie": "Después de cuántas horas fuera cambiar a Vacaciones",
    "Automatically return to Home when someone is awake and at home": "Volver automáticamente a Casa cuando alguien esté despierto y en casa",
    "Automatisch terug naar Thuis als iemand wakker én thuis is": "Volver automáticamente a Casa cuando alguien esté despierto y en casa",
    "All selected sleep indicators must be true": "Todos los indicadores de sueño seleccionados deben ser verdaderos",
    "Alle gekozen slaapindicaties moeten waar zijn": "Todos los indicadores de sueño seleccionados deben ser verdaderos",
    "Motion sensors without motion": "Sensores de movimiento sin movimiento",
    "Bewegingssensoren zonder beweging": "Sensores de movimiento sin movimiento",
    "Door/window contacts closed": "Contactos puerta/ventana cerrados",
    "Deur-/raamcontacten gesloten": "Contactos puerta/ventana cerrados",
    "Stopcontactregels": "Reglas de enchufe",
    "Duration": "Duración",
    "Type": "Tipo",
    "at ": "a las ",
    "off:": "apagado:",
    "on:": "encendido:",
    "JSON copied to clipboard.": "JSON copiado al portapapeles.",
    "Import applied.": "Importación aplicada.",
    "Invert door/window contact: closed = on, open = off": "Invertir contacto puerta/ventana: cerrado = encendido, abierto = apagado",
    "Window/door sensors": "Sensores ventana/puerta",
    "window open '+(r.windowTemperature||15)+'°C": "ventana abierta '+(r.windowTemperature||15)+'°C",
    " - home": " - casa",
    " - away": " - fuera",
    " - asleep": " - dormido",
    " - awake": " - despierto",
    "Leave empty = include all Homey users. If your Homey does not return presence data, use Presence devices or Both.": "Dejar vacío = incluir todos los usuarios Homey. Si Homey no devuelve datos de presencia, usa Dispositivos de presencia o Ambas fuentes.",
    "No Homey users/presence found. Use Presence devices or try Both.": "No se encontraron usuarios/presencia de Homey. Usa Dispositivos de presencia o prueba Ambas fuentes.",
    "Use Homey users, presence devices or both. Sleep mode can use combined indicators.": "Usa usuarios Homey, dispositivos de presencia o ambos. El modo Dormir puede usar indicadores combinados.",
    "Choose Homey users for native Homey Presence, or Both as a safe fallback.": "Elige usuarios Homey para la presencia nativa de Homey, o Ambas fuentes como respaldo seguro.",
    "Only needed when using Presence devices or Both.": "Solo necesario al usar Dispositivos de presencia o Ambas fuentes.",
    "Switch to Vacation after this many hours away. 0 = disabled.": "Cambiar a Vacaciones después de este número de horas fuera. 0 = desactivado.",
    "Use one or more indicators.": "Usa uno o más indicadores.",
    "Automatically return to Home": "Volver automáticamente a Casa",
    "Use sleep indicators": "Usar indicadores de sueño",
    "Only when everyone is away": "Solo cuando todos están fuera",
    "Deur-/raamcontact omkeren: dicht = aan, open = uit": "Invertir contacto puerta/ventana: cerrado = encendido, abierto = apagado",
    "raam open '+(r.windowTemperature||15)+'°C": "ventana abierta '+(r.windowTemperature||15)+'°C",
    "Raam/deur sensoren": "Sensores ventana/puerta",
    "Duur": "Duración",
    "om ": "a las ",
    "uit:": "apagado:",
    "aan:": "encendido:",
    "JSON gekopieerd naar klembord.": "JSON copiado al portapapeles.",
    "Import toegepast.": "Importación aplicada.",
    " - thuis": " - casa",
    " - afwezig": " - fuera",
    " - slaapt": " - dormido",
    " - wakker": " - despierto",
    "Leeg laten = alle Homey gebruikers meenemen. Als jouw Homey geen presence-data teruggeeft, gebruik dan Presence apparaten of Beide.": "Dejar vacío = incluir todos los usuarios Homey. Si Homey no devuelve datos de presencia, usa Dispositivos de presencia o Ambas fuentes.",
    "Geen Homey gebruikers/presence gevonden. Gebruik Presence apparaten of probeer Beide.": "No se encontraron usuarios/presencia de Homey. Usa Dispositivos de presencia o prueba Ambas fuentes.",
    "Gebruik Homey gebruikers, presence-apparaten of beide. Slaap kan met samengestelde indicaties.": "Usa usuarios Homey, dispositivos de presencia o ambos. El modo Dormir puede usar indicadores combinados.",
    "Kies Homey gebruikers voor native Homey Presence, of Beide als veilige fallback.": "Elige usuarios Homey para la presencia nativa de Homey, o Ambas fuentes como respaldo seguro.",
    "Alleen nodig bij bron Presence apparaten of Beide.": "Solo necesario al usar Dispositivos de presencia o Ambas fuentes.",
    "Automatisch naar Slapen inschakelen": "Activar automáticamente modo Dormir",
    "mode": "modo",
    "all": "todos",
    "random": "aleatorio",
    "True when all selected motion sensors report no motion.": "Verdadero cuando todos los sensores de movimiento seleccionados no detectan movimiento.",
    "True when all selected contacts are closed/inactive.": "Verdadero cuando todos los contactos seleccionados están cerrados/inactivos.",
    "For each socket, choose below/above and the wattage value.": "Para cada enchufe, elige por debajo/por encima y el valor de potencia.",
    "The Homey settings API is not ready yet. Reopen the settings page.": "La API de ajustes de Homey aún no está lista. Vuelve a abrir la página de ajustes.",
    "JSON loaded. Select sections and apply import.": "JSON cargado. Selecciona secciones y aplica la importación.",
    "modus": "modo",
    "alle": "todos",
    "Waar als alle gekozen bewegingssensoren geen beweging melden.": "Verdadero cuando todos los sensores de movimiento seleccionados no detectan movimiento.",
    "Waar als alle gekozen contacten dicht/inactief zijn.": "Verdadero cuando todos los contactos seleccionados están cerrados/inactivos.",
    "Per stopcontact kies je onder/boven en de wattagewaarde.": "Para cada enchufe, elige por debajo/por encima y el valor de potencia.",
    "Homey settings API is nog niet klaar. Heropen de instellingenpagina.": "La API de ajustes de Homey aún no está lista. Vuelve a abrir la página de ajustes.",
    "JSON geladen. Kies onderdelen en klik op import toepassen.": "JSON cargado. Selecciona secciones y aplica la importación."}

};

Object.assign(PHRASE_I18N.de, {
  'Contact-teller / volgorde': 'Kontaktzähler / Sequenz',
  'Gebruik een teller voor deur-/raamcontacten': 'Zähler für Tür-/Fensterkontakte verwenden',
  'Tel gebeurtenis': 'Ereignis zählen',
  'Open': 'Offen',
  'Dicht': 'Geschlossen',
  'Licht uit bij telling': 'Licht aus bei Zählwert',
  'Teller reset na seconden': 'Zähler nach Sekunden zurücksetzen',
  'Teller resetten bij moduswissel': 'Zähler bei Moduswechsel zurücksetzen',
  'Voorbeeld: licht aan bij eerste opening en uit bij de tweede opening of tweede sluiting. Daarna begint de teller opnieuw.': 'Beispiel: Licht bei der ersten Öffnung einschalten und bei der zweiten Öffnung oder zweiten Schließung ausschalten. Danach beginnt der Zähler erneut.'
});
Object.assign(PHRASE_I18N.fr, {
  'Contact-teller / volgorde': 'Compteur / séquence de contact',
  'Gebruik een teller voor deur-/raamcontacten': 'Utiliser un compteur pour les contacts porte/fenêtre',
  'Tel gebeurtenis': 'Événement à compter',
  'Open': 'Ouvert',
  'Dicht': 'Fermé',
  'Licht uit bij telling': 'Éteindre la lumière au comptage',
  'Teller reset na seconden': 'Réinitialiser le compteur après secondes',
  'Teller resetten bij moduswissel': 'Réinitialiser le compteur lors du changement de mode',
  'Voorbeeld: licht aan bij eerste opening en uit bij de tweede opening of tweede sluiting. Daarna begint de teller opnieuw.': 'Exemple : allumer la lumière à la première ouverture et l’éteindre à la deuxième ouverture ou deuxième fermeture. Le compteur recommence ensuite.'
});
Object.assign(PHRASE_I18N.es, {
  'Contact-teller / volgorde': 'Contador / secuencia de contacto',
  'Gebruik een teller voor deur-/raamcontacten': 'Usar un contador para contactos de puerta/ventana',
  'Tel gebeurtenis': 'Evento a contar',
  'Open': 'Abierto',
  'Dicht': 'Cerrado',
  'Licht uit bij telling': 'Apagar la luz en el conteo',
  'Teller reset na seconden': 'Reiniciar contador después de segundos',
  'Teller resetten bij moduswissel': 'Reiniciar contador al cambiar de modo',
  'Voorbeeld: licht aan bij eerste opening en uit bij de tweede opening of tweede sluiting. Daarna begint de teller opnieuw.': 'Ejemplo: encender la luz en la primera apertura y apagarla en la segunda apertura o segundo cierre. Después el contador vuelve a empezar.'
});



// 3.1.37: complete Norwegian dynamic settings translations
Object.assign(PHRASE_I18N["no"]||(PHRASE_I18N["no"]={}), {"Actions for this device enabled":"Handlinger for denne enheten er aktive","Choose the default list in the Mode & Switch device configuration. Here you only configure actions per list/mode and switch.":"Velg standardlisten i konfigurasjonen for Mode & Switch-enheten. Her konfigurerer du bare handlinger per liste/modus og bryter.","Lists / modes":"Lister / moduser","No Mode & Switch devices found yet. First create one in Homey, then click Refresh devices.":"Ingen Mode & Switch-enheter funnet ennå. Opprett først en i Homey, og trykk deretter Oppdater enheter.","On/off switches":"Av/på-knapper","This list has no options yet.":"Denne listen har ingen alternativer ennå.","When":"Når","When the switch turns OFF":"Når bryteren slås AV","When the switch turns ON":"Når bryteren slås PÅ","becomes active":"blir aktiv","lists":"lister","options":"alternativer","switches":"brytere","Devices on":"Enheter på","Devices off":"Enheter av","No activities configured yet.":"Ingen aktiviteter er konfigurert ennå.","Activity":"Aktivitet","Advanced":"Avansert","Capability":"Egenskap","Comparison":"Sammenligning","Device/sensor":"Enhet/sensor","End time":"Sluttid","Inactive after (sec)":"Inaktiv etter (sek.)","Is active":"Er aktiv","Is not active":"Er ikke aktiv","Minimum rise/fall":"Minimum økning/fall","Only the fields needed for this condition type are shown.":"Bare feltene som trengs for denne betingelsestypen vises.","Period in seconds":"Periode i sekunder","Required":"Påkrevd","Required condition":"Påkrevd betingelse","Required means: this condition must be true, in addition to the minimum number of conditions.":"Påkrevd betyr at denne betingelsen må være sann i tillegg til minimum antall betingelser.","Start time":"Starttid","The condition keeps counting for this many seconds after it is no longer true. 0 = stop immediately.":"Betingelsen fortsetter å telle så mange sekunder etter at den ikke lenger er sann. 0 = stopp umiddelbart.","The condition only counts after being true for this many seconds. 0 = immediately.":"Betingelsen teller først etter at den har vært sann i så mange sekunder. 0 = umiddelbart.","Threshold":"Grenseverdi","True for (sec)":"Sann i (sek.)","Use this for example to start Shower only when Irrigation is not active. The current activity cannot use itself as a condition.":"Bruk dette for eksempel for å starte Dusj bare når Vanning ikke er aktiv. Den gjeldende aktiviteten kan ikke bruke seg selv som betingelse.","Value":"Verdi","Zone is active":"Sonen er aktiv","Zone is not active":"Sonen er ikke aktiv","Add condition":"Legg til betingelse","Conditions":"Betingelser","Activity active":"Aktivitet aktiv","Name":"Navn","Delete":"Slett","Monitoring active":"Overvåking aktiv","Flow trigger when started":"Flow-trigger ved start","Flow trigger when ready":"Flow-trigger når ferdig","Repeat ready trigger until reset":"Gjenta ferdig-trigger til reset","Repeat every sec.":"Gjenta hvert sek.","Number of history entries":"Antall historikkoppføringer","Reset after ready":"Reset etter ferdig","Reset after sec.":"Reset etter sek.","Reset on motion":"Reset ved bevegelse","Reset on door opened":"Reset når dør åpnes","Reset on light on":"Reset når lys slås på","Smart plug / device":"Smartplugg / enhet","Start above watts":"Start over watt","Start delay sec.":"Startforsinkelse sek.","Ready below watts":"Ferdig under watt","Ready delay sec.":"Ferdigforsinkelse sek.","Manual / on new run":"Manuell / ved ny start","After activity":"Etter aktivitet","After fixed time":"Etter fast tid","Only used for fixed time. 0 = no automatic reset.":"Brukes bare ved fast tid. 0 = ingen automatisk reset.","Only sensors in the same zone as the selected appliance and child zones.":"Bare sensorer i samme sone som valgt apparat og underliggende soner.","Choose specific lights in the same zone as the selected appliance and child zones.":"Velg bestemte lys i samme sone som valgt apparat og underliggende soner.","Choose a device with power measurement (measure_power).":"Velg en enhet med effektmåling (measure_power).","Choose how many completed cycles are kept (1-50).":"Velg hvor mange fullførte sykluser som skal beholdes (1–50).","Also add to Activity timeline":"Legg også til på aktivitetstidslinjen","No appliance notifications yet.":"Ingen apparatvarsler ennå.","Washing machine":"Vaskemaskin","Dryer":"Tørketrommel","Dishwasher":"Oppvaskmaskin","Other":"Annet","Schedule":"Planlegging","No schedules yet.":"Ingen planlegginger ennå.","Action":"Handling","Only in modes":"Bare i moduser","Devices/lights":"Enheter/lys","Time type":"Tidstype","Fixed time":"Fast tidspunkt","Random between times":"Tilfeldig mellom tidspunkter","Sunrise":"Soloppgang","Sunset":"Solnedgang","Sun offset":"Soloffset","Random from":"Tilfeldig fra","Random until":"Tilfeldig til","Days":"Dager","Follow-up action after running":"Oppfølgingshandling etter kjøring","When this schedule turns on: automatically switch off":"Når denne planleggingen slår på: slå automatisk av igjen","When this schedule turns off: automatically switch on":"Når denne planleggingen slår av: slå automatisk på igjen","Switch off by":"Slå av via","Switch on by":"Slå på via","Switch off after hours":"Slå av etter antall timer","Switch on after hours":"Slå på etter antall timer","Switch off at time":"Slå av på tidspunkt","Switch on at time":"Slå på på tidspunkt","After X hours":"Etter X timer","At fixed time":"På fast tidspunkt","Random after X-Y hours":"Tilfeldig etter X–Y timer","Lux condition":"Lux-betingelse","Only run when lux condition matches":"Kjør bare når lux-betingelsen er oppfylt","Zone/room for lux":"Sone/rom for lux","Lux sensors":"Luxsensorer","Condition":"Betingelse","Lux value":"Luxverdi","Schedule active":"Planlegging aktiv","Light settings":"Lysinnstillinger","Add light setting":"Legg til lysinnstilling","For this schedule, set on/off, dim level, color temperature, color and an optional delay per light.":"Angi av/på, dimmenivå, fargetemperatur, farge og eventuell forsinkelse per lys for denne planleggingen.","Automatic switch-off is only shown for action On. Automatic switch-on is only shown for action Off.":"Automatisk avslåing vises bare for handling På. Automatisk påslåing vises bare for handling Av.","Include subzones/rooms":"Ta med underliggende soner/rom","Leave empty = all lux sensors in this zone.":"La stå tomt = alle luxsensorer i denne sonen.","Empty means: every day.":"Tomt betyr: hver dag.","Minutes before/after sunrise or sunset. For example -30 or 15.":"Minutter før/etter soloppgang eller solnedgang. For eksempel -30 eller 15.","On":"På","Off":"Av","Mode & Switch devices refreshed":"Mode & Switch-enheter oppdatert"});
Object.assign(PHRASE_I18N["no"]||(PHRASE_I18N["no"]={}), {"Contact counter / sequence":"Kontaktteller / sekvens","Example: switch the light on at the first opening and off at the second opening or second closing. The counter then starts again.":"Eksempel: slå på lyset ved første åpning og av ved andre åpning eller andre lukking. Deretter starter telleren på nytt.","Use a counter for door/window contacts":"Bruk en teller for dør-/vinduskontakter","Count event":"Tell hendelse","Turn light off at count":"Slå av lyset ved antall","Reset counter after seconds":"Tilbakestill teller etter sekunder","Reset counter on mode change":"Tilbakestill teller ved modusbytte","Loading counter status…":"Laster tellerstatus…","Reset counter":"Tilbakestill teller","Open":"Åpen","Closed":"Lukket","Sleep":"Sove","Away":"Borte","Vacation":"Ferie","Only the name changes; the ID stays the same.":"Bare navnet endres; ID-en forblir den samme.","Example: Watching TV activates above 40W and returns to Home when the smart plug stays below 15W for 5 minutes.":"Eksempel: Se på TV aktiveres over 40 W og går tilbake til Hjemme når smartpluggen holder seg under 15 W i 5 minutter.","Choose a device or sensor":"Velg en enhet eller sensor","Enter a name first.":"Skriv inn et navn først.","Choose a device or sensor first.":"Velg en enhet eller sensor først.","Activity added and is being saved...":"Aktiviteten er lagt til og lagres…","Activity added and saved.":"Aktiviteten er lagt til og lagret.","Saving failed.":"Lagring mislyktes.","Choose the zone and mode. You can configure the remaining sensors, lights and conditions afterwards.":"Velg sone og modus. Du kan konfigurere resten av sensorene, lysene og betingelsene etterpå.","For example Living room lights":"For eksempel Stuebelysning","Choose the mode, zone and desired temperature for this rule.":"Velg modus, sone og ønsket temperatur for denne regelen.","For example Living room daytime":"For eksempel Stue dagtid","Select one or more modes.":"Velg én eller flere moduser.","Choose the appliance you want to monitor. You can fine-tune the detection values afterwards.":"Velg apparatet du vil overvåke. Du kan finjustere registreringsverdiene etterpå.","For example Washing machine":"For eksempel Vaskemaskin","Name the schedule and choose the first action, time and devices.":"Gi planleggingen et navn og velg første handling, tidspunkt og enheter.","For example Evening lights":"For eksempel Kveldslys","Time":"Tid","You can select multiple devices.":"Du kan velge flere enheter.","Choose a zone first.":"Velg en sone først.","Choose a device first.":"Velg en enhet først.","Added and saving...":"Lagt til og lagres…","Added and saved.":"Lagt til og lagret.","New activity":"Ny aktivitet","on":"på","off":"av","light":"lys","0 = warm, 100 = cool":"0 = varm, 100 = kjølig","These actions run only if this mode is still active when the delay expires.":"Disse handlingene kjøres bare hvis modusen fortsatt er aktiv når forsinkelsen utløper.","Set on/off, dim level, color temperature, color and an optional delay per light. Only supported options are applied.":"Angi av/på, dimmenivå, fargetemperatur, farge og valgfri forsinkelse per lys. Bare støttede valg brukes.","0 warm - 100 cool":"0 varm – 100 kjølig","mode":"modus","all":"alle","Number of history entries":"Antall historikkoppføringer","Appliance notification added. Do not forget to click Save all.":"Apparatvarsel lagt til. Husk å trykke Lagre alt.","random":"tilfeldig","sunrise":"soloppgang","sunset":"solnedgang","Random after from hours":"Tilfeldig etter fra timer","Random after until hours":"Tilfeldig etter til timer","Random off from":"Tilfeldig av fra","Random off until":"Tilfeldig av til","Random on after from hours":"Tilfeldig på etter fra timer","Random on after until hours":"Tilfeldig på etter til timer","Random on from":"Tilfeldig på fra","Random on until":"Tilfeldig på til","Water above value":"Vann over verdi","Gas above value":"Gass over verdi","Power above watts":"Effekt over watt","Temperature above":"Temperatur over","Temperature below":"Temperatur under","Temperature rising":"Temperatur stiger","Temperature falling":"Temperatur synker","Humidity above":"Luftfuktighet over","Humidity below":"Luftfuktighet under","Humidity rising":"Luftfuktighet stiger","Humidity falling":"Luftfuktighet synker","Device is on":"Enheten er på","Sensor value is true":"Sensorverdien er sann","Capability above":"Egenskap over","Capability below":"Egenskap under","Capability equals":"Egenskap er lik","Custom capability":"Egendefinert egenskap","Other activity":"Annen aktivitet","Zone active":"Sone aktiv","Time between":"Tid mellom","Time after":"Tid etter","Time before":"Tid før","contains":"inneholder","is true":"er sann","is false":"er usann","Active":"Aktiv","Standby":"Ventemodus","No conditions yet. Add at least one.":"Ingen betingelser ennå. Legg til minst én.","Last session":"Siste økt","No session history yet.":"Ingen økthistorikk ennå.","conditions":"betingelser","required":"påkrevd","Basics":"Grunnleggende","Behaviour":"Oppførsel","Start at true conditions":"Start ved sanne betingelser","Required conditions must always be true. This number applies to all conditions together.":"Påkrevde betingelser må alltid være sanne. Dette antallet gjelder alle betingelsene samlet.","History sessions":"Historikkøkter","Min. duration for history (sec)":"Min. varighet for historikk (sek.)","0 = save every session. Shorter sessions are not added to history.":"0 = lagre hver økt. Kortere økter legges ikke til i historikken.","Open a condition. Only fields needed for the selected type are shown.":"Åpne en betingelse. Bare feltene som trengs for valgt type vises.","Usage meter sources":"Kilder for forbruksmålere","These meters only register usage during the activity. They are not conditions for starting or stopping the activity.":"Disse målerne registrerer bare forbruk under aktiviteten. De er ikke betingelser for å starte eller stoppe aktiviteten.","Water meter":"Vannmåler","Optional. Use your water meter for litres per session.":"Valgfritt. Bruk vannmåleren for liter per økt.","kWh meter / power source":"kWh-måler / strømkilde","Optional. Uses meter_power or integrates measure_power.":"Valgfritt. Bruker meter_power eller integrerer measure_power.","Gas meter":"Gassmåler","Optional. Use your gas meter for m³ per session without using gas as a condition.":"Valgfritt. Bruk gassmåleren for m³ per økt uten å bruke gass som betingelse.","Choose activity":"Velg aktivitet","inactive":"inaktiv","active":"aktiv","Choose zone":"Velg sone","after":"etter","before":"før","A zone is active when at least one motion sensor in the selected zone reports motion. For inactive, all motion sensors in the zone must be inactive.":"En sone er aktiv når minst én bevegelsessensor i valgt sone registrerer bevegelse. For inaktiv må alle bevegelsessensorer i sonen være inaktive.","Counter not active":"Teller ikke aktiv","Counter":"Teller"});

// Added in 3.1.31: Norwegian Bokmal, Swedish and Italian UI dictionaries.
I18N["no"] = Object.assign(I18N["no"] || {}, {"mode.home":"Hjemme","mode.away":"Borte","mode.sleep":"Sove","mode.vacation":"Ferie","mode.home_tv":"Se på TV","mode.home_romantic":"Romantisk","mode.home_game":"Spill","mode.home_movie":"Se film","driver.mode_controller.default_name":"Moduskontroller","settings.__lang":"no","settings.hero.description":"Moduser, soneregler, dør-/vinduskontakter, planlegging, soloppgang/solnedgang, lux og automatisk modus.","settings.current_mode.loading":"Gjeldende modus: laster…","settings.submodes.title":"Undermoduser","settings.submodes.description":"Lag ekstra valg under en hovedmodus, for eksempel Se på TV under Hjemme.","settings.submodes.add":"Ny undermodus","settings.zones.title":"Soneregler","settings.zones.description":"Bevegelse, dør-/vinduskontakter, undersoner, lys, dimming og betingelser.","settings.zones.add":"Ny soneregel","settings.temperature.title":"Temperatur per modus og sone","settings.temperature.description":"Angi ønsket temperatur for én eller flere moduser per sone. Enheter med target_temperature oppdateres automatisk ved modusbytte. Regler kan valgfritt reagere direkte på dør-/vinduskontakter.","settings.temperature.add":"Ny temperaturregel","settings.appliances.title":"Apparatvarsler","settings.appliances.description":"Registrer start og ferdig-status via strømforbruk fra en smartplugg eller enhet med measure_power.","settings.appliances.add":"Nytt apparat","settings.schedule.title":"Planlegging","settings.schedule.description":"Slå lys/enheter av eller på på fast tidspunkt, tilfeldig tidspunkt, ved soloppgang eller solnedgang. Lux per sone kan brukes valgfritt.","settings.schedule.add":"Ny planlegging","settings.import_export.title":"Import / eksport","settings.import_export.description":"Lag en sikkerhetskopi av alt, eller velg hvilke deler som skal tas med.","settings.export.title":"Eksporter","settings.export.description":"Velg deler og kopier en JSON-sikkerhetskopi.","settings.export.copy_json":"Kopier JSON","settings.import.title":"Importer","settings.import.description":"Velg en tidligere JSON-sikkerhetskopi. Deretter kan du velge hvilke deler som skal gjenopprettes.","settings.import.placeholder":"Lim inn JSON-eksporten her hvis filvalg ikke fungerer","settings.import.load_from_text":"Last JSON fra tekstfelt","settings.import.no_file":"Ingen fil valgt ennå.","settings.import.apply":"Bruk import","settings.activities.title":"Aktivitetsovervåking","settings.activities.add":"Ny aktivitet","settings.menu.section":"Område","common.refresh":"Oppdater","common.save_all":"Lagre alt","common.expand_all":"Åpne alle","common.collapse_all":"Lukk alle","common.select_all":"Velg alle","tabs.modes":"Moduser","tabs.zones":"Soner og sensorer","tabs.temperature":"Temperatur","tabs.monitoring":"Overvåking","tabs.schedule":"Planlegging","tabs.import_export":"Import/Eksport","tabs.automatic_mode":"Automatisk modus","tabs.activities":"Aktiviteter","tabs.keypads":"Tastaturer","tabs.debug":"Feilsøking","tabs.mode_switch_devices":"Mode & Switch-enheter","widgets.common.current_mode":"Gjeldende modus","widgets.common.refresh":"Oppdater","widgets.common.running":"Kjører","widgets.common.ready":"Ferdig","widgets.common.standby":"Ventemodus","widgets.common.duration":"Varighet","widgets.common.appliances":"Apparater","widgets.common.no_appliances":"Ingen apparater","widgets.common.no_appliances_configured":"Ingen apparater er konfigurert.","widgets.common.appliance":"Apparat","widgets.common.could_not_load_widget_data":"Kunne ikke laste widgetdata.","widgets.common.could_not_load_status":"Kunne ikke laste status.","widgets.common.could_not_change_mode":"Kunne ikke endre modus.","widgets.common.monitoring":"Overvåking","widgets.common.mode":"Modus","widgets.common.appliance_monitoring":"Apparatovervåking","widgets.common.no_sub_mode":"Ingen undermodus","widgets.common.activities":"Aktiviteter","widgets.common.activity":"Aktivitet","widgets.common.activity_monitoring":"Aktivitetsovervåking","widgets.common.active":"Aktiv","widgets.common.history":"Historikk","widgets.common.no_history":"Ingen historikk","widgets.common.start":"Start","widgets.common.end":"Slutt","widgets.modes.home":"Hjemme","widgets.modes.away":"Borte","widgets.modes.sleep":"Sove","widgets.modes.vacation":"Ferie","widgets.modes.home_tv":"Se på TV","widgets.modes.home_movie":"Se film","widgets.modes.home_game":"Spill","widgets.modes.home_romantic":"Romantisk","widgets.catalog.monitoring":"Overvåking","widgets.catalog.mode":"Modus","widgets.catalog.appliance_monitoring":"Apparatovervåking","widgets.catalog.current_mode":"Gjeldende modus","widgets.catalog.appliances":"Apparater","widgets.catalog.refresh":"Oppdater","widgets.catalog.running":"Kjører","widgets.catalog.ready":"Ferdig","widgets.catalog.standby":"Ventemodus","widgets.catalog.appliance":"Apparat","widgets.catalog.history":"Historikk","widgets.catalog.no_completed_cycles_have_been_saved_yet":"Ingen fullførte sykluser er lagret ennå.","widgets.catalog.unknown_date":"Ukjent dato","widgets.catalog.duration":"Varighet","widgets.catalog.average":"Gjennomsnitt","widgets.catalog.home":"Hjemme","widgets.catalog.sleep":"Sove","widgets.catalog.away":"Borte","widgets.catalog.vacation":"Ferie","widgets.catalog.no_sub_mode":"Ingen undermodus","widgets.catalog.watch_tv":"Se på TV","widgets.catalog.watch_movie":"Se film","widgets.catalog.game":"Spill","widgets.catalog.romantic":"Romantisk","widgets.catalog.could_not_load_widget_data":"Kunne ikke laste widgetdata.","widgets.catalog.running_2":"Kjører","widgets.catalog.ready_2":"Ferdig","widgets.catalog.no_appliances":"Ingen apparater","widgets.catalog.no_appliances_configured":"Ingen apparater er konfigurert.","widgets.catalog.history_2":"Historikk","widgets.catalog.could_not_load_status":"Kunne ikke laste status.","widgets.catalog.could_not_change_mode":"Kunne ikke endre modus.","widgets.catalog.active":"aktiv","widgets.catalog.configured":"konfigurert","widgets.catalog.no_activities_configured":"Ingen aktiviteter er konfigurert","widgets.catalog.create_activities_from_the_settings_page":"Opprett aktiviteter fra innstillingssiden.","widgets.catalog.activity":"Aktivitet","widgets.catalog.started":"Startet","widgets.catalog.last_session":"Siste økt","widgets.catalog.conditions":"Betingelser","widgets.catalog.active_2":"Aktiv","widgets.catalog.no_previous_sessions_yet":"Ingen tidligere økter ennå.","widgets.catalog.could_not_load_activities":"Kunne ikke laste aktiviteter.","widgets.catalog.activities":"Aktiviteter","widgets.catalog.start":"Start","widgets.catalog.end":"Slutt","widgets.catalog.no_history":"Ingen historikk","widgets.catalog.running_3":"Kjorer","widgets.catalog.ready_3":"Ferdig","widgets.catalog.on_off_buttons":"Av/på-knapper","widgets.catalog.could_not_change_button":"Kunne ikke endre knappen.","widgets.catalog.settings_settings":"Innstillinger","widgets.catalog.settings_only_existing_modeswitch_settings":"Bare eksisterende ModeSwitch-innstillinger","widgets.catalog.settings_save":"Lagre","widgets.catalog.settings_refresh":"Oppdater","widgets.catalog.settings_overview":"Oversikt","widgets.catalog.settings_modes":"Moduser","widgets.catalog.settings_zones":"Soner","widgets.catalog.settings_temp":"Temp.","widgets.catalog.settings_monitoring":"Overvåking","widgets.catalog.settings_schedule":"Planlegging","widgets.catalog.settings_auto":"Auto","widgets.catalog.settings_export":"Eksport","widgets.catalog.settings_counts":"Antall","widgets.catalog.settings_current_mode":"Gjeldende modus","widgets.catalog.settings_this_widget_only_uses_existing_configuration_sub_modes_mode_rules_zone_rules_tem":"This widget only uses existing configuration: Undermoduser, Modus rules, Soneregler, Temperatur rules, appliance notifications, schedules and Automatisk modus.","widgets.catalog.settings_sub_modes":"Undermoduser","widgets.catalog.settings_mode_rules":"Modusregler","widgets.catalog.settings_new_sub_mode":"+ Ny undermodus","widgets.catalog.settings_mode_rules_are_shown_compactly_here_detailed_rules_remain_in_the_normal_settings":"Modus rules are shown compactly here. Detailed rules remain in the normal Innstillinger page.","widgets.catalog.settings_zone_rules":"Soneregler","widgets.catalog.settings_new_zone_rule":"+ Ny soneregel","widgets.catalog.settings_temperature":"Temperatur","widgets.catalog.settings_new_temperature_rule":"+ Ny temperaturregel","widgets.catalog.settings_appliance_notifications":"Apparatvarsler","widgets.catalog.settings_new_appliance":"+ Nytt apparat","widgets.catalog.settings_automatic_mode":"Automatisk modus","widgets.catalog.settings_status":"Status","widgets.catalog.settings_vacation_after_hours":"Ferie after hours","widgets.catalog.settings_summary":"Sammendrag","widgets.catalog.settings_sections":"Deler","widgets.catalog.settings_new":"Ny","widgets.catalog.settings_cancel":"Avbryt","widgets.catalog.settings_add":"Legg til","widgets.catalog.settings_edit":"Rediger","widgets.catalog.settings_rule":"Regel","widgets.catalog.settings_no_zone":"Ingen sone","widgets.catalog.settings_main_mode":"Hovedmodus","widgets.catalog.settings_background_url":"Bakgrunns-URL","widgets.catalog.settings_zone":"Sone","widgets.catalog.settings_no_motion_after_sec":"Ingen bevegelse etter sek.","widgets.catalog.settings_lux_below":"Lux under","widgets.catalog.settings_active":"Aktiv","widgets.catalog.settings_yes":"Ja","widgets.catalog.settings_no":"Nei","widgets.catalog.settings_loaded":"Lastet","widgets.catalog.settings_basic_loaded":"Grunnlag lastet","widgets.catalog.settings_render_error":"Visningsfeil","widgets.catalog.settings_saving":"Lagrer…","widgets.catalog.settings_saved":"Lagret","widgets.catalog.settings_save_failed":"Lagring mislyktes","widgets.catalog.settings_zone_rules_contain_existing_settings_such_as_motion_door_window_contacts_lights_":"Soneregler contain existing Innstillinger such as Bevegelse, door/window contacts, Lys, lux and times.","widgets.catalog.settings_uses_existing_temperature_rules_per_mode_zone_including_window_and_smart_weather":"Uses existing Temperatur rules per Modus/zone, including window and smart weather Innstillinger where available.","widgets.catalog.settings_uses_existing_monitoring_rules_based_on_power_consumption":"Uses existing Overvaking rules based on Effekt consumption.","widgets.catalog.settings_new_schedule":"+ Ny Planlegging","widgets.catalog.settings_schedule_uses_existing_options_fixed_time_random_time_sunrise_sunset_auto_on_off":"Planlegging uses existing options: fixed time, random time, sunrise/sunset, auto on/off and lux conditions.","widgets.catalog.settings_existing_automode_enabled":"Existing autoMode.Aktivert","widgets.catalog.settings_existing_automode_vacationafterhours":"Existing autoMode.vacationAfterHours","widgets.catalog.settings_only_existing_automatic_mode_fields_are_saved_unknown_fields_remain_unchanged":"Bare eksisterende felt for automatisk modus lagres; ukjente felt forblir uendret.","widgets.catalog.settings_import_export":"Import/Eksport","widgets.catalog.settings_import_intentionally_remains_on_the_normal_settings_page_so_you_keep_the_preview":"Import intentionally remains on the normal Innstillinger page so you keep the preview/check step.","widgets.catalog.settings_name":"Navn","widgets.catalog.settings_icon":"Ikon","widgets.catalog.settings_accent_color":"Aksentfarge","widgets.catalog.settings_mode":"Modus","widgets.catalog.settings_temperature_c":"Temperatur °C","widgets.catalog.settings_window_open":"Vindu/dør åpent","widgets.catalog.settings_ignore":"Ignorer","widgets.catalog.settings_skip":"Hopp over","widgets.catalog.settings_window_temp_c":"Temperatur ved åpent vindu °C","widgets.catalog.settings_appliance":"Appliance","widgets.catalog.settings_type":"Type","widgets.catalog.settings_washing_machine":"Vaskemaskin","widgets.catalog.settings_dryer":"Tørketrommel","widgets.catalog.settings_dishwasher":"Oppvaskmaskin","widgets.catalog.settings_custom":"Egendefinert","widgets.catalog.settings_start_above_w":"Start over W","widgets.catalog.settings_ready_below_w":"Ferdig under W","widgets.catalog.settings_ready_delay_sec":"Ferdig-forsinkelse sek.","widgets.catalog.settings_action":"Handling","widgets.catalog.settings_on":"På","widgets.catalog.settings_off":"Av","widgets.catalog.settings_toggle":"Bytt","widgets.catalog.settings_time_mode":"Tidstype","widgets.catalog.settings_fixed_time":"Fast tidspunkt","widgets.catalog.settings_random":"Tilfeldig","widgets.catalog.settings_sunrise":"Soloppgang","widgets.catalog.settings_sunset":"Solnedgang","widgets.catalog.settings_unknown_device":"Ukjent enhet","widgets.catalog.settings_sub_modes_2":"Undermoduser","widgets.catalog.settings_zone_rule":"Soneregel","widgets.catalog.settings_temperature_rule":"Temperaturregel","widgets.catalog.settings_more":"mer","widgets.catalog.settings_more_in_normal_settings":"mer i vanlige innstillinger","widgets.catalog.settings_settings_2":"Innstillinger","widgets.catalog.settings_time":"tid","widgets.catalog.settings_vacation_after":"Ferie etter","widgets.catalog.settings_loading_more":"laster mer…","widgets.catalog.settings_homey_api_not_ready":"Homey API er ikke klar","widgets.catalog.settings_home":"Hjemme","widgets.catalog.settings_sleep":"Sove","widgets.catalog.settings_away":"Borte","widgets.catalog.settings_vacation":"Ferie","widgets.catalog.settings_new_sub_mode_2":"Ny undermodus","widgets.catalog.settings_sub_mode":"Undermodus","widgets.catalog.settings_appliance_notification":"Apparatvarsel","widgets.catalog.settings_new_zone_rule_2":"Ny soneregel","widgets.catalog.settings_new_temperature_rule_2":"Ny temperaturregel","widgets.catalog.settings_new_schedule_2":"Ny planlegging"});
Object.assign(I18N["no"]||(I18N["no"]={}), {"settings.hero.kicker":"Smart hjem-automatisering","settings.activities.description":"Følg aktiviteter ved hjelp av én eller flere betingelser fra enheter, sensorer, soner og andre aktiviteter.","settings.activities.hint":"Åpne en aktivitet for å endre navn, betingelser, terskler og historikkinnstillinger.","settings.mode_switch_devices.title":"Mode & Switch-enheter","settings.mode_switch_devices.description":"Koble handlinger til listemoduser og av/på-brytere på opprettede Mode & Switch-enheter.","settings.mode_switch_devices.hint":"Konfigurer hvilke enheter eller lys som skal slås av eller på per enhet og modus, på samme måte som med den opprinnelige kontrolleren.","settings.mode_switch_devices.refresh":"Oppdater enheter","settings.keypads.title":"Tastaturer","settings.keypads.description":"Koble en PIN-kode direkte til en modus. PIN-koden lagres ikke i lesbar form etter lagring.","settings.keypads.add":"+ Legg til tastaturkobling","settings.display.title":"Visning av gjeldende modus","settings.display.description":"Velg hvilken temperaturenhet som vises øverst til høyre i Gjeldende modus, og om modus-widgeten viser live-kontekst.","settings.display.temperature_device":"Temperatur i Gjeldende modus","settings.display.temperature_device_hint":"Velg en enhet med temperaturmåling. Tomt = ikke vis merke.","settings.display.live_context":"Værbakgrunn for hovedmoduser","settings.display.live_context_hint":"Gir automatisk hovedmodusknappene dag-/nattbakgrunn med sol, måne, skyer, regn, snø, tåke eller torden. Bruker valgt temperatur-/værenhet der det er mulig.","settings.debug.title":"Krasjlogg","settings.debug.description":"De siste appfeilene. Disse er fortsatt tilgjengelige etter en automatisk omstart.","settings.debug.refresh":"Oppdater krasjlogg","settings.debug.clear":"Tøm krasjlogg","settings.debug.not_loaded":"Ikke lastet ennå.","settings.import.choose_file":"Velg fil","settings.import.no_file_chosen":"Ingen fil valgt"});
Object.assign(I18N["no"], {"settings.activities.description":"Følg aktiviteter ved hjelp av én eller flere betingelser fra enheter, sensorer, soner og andre aktiviteter.","settings.keypads.title":"Tastaturer","settings.keypads.description":"Koble en PIN-kode direkte til en modus. PIN-koden lagres ikke lesbart etter lagring.","settings.keypads.add":"+ Legg til tastaturkobling","settings.keypads.bridge_title":"Bridge-Flow","settings.keypads.bridge_description":"Bruk keypad-ID-en i Flow-kortet som sender PIN-koden til Mode Switch.","settings.mode_switch_devices.title":"Mode & Switch-enheter","settings.mode_switch_devices.description":"Koble handlinger til listemoduser og av/på-knapper på opprettede Mode & Switch-enheter.","settings.mode_switch_devices.hint":"Her kan du per enhet og modus slå enheter eller lys av/på, på samme måte som i den opprinnelige kontrolleren.","settings.mode_switch_devices.refresh":"Oppdater enheter"});
I18N["sv"] = Object.assign(I18N["sv"] || {}, {"mode.home": "Hemma", "mode.away": "Borta", "mode.sleep": "Sova", "mode.vacation": "Semester", "mode.home_tv": "Titta pa TV", "mode.home_romantic": "Romantiskt", "mode.home_game": "Spel", "mode.home_movie": "Titta pa film", "driver.mode_controller.default_name": "Lage Controller", "settings.__lang": "sv", "settings.hero.description": "Lagen, Zonregler, door/window contacts, schedules, sunrise/sunset, lux and Automatiskt lage.", "settings.current_mode.loading": "Aktuellt lage: laddar...", "settings.submodes.title": "Underlagen", "settings.submodes.description": "Create extra choices under a main Lage, for example Titta pa TV under Hemma.", "settings.submodes.add": "Ny Underlage", "settings.zones.title": "Zonregler", "settings.zones.description": "Rorelse, door/window contacts, subzones, Lampor, dimming and conditions.", "settings.zones.add": "Ny zone rule", "settings.temperature.title": "Temperatur per Lage and zone", "settings.temperature.description": "Set the desired Temperatur per Lage and zone. Enheter with target_Temperatur are updated automatically when the Lage changes.", "settings.temperature.add": "Ny Temperatur rule", "settings.appliances.title": "Appliance notifications", "settings.appliances.description": "Detect Start and Klar status using Effekt consumption from a smart plug or Enhet with measure_Effekt.", "settings.appliances.add": "Ny appliance", "settings.schedule.title": "Schema", "settings.schedule.description": "Switch Lampor/Enheter on or off at a fixed time, random time, sunrise or sunset. Optionally use lux per zone.", "settings.schedule.add": "Ny Schema", "settings.import_export.title": "Import / export", "settings.import_export.description": "Create a backup of everything or choose which sections to include.", "settings.export.title": "Export", "settings.export.description": "Choose sections and copy a JSON backup.", "settings.export.copy_json": "Kopiera JSON", "settings.import.title": "Import", "settings.import.description": "Choose a previously created JSON backup. You can then Valj which sections to restore.", "settings.import.placeholder": "Paste the JSON export here if choosing a file does not work", "settings.import.load_from_text": "Load JSON from text field", "settings.import.no_file": "Ingen fil har valts annu.", "settings.import.apply": "Tillampa import", "settings.activities.title": "Activity Overvakning", "settings.activities.add": "Ny activity", "settings.menu.section": "Section", "common.refresh": "Uppdatera", "common.save_all": "Spara allt", "common.expand_all": "Expand all", "common.collapse_all": "Collapse all", "common.select_all": "Valj all", "tabs.modes": "Lagen", "tabs.zones": "Zoner och sensorer", "tabs.temperature": "Temperatur", "tabs.monitoring": "Overvakning", "tabs.schedule": "Schema", "tabs.import_export": "Import/Export", "tabs.automatic_mode": "Automatiskt lage", "widgets.common.current_mode": "Aktuellt lage", "widgets.common.refresh": "Uppdatera", "widgets.common.running": "Kors", "widgets.common.ready": "Klar", "widgets.common.standby": "Vanteläge", "widgets.common.duration": "Varaktighet", "widgets.common.appliances": "Appliances", "widgets.common.no_appliances": "No appliances", "widgets.common.no_appliances_configured": "No appliances configured.", "widgets.common.appliance": "Appliance", "widgets.common.could_not_load_widget_data": "Could not load widget data.", "widgets.common.could_not_load_status": "Could not load status.", "widgets.common.could_not_change_mode": "Could not change Lage.", "widgets.common.monitoring": "Overvakning", "widgets.common.mode": "Lage", "widgets.common.appliance_monitoring": "Appliance Overvakning", "widgets.common.no_sub_mode": "No Underlage", "widgets.common.activities": "Aktiviteter", "widgets.common.activity": "Activity", "widgets.common.activity_monitoring": "Activity Overvakning", "widgets.common.active": "Active", "widgets.common.history": "Historik", "widgets.common.no_history": "No Historik", "widgets.common.start": "Start", "widgets.common.end": "End", "widgets.modes.home": "Hemma", "widgets.modes.away": "Borta", "widgets.modes.sleep": "Sova", "widgets.modes.vacation": "Semester", "widgets.modes.home_tv": "Titta pa TV", "widgets.modes.home_movie": "Titta pa film", "widgets.modes.home_game": "Spel", "widgets.modes.home_romantic": "Romantiskt", "widgets.catalog.monitoring": "Overvakning", "widgets.catalog.mode": "Lage", "widgets.catalog.appliance_monitoring": "Appliance Overvakning", "widgets.catalog.current_mode": "Aktuellt lage", "widgets.catalog.appliances": "Appliances", "widgets.catalog.refresh": "Uppdatera", "widgets.catalog.running": "Kors", "widgets.catalog.ready": "Klar", "widgets.catalog.standby": "Vanteläge", "widgets.catalog.appliance": "Appliance", "widgets.catalog.history": "Historik", "widgets.catalog.no_completed_cycles_have_been_saved_yet": "No completed cycles have been saved yet.", "widgets.catalog.unknown_date": "Unknown date", "widgets.catalog.duration": "Varaktighet", "widgets.catalog.average": "Average", "widgets.catalog.home": "Hemma", "widgets.catalog.sleep": "Sova", "widgets.catalog.away": "Borta", "widgets.catalog.vacation": "Semester", "widgets.catalog.no_sub_mode": "No Underlage", "widgets.catalog.watch_tv": "Titta pa TV", "widgets.catalog.watch_movie": "Titta pa film", "widgets.catalog.game": "Spel", "widgets.catalog.romantic": "Romantiskt", "widgets.catalog.could_not_load_widget_data": "Could not load widget data.", "widgets.catalog.running_2": "Kors", "widgets.catalog.ready_2": "Klar", "widgets.catalog.no_appliances": "No appliances", "widgets.catalog.no_appliances_configured": "No appliances configured.", "widgets.catalog.history_2": "Historik", "widgets.catalog.could_not_load_status": "Could not load status.", "widgets.catalog.could_not_change_mode": "Could not change Lage.", "widgets.catalog.active": "active", "widgets.catalog.configured": "configured", "widgets.catalog.no_activities_configured": "No Aktiviteter configured", "widgets.catalog.create_activities_from_the_settings_page": "Create Aktiviteter from the Installningar page.", "widgets.catalog.activity": "Activity", "widgets.catalog.started": "Started", "widgets.catalog.last_session": "Last session", "widgets.catalog.conditions": "Conditions", "widgets.catalog.active_2": "Active", "widgets.catalog.no_previous_sessions_yet": "No previous sessions yet.", "widgets.catalog.could_not_load_activities": "Could not load Aktiviteter.", "widgets.catalog.activities": "Aktiviteter", "widgets.catalog.start": "Start", "widgets.catalog.end": "End", "widgets.catalog.no_history": "No Historik", "widgets.catalog.running_3": "Kors", "widgets.catalog.ready_3": "Klar", "widgets.catalog.on_off_buttons": "Pa/off buttons", "widgets.catalog.could_not_change_button": "Could not change button.", "widgets.catalog.settings_settings": "Installningar", "widgets.catalog.settings_only_existing_modeswitch_settings": "Only existing ModeSwitch Installningar", "widgets.catalog.settings_save": "Spara", "widgets.catalog.settings_refresh": "Uppdatera", "widgets.catalog.settings_overview": "Overview", "widgets.catalog.settings_modes": "Lagen", "widgets.catalog.settings_zones": "Zones", "widgets.catalog.settings_temp": "Temp.", "widgets.catalog.settings_monitoring": "Overvakning", "widgets.catalog.settings_schedule": "Schema", "widgets.catalog.settings_auto": "Auto", "widgets.catalog.settings_export": "Export", "widgets.catalog.settings_counts": "Counts", "widgets.catalog.settings_current_mode": "Aktuellt lage", "widgets.catalog.settings_this_widget_only_uses_existing_configuration_sub_modes_mode_rules_zone_rules_tem": "This widget only uses existing configuration: Underlagen, Lage rules, Zonregler, Temperatur rules, appliance notifications, schedules and Automatiskt lage.", "widgets.catalog.settings_sub_modes": "Underlagen", "widgets.catalog.settings_mode_rules": "Lage rules", "widgets.catalog.settings_new_sub_mode": "+ Ny Underlage", "widgets.catalog.settings_mode_rules_are_shown_compactly_here_detailed_rules_remain_in_the_normal_settings": "Lage rules are shown compactly here. Detailed rules remain in the normal Installningar page.", "widgets.catalog.settings_zone_rules": "Zonregler", "widgets.catalog.settings_new_zone_rule": "+ Ny zone rule", "widgets.catalog.settings_temperature": "Temperatur", "widgets.catalog.settings_new_temperature_rule": "+ Ny Temperatur rule", "widgets.catalog.settings_appliance_notifications": "Appliance notifications", "widgets.catalog.settings_new_appliance": "+ Ny appliance", "widgets.catalog.settings_automatic_mode": "Automatiskt lage", "widgets.catalog.settings_status": "Status", "widgets.catalog.settings_vacation_after_hours": "Semester after hours", "widgets.catalog.settings_summary": "Summary", "widgets.catalog.settings_sections": "Sections", "widgets.catalog.settings_new": "Ny", "widgets.catalog.settings_cancel": "Avbryt", "widgets.catalog.settings_add": "Lagg till", "widgets.catalog.settings_edit": "Redigera", "widgets.catalog.settings_rule": "Rule", "widgets.catalog.settings_no_zone": "No zone", "widgets.catalog.settings_main_mode": "Main Lage", "widgets.catalog.settings_background_url": "Background URL", "widgets.catalog.settings_zone": "Zone", "widgets.catalog.settings_no_motion_after_sec": "No Rorelse after sec.", "widgets.catalog.settings_lux_below": "Lux below", "widgets.catalog.settings_active": "Active", "widgets.catalog.settings_yes": "Yes", "widgets.catalog.settings_no": "No", "widgets.catalog.settings_loaded": "Loaded", "widgets.catalog.settings_basic_loaded": "Basic loaded", "widgets.catalog.settings_render_error": "Render error", "widgets.catalog.settings_saving": "Saving...", "widgets.catalog.settings_saved": "Saved", "widgets.catalog.settings_save_failed": "Spara failed", "widgets.catalog.settings_zone_rules_contain_existing_settings_such_as_motion_door_window_contacts_lights_": "Zonregler contain existing Installningar such as Rorelse, door/window contacts, Lampor, lux and times.", "widgets.catalog.settings_uses_existing_temperature_rules_per_mode_zone_including_window_and_smart_weather": "Uses existing Temperatur rules per Lage/zone, including window and smart weather Installningar where available.", "widgets.catalog.settings_uses_existing_monitoring_rules_based_on_power_consumption": "Uses existing Overvakning rules based on Effekt consumption.", "widgets.catalog.settings_new_schedule": "+ Ny Schema", "widgets.catalog.settings_schedule_uses_existing_options_fixed_time_random_time_sunrise_sunset_auto_on_off": "Schema uses existing options: fixed time, random time, sunrise/sunset, auto on/off and lux conditions.", "widgets.catalog.settings_existing_automode_enabled": "Existing autoMode.Aktiverad", "widgets.catalog.settings_existing_automode_vacationafterhours": "Existing autoMode.vacationAfterHours", "widgets.catalog.settings_only_existing_automatic_mode_fields_are_saved_unknown_fields_remain_unchanged": "Only existing automatic-Lage fields are saved; unknown fields remain unchanged.", "widgets.catalog.settings_import_export": "Import/Export", "widgets.catalog.settings_import_intentionally_remains_on_the_normal_settings_page_so_you_keep_the_preview": "Import intentionally remains on the normal Installningar page so you keep the preview/check step.", "widgets.catalog.settings_name": "Namn", "widgets.catalog.settings_icon": "Icon", "widgets.catalog.settings_accent_color": "Accent color", "widgets.catalog.settings_mode": "Lage", "widgets.catalog.settings_temperature_c": "Temperatur °C", "widgets.catalog.settings_window_open": "Window Oppen", "widgets.catalog.settings_ignore": "Ignore", "widgets.catalog.settings_skip": "Skip", "widgets.catalog.settings_window_temp_c": "Window temp. °C", "widgets.catalog.settings_appliance": "Appliance", "widgets.catalog.settings_type": "Type", "widgets.catalog.settings_washing_machine": "Washing machine", "widgets.catalog.settings_dryer": "Dryer", "widgets.catalog.settings_dishwasher": "Dishwasher", "widgets.catalog.settings_custom": "Custom", "widgets.catalog.settings_start_above_w": "Start above W", "widgets.catalog.settings_ready_below_w": "Klar below W", "widgets.catalog.settings_ready_delay_sec": "Klar delay sec.", "widgets.catalog.settings_action": "Action", "widgets.catalog.settings_on": "Pa", "widgets.catalog.settings_off": "Av", "widgets.catalog.settings_toggle": "Toggle", "widgets.catalog.settings_time_mode": "Time Lage", "widgets.catalog.settings_fixed_time": "Fixed time", "widgets.catalog.settings_random": "Random", "widgets.catalog.settings_sunrise": "Sunrise", "widgets.catalog.settings_sunset": "Sunset", "widgets.catalog.settings_unknown_device": "Unknown Enhet", "widgets.catalog.settings_sub_modes_2": "Underlagen", "widgets.catalog.settings_zone_rule": "Zone rule", "widgets.catalog.settings_temperature_rule": "Temperatur rule", "widgets.catalog.settings_more": "more", "widgets.catalog.settings_more_in_normal_settings": "more in normal Installningar", "widgets.catalog.settings_settings_2": "Installningar", "widgets.catalog.settings_time": "time", "widgets.catalog.settings_vacation_after": "Semester after", "widgets.catalog.settings_loading_more": "laddar more...", "widgets.catalog.settings_homey_api_not_ready": "Homey API not Klar", "widgets.catalog.settings_home": "Hemma", "widgets.catalog.settings_sleep": "Sova", "widgets.catalog.settings_away": "Borta", "widgets.catalog.settings_vacation": "Semester", "widgets.catalog.settings_new_sub_mode_2": "Ny Underlage", "widgets.catalog.settings_sub_mode": "Underlage", "widgets.catalog.settings_appliance_notification": "Appliance notification", "widgets.catalog.settings_new_zone_rule_2": "Ny zone rule", "widgets.catalog.settings_new_temperature_rule_2": "Ny Temperatur rule", "widgets.catalog.settings_new_schedule_2": "Ny Schema"});
I18N["it"] = Object.assign(I18N["it"] || {}, {"mode.home": "Casa", "mode.away": "Fuori casa", "mode.sleep": "Sonno", "mode.vacation": "Vacanza", "mode.home_tv": "Guarda TV", "mode.home_romantic": "Romantico", "mode.home_game": "Gioco", "mode.home_movie": "Guarda film", "driver.mode_controller.default_name": "Modalita Controller", "settings.__lang": "it", "settings.hero.description": "Modalita, Regole di zona, door/window contacts, schedules, sunrise/sunset, lux and Modalita automatica.", "settings.current_mode.loading": "Modalita attuale: caricamento...", "settings.submodes.title": "Sottomodalita", "settings.submodes.description": "Create extra choices under a main Modalita, for example Guarda TV under Casa.", "settings.submodes.add": "Nuovo Sottomodalita", "settings.zones.title": "Regole di zona", "settings.zones.description": "Movimento, door/window contacts, subzones, Luci, dimming and conditions.", "settings.zones.add": "Nuovo zone rule", "settings.temperature.title": "Temperatura per Modalita and zone", "settings.temperature.description": "Set the desired Temperatura per Modalita and zone. Dispositivi with target_Temperatura are updated automatically when the Modalita changes.", "settings.temperature.add": "Nuovo Temperatura rule", "settings.appliances.title": "Appliance notifications", "settings.appliances.description": "Detect Avvio and Pronto status using Potenza consumption from a smart plug or Dispositivo with measure_Potenza.", "settings.appliances.add": "Nuovo appliance", "settings.schedule.title": "Pianificazione", "settings.schedule.description": "Switch Luci/Dispositivi on or off at a fixed time, random time, sunrise or sunset. Optionally use lux per zone.", "settings.schedule.add": "Nuovo Pianificazione", "settings.import_export.title": "Importazione / esportazione", "settings.import_export.description": "Create a backup of everything or choose which sections to include.", "settings.export.title": "Export", "settings.export.description": "Choose sections and copy a JSON backup.", "settings.export.copy_json": "Copia JSON", "settings.import.title": "Import", "settings.import.description": "Choose a previously created JSON backup. You can then Seleziona which sections to restore.", "settings.import.placeholder": "Paste the JSON export here if choosing a file does not work", "settings.import.load_from_text": "Load JSON from text field", "settings.import.no_file": "Nessun file selezionato.", "settings.import.apply": "Applica importazione", "settings.activities.title": "Activity Monitoraggio", "settings.activities.add": "Nuovo activity", "settings.menu.section": "Section", "common.refresh": "Aggiorna", "common.save_all": "Salva tutto", "common.expand_all": "Expand all", "common.collapse_all": "Collapse all", "common.select_all": "Seleziona all", "tabs.modes": "Modalita", "tabs.zones": "Zone e sensori", "tabs.temperature": "Temperatura", "tabs.monitoring": "Monitoraggio", "tabs.schedule": "Pianificazione", "tabs.import_export": "Importa/Esporta", "tabs.automatic_mode": "Modalita automatica", "widgets.common.current_mode": "Modalita attuale", "widgets.common.refresh": "Aggiorna", "widgets.common.running": "In esecuzione", "widgets.common.ready": "Pronto", "widgets.common.standby": "Standby", "widgets.common.duration": "Durata", "widgets.common.appliances": "Appliances", "widgets.common.no_appliances": "No appliances", "widgets.common.no_appliances_configured": "No appliances configured.", "widgets.common.appliance": "Appliance", "widgets.common.could_not_load_widget_data": "Could not load widget data.", "widgets.common.could_not_load_status": "Could not load status.", "widgets.common.could_not_change_mode": "Could not change Modalita.", "widgets.common.monitoring": "Monitoraggio", "widgets.common.mode": "Modalita", "widgets.common.appliance_monitoring": "Appliance Monitoraggio", "widgets.common.no_sub_mode": "No Sottomodalita", "widgets.common.activities": "Attivita", "widgets.common.activity": "Activity", "widgets.common.activity_monitoring": "Activity Monitoraggio", "widgets.common.active": "Active", "widgets.common.history": "Cronologia", "widgets.common.no_history": "No Cronologia", "widgets.common.start": "Avvio", "widgets.common.end": "End", "widgets.modes.home": "Casa", "widgets.modes.away": "Fuori casa", "widgets.modes.sleep": "Sonno", "widgets.modes.vacation": "Vacanza", "widgets.modes.home_tv": "Guarda TV", "widgets.modes.home_movie": "Guarda film", "widgets.modes.home_game": "Gioco", "widgets.modes.home_romantic": "Romantico", "widgets.catalog.monitoring": "Monitoraggio", "widgets.catalog.mode": "Modalita", "widgets.catalog.appliance_monitoring": "Appliance Monitoraggio", "widgets.catalog.current_mode": "Modalita attuale", "widgets.catalog.appliances": "Appliances", "widgets.catalog.refresh": "Aggiorna", "widgets.catalog.running": "In esecuzione", "widgets.catalog.ready": "Pronto", "widgets.catalog.standby": "Standby", "widgets.catalog.appliance": "Appliance", "widgets.catalog.history": "Cronologia", "widgets.catalog.no_completed_cycles_have_been_saved_yet": "No completed cycles have been saved yet.", "widgets.catalog.unknown_date": "Unknown date", "widgets.catalog.duration": "Durata", "widgets.catalog.average": "Average", "widgets.catalog.home": "Casa", "widgets.catalog.sleep": "Sonno", "widgets.catalog.away": "Fuori casa", "widgets.catalog.vacation": "Vacanza", "widgets.catalog.no_sub_mode": "No Sottomodalita", "widgets.catalog.watch_tv": "Guarda TV", "widgets.catalog.watch_movie": "Guarda film", "widgets.catalog.game": "Gioco", "widgets.catalog.romantic": "Romantico", "widgets.catalog.could_not_load_widget_data": "Could not load widget data.", "widgets.catalog.running_2": "In esecuzione", "widgets.catalog.ready_2": "Pronto", "widgets.catalog.no_appliances": "No appliances", "widgets.catalog.no_appliances_configured": "No appliances configured.", "widgets.catalog.history_2": "Cronologia", "widgets.catalog.could_not_load_status": "Could not load status.", "widgets.catalog.could_not_change_mode": "Could not change Modalita.", "widgets.catalog.active": "active", "widgets.catalog.configured": "configured", "widgets.catalog.no_activities_configured": "No Attivita configured", "widgets.catalog.create_activities_from_the_settings_page": "Create Attivita from the Impostazioni page.", "widgets.catalog.activity": "Activity", "widgets.catalog.started": "Started", "widgets.catalog.last_session": "Last session", "widgets.catalog.conditions": "Conditions", "widgets.catalog.active_2": "Active", "widgets.catalog.no_previous_sessions_yet": "No previous sessions yet.", "widgets.catalog.could_not_load_activities": "Could not load Attivita.", "widgets.catalog.activities": "Attivita", "widgets.catalog.start": "Avvio", "widgets.catalog.end": "End", "widgets.catalog.no_history": "No Cronologia", "widgets.catalog.running_3": "In esecuzione", "widgets.catalog.ready_3": "Pronto", "widgets.catalog.on_off_buttons": "Acceso/off buttons", "widgets.catalog.could_not_change_button": "Could not change button.", "widgets.catalog.settings_settings": "Impostazioni", "widgets.catalog.settings_only_existing_modeswitch_settings": "Only existing ModeSwitch Impostazioni", "widgets.catalog.settings_save": "Salva", "widgets.catalog.settings_refresh": "Aggiorna", "widgets.catalog.settings_overview": "Overview", "widgets.catalog.settings_modes": "Modalita", "widgets.catalog.settings_zones": "Zones", "widgets.catalog.settings_temp": "Temp.", "widgets.catalog.settings_monitoring": "Monitoraggio", "widgets.catalog.settings_schedule": "Pianificazione", "widgets.catalog.settings_auto": "Auto", "widgets.catalog.settings_export": "Export", "widgets.catalog.settings_counts": "Counts", "widgets.catalog.settings_current_mode": "Modalita attuale", "widgets.catalog.settings_this_widget_only_uses_existing_configuration_sub_modes_mode_rules_zone_rules_tem": "This widget only uses existing configuration: Sottomodalita, Modalita rules, Regole di zona, Temperatura rules, appliance notifications, schedules and Modalita automatica.", "widgets.catalog.settings_sub_modes": "Sottomodalita", "widgets.catalog.settings_mode_rules": "Modalita rules", "widgets.catalog.settings_new_sub_mode": "+ Nuovo Sottomodalita", "widgets.catalog.settings_mode_rules_are_shown_compactly_here_detailed_rules_remain_in_the_normal_settings": "Modalita rules are shown compactly here. Detailed rules remain in the normal Impostazioni page.", "widgets.catalog.settings_zone_rules": "Regole di zona", "widgets.catalog.settings_new_zone_rule": "+ Nuovo zone rule", "widgets.catalog.settings_temperature": "Temperatura", "widgets.catalog.settings_new_temperature_rule": "+ Nuovo Temperatura rule", "widgets.catalog.settings_appliance_notifications": "Appliance notifications", "widgets.catalog.settings_new_appliance": "+ Nuovo appliance", "widgets.catalog.settings_automatic_mode": "Modalita automatica", "widgets.catalog.settings_status": "Status", "widgets.catalog.settings_vacation_after_hours": "Vacanza after hours", "widgets.catalog.settings_summary": "Summary", "widgets.catalog.settings_sections": "Sections", "widgets.catalog.settings_new": "Nuovo", "widgets.catalog.settings_cancel": "Annulla", "widgets.catalog.settings_add": "Aggiungi", "widgets.catalog.settings_edit": "Modifica", "widgets.catalog.settings_rule": "Rule", "widgets.catalog.settings_no_zone": "No zone", "widgets.catalog.settings_main_mode": "Main Modalita", "widgets.catalog.settings_background_url": "Background URL", "widgets.catalog.settings_zone": "Zone", "widgets.catalog.settings_no_motion_after_sec": "No Movimento after sec.", "widgets.catalog.settings_lux_below": "Lux below", "widgets.catalog.settings_active": "Active", "widgets.catalog.settings_yes": "Yes", "widgets.catalog.settings_no": "No", "widgets.catalog.settings_loaded": "Loaded", "widgets.catalog.settings_basic_loaded": "Basic loaded", "widgets.catalog.settings_render_error": "Render error", "widgets.catalog.settings_saving": "Saving...", "widgets.catalog.settings_saved": "Saved", "widgets.catalog.settings_save_failed": "Salva failed", "widgets.catalog.settings_zone_rules_contain_existing_settings_such_as_motion_door_window_contacts_lights_": "Regole di zona contain existing Impostazioni such as Movimento, door/window contacts, Luci, lux and times.", "widgets.catalog.settings_uses_existing_temperature_rules_per_mode_zone_including_window_and_smart_weather": "Uses existing Temperatura rules per Modalita/zone, including window and smart weather Impostazioni where available.", "widgets.catalog.settings_uses_existing_monitoring_rules_based_on_power_consumption": "Uses existing Monitoraggio rules based on Potenza consumption.", "widgets.catalog.settings_new_schedule": "+ Nuovo Pianificazione", "widgets.catalog.settings_schedule_uses_existing_options_fixed_time_random_time_sunrise_sunset_auto_on_off": "Pianificazione uses existing options: fixed time, random time, sunrise/sunset, auto on/off and lux conditions.", "widgets.catalog.settings_existing_automode_enabled": "Existing autoMode.Attivato", "widgets.catalog.settings_existing_automode_vacationafterhours": "Existing autoMode.vacationAfterHours", "widgets.catalog.settings_only_existing_automatic_mode_fields_are_saved_unknown_fields_remain_unchanged": "Only existing automatic-Modalita fields are saved; unknown fields remain unchanged.", "widgets.catalog.settings_import_export": "Importa/Esporta", "widgets.catalog.settings_import_intentionally_remains_on_the_normal_settings_page_so_you_keep_the_preview": "Import intentionally remains on the normal Impostazioni page so you keep the preview/check step.", "widgets.catalog.settings_name": "Nome", "widgets.catalog.settings_icon": "Icon", "widgets.catalog.settings_accent_color": "Accent color", "widgets.catalog.settings_mode": "Modalita", "widgets.catalog.settings_temperature_c": "Temperatura °C", "widgets.catalog.settings_window_open": "Window Aperto", "widgets.catalog.settings_ignore": "Ignore", "widgets.catalog.settings_skip": "Skip", "widgets.catalog.settings_window_temp_c": "Window temp. °C", "widgets.catalog.settings_appliance": "Appliance", "widgets.catalog.settings_type": "Type", "widgets.catalog.settings_washing_machine": "Washing machine", "widgets.catalog.settings_dryer": "Dryer", "widgets.catalog.settings_dishwasher": "Dishwasher", "widgets.catalog.settings_custom": "Custom", "widgets.catalog.settings_start_above_w": "Avvio above W", "widgets.catalog.settings_ready_below_w": "Pronto below W", "widgets.catalog.settings_ready_delay_sec": "Pronto delay sec.", "widgets.catalog.settings_action": "Action", "widgets.catalog.settings_on": "Acceso", "widgets.catalog.settings_off": "Spento", "widgets.catalog.settings_toggle": "Toggle", "widgets.catalog.settings_time_mode": "Time Modalita", "widgets.catalog.settings_fixed_time": "Fixed time", "widgets.catalog.settings_random": "Random", "widgets.catalog.settings_sunrise": "Sunrise", "widgets.catalog.settings_sunset": "Sunset", "widgets.catalog.settings_unknown_device": "Unknown Dispositivo", "widgets.catalog.settings_sub_modes_2": "Sottomodalita", "widgets.catalog.settings_zone_rule": "Zone rule", "widgets.catalog.settings_temperature_rule": "Temperatura rule", "widgets.catalog.settings_more": "more", "widgets.catalog.settings_more_in_normal_settings": "more in normal Impostazioni", "widgets.catalog.settings_settings_2": "Impostazioni", "widgets.catalog.settings_time": "time", "widgets.catalog.settings_vacation_after": "Vacanza after", "widgets.catalog.settings_loading_more": "caricamento more...", "widgets.catalog.settings_homey_api_not_ready": "Homey API not Pronto", "widgets.catalog.settings_home": "Casa", "widgets.catalog.settings_sleep": "Sonno", "widgets.catalog.settings_away": "Fuori casa", "widgets.catalog.settings_vacation": "Vacanza", "widgets.catalog.settings_new_sub_mode_2": "Nuovo Sottomodalita", "widgets.catalog.settings_sub_mode": "Sottomodalita", "widgets.catalog.settings_appliance_notification": "Appliance notification", "widgets.catalog.settings_new_zone_rule_2": "Nuovo zone rule", "widgets.catalog.settings_new_temperature_rule_2": "Nuovo Temperatura rule", "widgets.catalog.settings_new_schedule_2": "Nuovo Pianificazione"});

function getHomeyLang(){
  // Prefer Homey's own translation engine. This reads the active Homey language
  // from locales/*.json using a tiny marker key when present.
  if(HomeyInstance && typeof HomeyInstance.__ === 'function'){
    const marker = HomeyInstance.__('settings.__lang');
    if(['nl','en','de','fr','es','no','sv','it'].includes(marker)) return marker;
  }
  const lang = (HomeyInstance && (HomeyInstance.__language || HomeyInstance.language || HomeyInstance.lang || (HomeyInstance.i18n && HomeyInstance.i18n.language))) || navigator.language || 'nl';
  return detectSupportedLanguage(lang);
}
function t(key){
  const lang = APP_LANG || getHomeyLang();
  if(HomeyInstance && typeof HomeyInstance.__ === 'function'){
    const translated = HomeyInstance.__(key);
    if(translated && translated !== key) return translated;
  }
  return (I18N[lang] && I18N[lang][key]) || (I18N.en && I18N.en[key]) || (I18N.nl && I18N.nl[key]) || key;
}
function tt(nl, en){
  const lang = APP_LANG || getHomeyLang();
  if(lang === 'nl') return nl;
  if(lang === 'en') return en;
  const table = (PHRASE_I18N && PHRASE_I18N[lang]) || {};
  return table[en] || table[nl] || en || nl;
}
function applyStaticTranslations(){
  APP_LANG = getHomeyLang();
  document.documentElement.lang = APP_LANG;
  document.documentElement.style.setProperty('--hero-kicker', JSON.stringify(t('settings.hero.kicker')));
  document.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = t(node.dataset.i18n); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(node => { node.setAttribute('placeholder', t(node.dataset.i18nPlaceholder)); });
  const activeTab = document.querySelector('.tab.active');
  const currentSection = document.getElementById('settingsMenuCurrent');
  if(currentSection && activeTab) currentSection.textContent = activeTab.textContent.trim();
  setupLocalizedFilePicker();
}


function setupLocalizedFilePicker(){
  const input=document.getElementById('importFileInput'); const btn=document.getElementById('importFileChooseBtn'); const name=document.getElementById('importFileName');
  if(!input||!btn||!name||btn.dataset.bound==='1') return; btn.dataset.bound='1';
  btn.addEventListener('click',()=>input.click());
  input.addEventListener('change',()=>{ name.textContent=(input.files&&input.files[0])?input.files[0].name:t('settings.import.no_file_chosen'); });
}
const STANDARD_MODE_LABELS = {
  home: {nl:'Thuis',en:'Home',de:'Zuhause',fr:'Maison',es:'Casa',no:'Hjemme',sv:'Hemma',it:'Casa'},
  sleep: {nl:'Slapen',en:'Sleep',de:'Schlafen',fr:'Sommeil',es:'Dormir',no:'Sove',sv:'Sova',it:'Sonno'},
  away: {nl:'Afwezig',en:'Away',de:'Abwesend',fr:'Absent',es:'Ausente',no:'Borte',sv:'Borta',it:'Assente'},
  vacation: {nl:'Vakantie',en:'Vacation',de:'Urlaub',fr:'Vacances',es:'Vacaciones',no:'Ferie',sv:'Semester',it:'Vacanza'},
  home_tv: {nl:'TV kijken',en:'Watch TV',de:'Fernsehen',fr:'Regarder la TV',es:'Ver TV'},
  home_romantic: {nl:'Romantisch',en:'Romantic',de:'Romantisch',fr:'Romantique',es:'Romántico'},
  home_game: {nl:'Game',en:'Game',de:'Gaming',fr:'Jeu',es:'Juego'},
  home_movie: {nl:'Film kijken',en:'Watch movie',de:'Film ansehen',fr:'Regarder un film',es:'Ver película'}
};
function localizedModeLabel(id, label){
  const labels=STANDARD_MODE_LABELS[id];
  if(!labels) return label;
  const current=String(label||'').trim();
  const isStandard=!current || Object.values(labels).some(value=>value===current);
  return isStandard ? (labels[APP_LANG]||labels.en||current) : current;
}
function localizeConfiguredModeLabels(){
  if(!config) return;
  if(Array.isArray(config.subModes)) config.subModes=config.subModes.map(item=>({...item,label:localizedModeLabel(item.id,item.label)}));
  if(Array.isArray(config.modes)) config.modes=config.modes.map(item=>({...item,label:localizedModeLabel(item.id,item.label)}));
}

let config;
let modeSwitchDeviceRulesDraft = {};
let environment = { zones: [], switchableDevices: [], switchTargets: [], lightDevices: [], motionDevices: [], contactDevices: [], luminanceDevices: [], presenceDevices: [], homeyUsers: [], nativePresenceUsers: [], sleepCandidateDevices: [], powerDevices: [], powerTargets: [], energyTargets: [], temperatureSensorDevices: [] };
function switchTargets(){ return Array.isArray(environment.switchTargets) && environment.switchTargets.length ? environment.switchTargets : (environment.switchableDevices||[]); }
function powerTargets(){ return Array.isArray(environment.powerTargets) && environment.powerTargets.length ? environment.powerTargets : (Array.isArray(environment.powerEndpoints)&&environment.powerEndpoints.length?environment.powerEndpoints:(environment.powerDevices||[])); }
function lightTargets(){ return (environment.lightDevices||[]).filter(d=>Array.isArray(d.capabilities)&&(d.class==='light'||d.capabilities.some(c=>['dim','light_temperature','light_hue','light_saturation','light_mode'].includes(c)))).map(d=>({id:d.id,name:d.name||d.id,capabilities:d.capabilities||[]})); }
function ordinarySwitchTargets(existingIds=[]){ const keep=new Set(Array.isArray(existingIds)?existingIds.filter(Boolean):[]); const advancedIds=new Set((environment.lightDevices||[]).filter(d=>Array.isArray(d.capabilities)&&d.capabilities.some(c=>['dim','light_temperature','light_hue','light_saturation','light_mode'].includes(c))).map(d=>d.id)); return switchTargets().filter(t=>{ const deviceId=t.deviceId||String(t.id||'').split('::')[0]; return !advancedIds.has(deviceId)||keep.has(t.id)||keep.has(deviceId); }); }
function lightById(id){ return (environment.lightDevices||[]).find(d=>d.id===id)||null; }
function rgbToHsv(hex){ const m=String(hex||'#ffffff').replace('#',''); const r=parseInt(m.slice(0,2),16)/255,g=parseInt(m.slice(2,4),16)/255,b=parseInt(m.slice(4,6),16)/255; const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min; let h=0;if(d){if(max===r)h=((g-b)/d)%6;else if(max===g)h=(b-r)/d+2;else h=(r-g)/d+4;h/=6;if(h<0)h+=1;} return {h,s:max===0?0:d/max,v:max}; }
function hsvToHex(h,s,v=1){ h=((Number(h)||0)%1+1)%1;s=Math.max(0,Math.min(1,Number(s)||0));v=Math.max(0,Math.min(1,Number(v)||1));const i=Math.floor(h*6),f=h*6-i,p=v*(1-s),q=v*(1-f*s),t=v*(1-(1-f)*s);const a=[[v,t,p],[q,v,p],[p,v,t],[p,q,v],[t,p,v],[v,p,q]][i%6];return '#'+a.map(x=>Math.round(x*255).toString(16).padStart(2,'0')).join(''); }
function energyTargets(){ return Array.isArray(environment.energyTargets) && environment.energyTargets.length ? environment.energyTargets : (Array.isArray(environment.energyEndpoints)&&environment.energyEndpoints.length?environment.energyEndpoints:powerTargets()); }
const openModeIds = new Set();
const openZoneIds = new Set();
const openTempIds = new Set();
const openApplianceIds = new Set();
const openActivityIds = new Set();
const openActivityConditionIds = new Set();
const openScheduleIds = new Set();
const DAY_NAMES = { nl:['Zo','Ma','Di','Wo','Do','Vr','Za'], en:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], de:['So','Mo','Di','Mi','Do','Fr','Sa'], fr:['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'], es:['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'] };
const DAYS = [1,2,3,4,5,6,0].map(id => ({ id, name: (DAY_NAMES[APP_LANG] || DAY_NAMES.en)[id] }));
function el(tag, attrs = {}, children = []) { const n=document.createElement(tag); for(const [k,v] of Object.entries(attrs)){ if(k==='class') n.className=v; else if(k==='text') n.textContent=v; else n.setAttribute(k,v); } for(const c of children) n.appendChild(c); return n; }
function showToast(m,t='ok'){ const x=document.getElementById('toast'); x.textContent=m; x.className=`toast show ${t}`; clearTimeout(showToast._t); showToast._t=setTimeout(()=>x.className='toast',3500); }
function optionLabel(d){ return `${d.name}${d.zoneName?' - '+d.zoneName:''}`; }
function buildSelect(options, selected, multiple=true){ const s=el('select', multiple?{multiple:'multiple'}:{}); const set=new Set((selected||[]).map(String)); if(!multiple) s.appendChild(el('option',{value:'',text:tt('Kies...', 'Choose...')})); for(const item of options||[]){ const o=el('option',{value:item.id,text:item.zoneName?optionLabel(item):(item.name||item.id)}); if(set.has(String(item.id))) o.selected=true; s.appendChild(o); } return s; }
function selectedValues(s){ if(!s || !s.selectedOptions) return []; return Array.from(s.selectedOptions).map(o=>o.value).filter(Boolean); }
function checkbox(field, checked, label){ const i=el('input',{type:'checkbox','data-field':field}); i.checked=!!checked; return el('label',{class:'check'},[i,document.createTextNode(label)]); }
function fieldBlock(label,input,hint){ return el('div',{class:'field'},[el('label',{text:label}),input,el('div',{class:'hint',text:hint||''})]); }
function setFieldVisible(scope, field, visible){ const node=scope?.querySelector?.(`[data-field="${field}"]`); if(!node) return; const wrap=node.closest('.field')||node.closest('.check')||node.parentElement; if(wrap) wrap.classList.toggle('is-hidden',!visible); }
function isChecked(scope, field){ const node=scope?.querySelector?.(`[data-field="${field}"]`); return !!(node&&node.checked); }
function fieldValue(scope, field){ const node=scope?.querySelector?.(`[data-field="${field}"]`); return node?node.value:''; }
function addOptionNote(card, key, text){ if(card.querySelector(`[data-option-note="${key}"]`)) return; const body=card.querySelector('.fold-body')||card; const note=el('div',{class:'option-note','data-option-note':key,text}); body.insertBefore(note, body.firstChild); }
function applyConditionalVisibility(){
  document.querySelectorAll('#zoneRules [data-id]').forEach(card=>{ const usesMotion=isChecked(card,'turnOnOnMotion')||isChecked(card,'turnOffAfterNoMotion'); const usesContact=isChecked(card,'turnOnOnContact')||isChecked(card,'turnOffWhenContactClosed')||isChecked(card,'invertContactLogic'); setFieldVisible(card,'motionDeviceIds',usesMotion); setFieldVisible(card,'noMotionSeconds',isChecked(card,'turnOffAfterNoMotion')); setFieldVisible(card,'contactDeviceIds',usesContact); setFieldVisible(card,'timeFrom',isChecked(card,'timeEnabled')); setFieldVisible(card,'timeTo',isChecked(card,'timeEnabled')); setFieldVisible(card,'luxDeviceIds',isChecked(card,'onlyIfDark')); setFieldVisible(card,'luxBelow',isChecked(card,'onlyIfDark')); });
  document.querySelectorAll('#temperatureRules [data-id]').forEach(card=>{ const wm=fieldValue(card,'windowMode'); const smart=isChecked(card,'smartWeatherEnabled'); setFieldVisible(card,'windowTemperature',wm==='setback'); setFieldVisible(card,'contactDeviceIds',wm!=='ignore'); const liveWrap=card.querySelector('[data-field-wrap="liveWindowContact"]'); if(liveWrap) liveWrap.style.display=wm!=='ignore'?'':'none'; ['weatherDeviceId','weatherColdBelow','weatherColdBoost','weatherWarmAbove','weatherWarmReduce','weatherMinTarget','weatherMaxTarget'].forEach(f=>setFieldVisible(card,f,smart)); });
  document.querySelectorAll('#applianceRules [data-id]').forEach(card=>{ const rm=fieldValue(card,'resetMode'); setFieldVisible(card,'resetAfterReadySeconds',rm==='timer'); setFieldVisible(card,'resetMotionDeviceIds',rm==='activity'); setFieldVisible(card,'resetContactDeviceIds',rm==='activity'); setFieldVisible(card,'readyReminderSeconds',isChecked(card,'repeatReadyNotification')); });
  document.querySelectorAll('.activity-condition').forEach(row=>{ const tp=fieldValue(row,'conditionType'); const isTime=tp==='time_between'||tp==='time_after'||tp==='time_before'; const isTrend=tp==='temperature_rising'||tp==='temperature_falling'||tp==='humidity_rising'||tp==='humidity_falling'; setFieldVisible(row,'conditionDeviceId',!isTime); setFieldVisible(row,'conditionCapabilityId',!isTime); setFieldVisible(row,'conditionOperator',!isTime); setFieldVisible(row,'conditionThreshold',!isTime && tp!=='device_on' && tp!=='sensor_true' && tp!=='capability_equals' && tp!=='capability_custom'); setFieldVisible(row,'conditionValue',!isTime && (tp==='device_on'||tp==='sensor_true'||tp==='capability_equals'||tp==='capability_custom')); setFieldVisible(row,'conditionStartTime',isTime && (tp==='time_between'||tp==='time_after')); setFieldVisible(row,'conditionEndTime',isTime && (tp==='time_between'||tp==='time_before')); setFieldVisible(row,'conditionDelta',isTrend); setFieldVisible(row,'conditionWindowSeconds',isTrend); });
  document.querySelectorAll('#scheduleRules [data-id]').forEach(card=>{
    const tm=fieldValue(card,'timeMode');
    const lux=isChecked(card,'luxCondition');
    const action=fieldValue(card,'action')||'on';
    const canAutoOff=action==='on';
    const canAutoOn=action==='off';
    const offEnabled=canAutoOff && isChecked(card,'autoOffEnabled');
    const offMode=fieldValue(card,'autoOffMode')||'hours';
    const onEnabled=canAutoOn && isChecked(card,'autoOnEnabled');
    const onMode=fieldValue(card,'autoOnMode')||'hours';

    setFieldVisible(card,'fixedTime',tm==='fixed');
    setFieldVisible(card,'randomFrom',tm==='random');
    setFieldVisible(card,'randomTo',tm==='random');
    setFieldVisible(card,'sunOffsetMinutes',tm==='sunrise'||tm==='sunset');

    ['zoneId','includeSubzones','luxDeviceIds','luxOperator','luxThreshold'].forEach(f=>setFieldVisible(card,f,lux));

    // Follow-up fields are action-aware:
    // - When the schedule switches ON, only show automatic OFF settings.
    // - When the schedule switches OFF, only show automatic ON settings.
    setFieldVisible(card,'autoOffEnabled',canAutoOff);
    setFieldVisible(card,'autoOffMode',offEnabled);
    setFieldVisible(card,'autoOffAfterHours',offEnabled&&offMode==='hours');
    setFieldVisible(card,'autoOffTime',offEnabled&&offMode==='time');
    setFieldVisible(card,'autoOffRandomFromHours',offEnabled&&offMode==='random_hours');
    setFieldVisible(card,'autoOffRandomToHours',offEnabled&&offMode==='random_hours');
    setFieldVisible(card,'autoOffRandomFromTime',offEnabled&&offMode==='random_time');
    setFieldVisible(card,'autoOffRandomToTime',offEnabled&&offMode==='random_time');

    setFieldVisible(card,'autoOnEnabled',canAutoOn);
    setFieldVisible(card,'autoOnMode',onEnabled);
    setFieldVisible(card,'autoOnAfterHours',onEnabled&&onMode==='hours');
    setFieldVisible(card,'autoOnTime',onEnabled&&onMode==='time');
    setFieldVisible(card,'autoOnRandomFromHours',onEnabled&&onMode==='random_hours');
    setFieldVisible(card,'autoOnRandomToHours',onEnabled&&onMode==='random_hours');
    setFieldVisible(card,'autoOnRandomFromTime',onEnabled&&onMode==='random_time');
    setFieldVisible(card,'autoOnRandomToTime',onEnabled&&onMode==='random_time');
  });
  const auto=document.getElementById('autoMode'); if(auto){ const src=fieldValue(auto,'presenceSource'); const sleep=isChecked(auto,'enableSleepMode'); setFieldVisible(auto,'homeyUserIds',src==='homey'||src==='both'); setFieldVisible(auto,'presenceDeviceIds',src==='devices'||src==='both'); setFieldVisible(auto,'sleepMotionDeviceIds',sleep); setFieldVisible(auto,'sleepContactDeviceIds',sleep); setFieldVisible(auto,'sleepPowerRules',sleep); }
}


function normalizeUiActionSet(set){ return { on:Array.isArray(set&&set.on)?set.on:[], off:Array.isArray(set&&set.off)?set.off:[] }; }
function getModeSwitchDeviceRule(deviceId){
  config.modeSwitchDeviceRules=config.modeSwitchDeviceRules||{};
  if(!config.modeSwitchDeviceRules[deviceId]) config.modeSwitchDeviceRules[deviceId]={enabled:true,listRules:{},switchRules:{}};
  const rule=config.modeSwitchDeviceRules[deviceId];
  rule.listRules=rule.listRules||{}; rule.switchRules=rule.switchRules||{};
  return rule;
}
function renderModeSwitchDeviceRules(){
  const box=document.getElementById('modeSwitchDeviceRules'); if(!box) return;
  const devices=Array.isArray(config.modeSwitchDevices)?config.modeSwitchDevices:[];
  const tabBtn=document.getElementById('modeSwitchDevicesTabBtn');
  if(tabBtn) tabBtn.style.display = devices.length ? '' : 'none';
  config.modeSwitchDeviceRules=config.modeSwitchDeviceRules||{};
  box.innerHTML='';
  if(!devices.length){ box.appendChild(el('div',{class:'card'},[el('p',{class:'hint',text:tt('Nog geen Mode & Switch devices gevonden. Maak eerst zo’n device aan in Homey en klik daarna op Devices verversen.','No Mode & Switch devices found yet. First create one in Homey, then click Refresh devices.')})])); return; }
  for(const device of devices){
    const rule=getModeSwitchDeviceRule(device.id);
    const children=[];
    children.push(el('p',{class:'hint',text:tt('De standaardlijst kies je via de configuratie van het Mode & Switch-device. Hier stel je alleen de acties per lijst/modus en knop in.','Choose the default list in the Mode & Switch device configuration. Here you only configure actions per list/mode and switch.')}));
    children.push(checkbox('msdEnabled',rule.enabled!==false,tt('Acties voor dit device actief','Actions for this device enabled')));
    if(Array.isArray(device.lists) && device.lists.length){
      children.push(el('h3',{text:tt('Lijsten / modussen','Lists / modes')}));
      for(const list of device.lists){
        const listWrap=el('details',{class:'card',style:'padding:12px;margin:10px 0'});
        listWrap.open=false;
        listWrap.appendChild(el('summary',{text:`${list.name} (${(list.buttons||[]).length} ${tt('opties','options')})`}));
        const modes=list.buttons||[];
        if(!modes.length) listWrap.appendChild(el('p',{class:'hint',text:tt('Deze lijst heeft nog geen opties.','This list has no options yet.')}));
        for(const mode of modes){
          const actions=normalizeUiActionSet(rule.listRules?.[list.id]?.[mode.id]);
          const on=buildSelect(switchTargets(),actions.on); on.dataset.msdDevice=device.id; on.dataset.msdKind='list'; on.dataset.msdList=list.id; on.dataset.msdMode=mode.id; on.dataset.msdTarget='on';
          const off=buildSelect(switchTargets(),actions.off); off.dataset.msdDevice=device.id; off.dataset.msdKind='list'; off.dataset.msdList=list.id; off.dataset.msdMode=mode.id; off.dataset.msdTarget='off';
          listWrap.appendChild(el('div',{class:'card',style:'padding:12px;margin:10px 0'},[
            el('strong',{text:`${tt('Als','When')} ${mode.name} ${tt('actief wordt','becomes active')}`}),
            el('div',{class:'two'},[fieldBlock(tt('Apparaten aan','Devices on'),on),fieldBlock(tt('Apparaten uit','Devices off'),off)])
          ]));
        }
        children.push(listWrap);
      }
    }
    if(Array.isArray(device.switches) && device.switches.length){
      children.push(el('h3',{text:tt('Aan/uit-knoppen','On/off switches')}));
      for(const sw of device.switches){
        const states=rule.switchRules?.[sw.id]||{};
        const onActions=normalizeUiActionSet(states.on); const offActions=normalizeUiActionSet(states.off);
        const onOn=buildSelect(switchTargets(),onActions.on); onOn.dataset.msdDevice=device.id; onOn.dataset.msdKind='switch'; onOn.dataset.msdSwitch=sw.id; onOn.dataset.msdState='on'; onOn.dataset.msdTarget='on';
        const onOff=buildSelect(switchTargets(),onActions.off); onOff.dataset.msdDevice=device.id; onOff.dataset.msdKind='switch'; onOff.dataset.msdSwitch=sw.id; onOff.dataset.msdState='on'; onOff.dataset.msdTarget='off';
        const offOn=buildSelect(switchTargets(),offActions.on); offOn.dataset.msdDevice=device.id; offOn.dataset.msdKind='switch'; offOn.dataset.msdSwitch=sw.id; offOn.dataset.msdState='off'; offOn.dataset.msdTarget='on';
        const offOff=buildSelect(switchTargets(),offActions.off); offOff.dataset.msdDevice=device.id; offOff.dataset.msdKind='switch'; offOff.dataset.msdSwitch=sw.id; offOff.dataset.msdState='off'; offOff.dataset.msdTarget='off';
        children.push(el('details',{class:'card',style:'padding:12px;margin:10px 0'},[
          el('summary',{text:sw.name}),
          el('strong',{text:tt('Als knop AAN gaat','When the switch turns ON')}), el('div',{class:'two'},[fieldBlock(tt('Apparaten aan','Devices on'),onOn),fieldBlock(tt('Apparaten uit','Devices off'),onOff)]),
          el('strong',{text:tt('Als knop UIT gaat','When the switch turns OFF')}), el('div',{class:'two'},[fieldBlock(tt('Apparaten aan','Devices on'),offOn),fieldBlock(tt('Apparaten uit','Devices off'),offOff)])
        ]));
      }
    }
    box.appendChild(foldCard('msd-'+device.id,device.name,`${(device.lists||[]).length} ${tt('lijsten','lists')}, ${(device.switches||[]).length} ${tt('knoppen','switches')}`,new Set([...(devices.length===1?['msd-'+device.id]:[])]),children));
  }
}
function collectModeSwitchDeviceRules(){
  if(!config) return {};
  config.modeSwitchDeviceRules=config.modeSwitchDeviceRules||{};
  const box=document.getElementById('modeSwitchDeviceRules'); if(!box) return config.modeSwitchDeviceRules;
  (config.modeSwitchDevices||[]).forEach(d=>{ getModeSwitchDeviceRule(d.id); });
  box.querySelectorAll('[data-field="msdEnabled"]').forEach(cb=>{
    const card=cb.closest('[data-id]'); if(!card) return;
    const id=String(card.dataset.id||'').replace(/^msd-/,'');
    getModeSwitchDeviceRule(id).enabled=cb.checked===true;
  });
  box.querySelectorAll('select[data-msd-device]').forEach(sel=>{
    const deviceId=sel.dataset.msdDevice; const rule=getModeSwitchDeviceRule(deviceId);
    if(sel.dataset.msdKind==='list'){
      const listId=sel.dataset.msdList, modeId=sel.dataset.msdMode, target=sel.dataset.msdTarget;
      rule.listRules[listId]=rule.listRules[listId]||{}; rule.listRules[listId][modeId]=rule.listRules[listId][modeId]||{on:[],off:[]};
      rule.listRules[listId][modeId][target]=selectedValues(sel);
    } else if(sel.dataset.msdKind==='switch'){
      const switchId=sel.dataset.msdSwitch, state=sel.dataset.msdState, target=sel.dataset.msdTarget;
      rule.switchRules[switchId]=rule.switchRules[switchId]||{on:{on:[],off:[]},off:{on:[],off:[]}};
      rule.switchRules[switchId][state]=rule.switchRules[switchId][state]||{on:[],off:[]};
      rule.switchRules[switchId][state][target]=selectedValues(sel);
    }
  });
  return config.modeSwitchDeviceRules;
}


function renderMainModeNames(){
  const box=document.getElementById('mainModeNames'); if(!box) return;
  const defaults={home:tt('Thuis','Home'),sleep:tt('Slapen','Sleep'),away:tt('Afwezig','Away'),vacation:tt('Vakantie','Vacation')};
  config.mainModeLabels=config.mainModeLabels||{};
  box.innerHTML='';
  ['home','sleep','away','vacation'].forEach(id=>{
    const input=el('input',{value:config.mainModeLabels[id]||defaults[id],'data-main-mode-id':id,maxlength:'40'});
    box.appendChild(fieldBlock(`${defaults[id]} (${id})`,input,tt('Alleen de naam verandert; de ID blijft gelijk.','Only the name changes; the ID stays the same.')));
  });
}
function collectMainModeNames(){
  config.mainModeLabels=config.mainModeLabels||{};
  document.querySelectorAll('[data-main-mode-id]').forEach(input=>{
    config.mainModeLabels[input.dataset.mainModeId]=String(input.value||'').trim();
  });
  return config.mainModeLabels;
}

const openSubModeIds=new Set();
function renderSubModes(){
  const box=document.getElementById('subModeList');
  if(!box) return;
  config.subModes=(Array.isArray(config.subModes)?config.subModes:[]).map(s=>({...s,icon:s.icon||'',accentColor:s.accentColor||'#60a5fa',imageUrl:s.imageUrl||''}));
  const subModes=config.subModes;
  box.innerHTML='';
  if(!subModes.length){ box.appendChild(el('p',{class:'hint',text:tt('Nog geen submodussen ingesteld.','No sub modes configured yet.')})); return; }
  subModes.forEach((sub,i)=>{
    const mainModes=(config.modes||[]).filter(m=>!m.parentMode).map(m=>({id:m.id,name:m.label}));
    const parent=buildSelect(mainModes,[sub.parentMode||'home'],false); parent.dataset.field='subParent';
    const label=el('input',{value:sub.label||'',placeholder:tt('Naam submodus','Sub mode name'),'data-field':'subLabel'});
    const id=el('input',{value:sub.id||'',placeholder:'id',disabled:true,'data-field':'subId'});
    const icon=el('input',{value:sub.icon||'',placeholder:'🎬','data-field':'subIcon'});
    const accent=el('input',{type:'color',value:sub.accentColor||'#60a5fa','data-field':'subAccentColor'});
    const imageUrl=el('input',{value:sub.imageUrl||'',placeholder:'https://...','data-field':'subImageUrl'});
    const preview=el('div',{class:'theme-preview'});
    const previewLabel=el('span',{text:`${sub.icon||'•'} ${sub.label||tt('Submodus','Sub mode')}`});
    preview.appendChild(previewLabel);
    preview.style.background = `${sub.imageUrl ? `linear-gradient(145deg,rgba(0,0,0,.20),rgba(0,0,0,.45)), url("${String(sub.imageUrl).replace(/"/g,'%22')}")` : `linear-gradient(145deg,${sub.accentColor||'#60a5fa'},rgba(255,255,255,.08))`}`;
    accent.addEventListener('input',()=>{ preview.style.background=`linear-gradient(145deg,${accent.value},rgba(255,255,255,.08))`; });
    imageUrl.addEventListener('input',()=>{ preview.style.background=imageUrl.value?`linear-gradient(145deg,rgba(0,0,0,.20),rgba(0,0,0,.45)), url("${String(imageUrl.value).replace(/"/g,'%22')}")`:`linear-gradient(145deg,${accent.value},rgba(255,255,255,.08))`; });

    const autoEnabled=checkbox('subAutoEnabled',sub.autoEnabled===true,tt('Automatisch activeren via stroommeting','Automatically activate by power measurement'));
    const autoDevice=buildSelect(powerTargets(),[sub.autoDeviceId||''],false); autoDevice.dataset.field='subAutoDeviceId';
    const autoOperator=buildSelect([{id:'above',name:tt('boven','above')},{id:'below',name:tt('onder','below')}],[sub.autoOperator||'above'],false); autoOperator.dataset.field='subAutoOperator';
    const autoWatt=el('input',{type:'number',min:'0',max:'5000',step:'1',value:String(sub.autoWatt??50),'data-field':'subAutoWatt'});
    const autoDelay=el('input',{type:'number',min:'0',max:'3600',step:'5',value:String(sub.autoDelaySeconds??10),'data-field':'subAutoDelaySeconds'});
    const autoReturnEnabled=checkbox('subAutoReturnEnabled',sub.autoReturnEnabled===true,tt('Automatisch terug naar hoofdmodus','Automatically return to main mode'));
    const autoReturnOperator=buildSelect([{id:'below',name:tt('onder','below')},{id:'above',name:tt('boven','above')}],[sub.autoReturnOperator||'below'],false); autoReturnOperator.dataset.field='subAutoReturnOperator';
    const autoReturnWatt=el('input',{type:'number',min:'0',max:'5000',step:'1',value:String(sub.autoReturnWatt??15),'data-field':'subAutoReturnWatt'});
    const autoReturnDelay=el('input',{type:'number',min:'0',max:'86400',step:'5',value:String(sub.autoReturnDelaySeconds??300),'data-field':'subAutoReturnDelaySeconds'});
    const remove=el('button',{class:'btn-danger',type:'button',text:tt('Verwijderen','Delete')});

    const themeBox=el('section',{class:'theme-box'},[
      el('h3',{text:tt('Widget styling','Widget styling')}), preview,
      el('div',{class:'two'},[
        fieldBlock(tt('Icoon / emoji','Icon / emoji'),icon,tt('Bijvoorbeeld 🎬, 🎮 of ♥.','For example 🎬, 🎮 or ♥.')),
        fieldBlock(tt('Accentkleur','Accent color'),accent,tt('Kleur voor glow en actieve knoppen.','Color for glow and active buttons.'))
      ]),
      fieldBlock(tt('Achtergrond afbeelding URL','Background image URL'),imageUrl,tt('Plak een directe afbeeldingslink. Leeg = gradient op basis van accentkleur.','Paste a direct image link. Empty = gradient based on accent color.'))
    ]);

    const autoFields=el('section',{class:'submode-option-section'},[
      el('div',{class:'two'},[
        fieldBlock(tt('Stopcontact / apparaat','Smart plug / device'),autoDevice,tt('Kies een apparaat met stroommeting (measure_power).','Choose a device with power measurement (measure_power).')),
        fieldBlock(tt('Voorwaarde','Condition'),autoOperator)
      ]),
      el('div',{class:'two'},[fieldBlock(tt('Wattwaarde','Watt value'),autoWatt),fieldBlock(tt('Vertraging sec.','Delay sec.'),autoDelay)]),
      autoReturnEnabled
    ]);
    const returnFields=el('section',{class:'submode-option-section'},[
      el('div',{class:'two'},[
        fieldBlock(tt('Terug als waarde','Return when value'),autoReturnOperator),
        fieldBlock(tt('Terugkeer wattwaarde','Return watt value'),autoReturnWatt)
      ]),
      fieldBlock(tt('Terugkeer vertraging sec.','Return delay sec.'),autoReturnDelay),
      el('p',{class:'hint',text:tt('Voorbeeld: TV kijken activeert boven 40W en keert terug naar Thuis als het stopcontact 5 minuten onder 15W blijft.','Example: Watching TV activates above 40W and returns to Home when the smart plug stays below 15W for 5 minutes.')})
    ]);
    const autoEnabledInput=autoEnabled.querySelector('input[type="checkbox"]');
    const autoReturnEnabledInput=autoReturnEnabled.querySelector('input[type="checkbox"]');
    function updateVisibility(){
      const enabled=autoEnabledInput?.checked===true;
      const returnEnabled=autoReturnEnabledInput?.checked===true;
      autoFields.classList.toggle('is-hidden',!enabled);
      returnFields.classList.toggle('is-hidden',!enabled || !returnEnabled);
    }
    autoEnabledInput?.addEventListener('change',updateVisibility);
    autoReturnEnabledInput?.addEventListener('change',updateVisibility);

    const parentName=mainModes.find(m=>m.id===(sub.parentMode||'home'))?.name||sub.parentMode||'home';
    const summaryTitle=el('span',{class:'submode-summary-title',text:`${sub.icon||'•'} ${sub.label||tt('Submodus','Sub mode')}`});
    const summaryMeta=el('span',{class:'submode-summary-meta',text:`${tt('Actief onder','Active under')} ${parentName}`});
    const statusBadge=el('span',{class:`submode-status ${sub.autoEnabled?'is-auto':''}`,text:sub.autoEnabled?tt('Automatisch','Automatic'):tt('Handmatig','Manual')});
    const details=el('details',{class:'card submode-card','data-id':sub.id});
    if(openSubModeIds.has(sub.id)) details.open=true;
    const summary=el('summary',{},[
      el('div',{class:'submode-summary-main'},[summaryTitle,summaryMeta]),
      el('div',{class:'submode-summary-side'},[statusBadge,el('span',{class:'submode-chevron',text:'⌄'})])
    ]);
    const body=el('div',{class:'submode-body'},[
      el('div',{class:'two'},[fieldBlock(tt('Hoofdmodus','Main mode'),parent),fieldBlock(tt('Naam','Name'),label)]),
      fieldBlock('ID',id,tt('De ID blijft gelijk zodat bestaande regels blijven werken.','The ID stays the same so existing rules keep working.')),
      themeBox,
      el('h3',{text:tt('Automatische submodus','Automatic sub mode')}),
      autoEnabled,
      autoFields,
      returnFields,
      remove
    ]);
    details.append(summary,body);
    details.addEventListener('toggle',()=>{ if(details.open) openSubModeIds.add(sub.id); else openSubModeIds.delete(sub.id); });
    remove.addEventListener('click',()=>{ collectSubModes(); config.subModes.splice(i,1); openSubModeIds.delete(sub.id); renderSubModes(); renderModes(); renderModeSwitchDeviceRules(); });
    label.addEventListener('input',()=>{ previewLabel.textContent=`${icon.value||'•'} ${label.value||tt('Submodus','Sub mode')}`; summaryTitle.textContent=`${icon.value||'•'} ${label.value||tt('Submodus','Sub mode')}`; });
    icon.addEventListener('input',()=>{ previewLabel.textContent=`${icon.value||'•'} ${label.value||tt('Submodus','Sub mode')}`; summaryTitle.textContent=`${icon.value||'•'} ${label.value||tt('Submodus','Sub mode')}`; });
    parent.addEventListener('change',()=>{ const name=mainModes.find(m=>m.id===parent.value)?.name||parent.value; summaryMeta.textContent=`${tt('Actief onder','Active under')} ${name}`; });
    autoEnabledInput?.addEventListener('change',()=>{ const enabled=autoEnabledInput.checked===true; statusBadge.textContent=enabled?tt('Automatisch','Automatic'):tt('Handmatig','Manual'); statusBadge.classList.toggle('is-auto',enabled); });
    updateVisibility();
    box.appendChild(details);
  });
}
function makeSubModeId(parent,label){ return String(parent||'home').toLowerCase().replace(/[^a-z0-9_]+/g,'_')+'_'+String(label||'submodus').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,''); }
function collectSubModes(){
  const box=document.getElementById('subModeList');
  if(!box) return config.subModes||[];
  const cards=Array.from(box.querySelectorAll('.submode-card'));
  config.subModes=cards.map(card=>{
    const parent=card.querySelector('[data-field="subParent"]')?.value||'home';
    const label=(card.querySelector('[data-field="subLabel"]')?.value||'').trim();
    const existing=(card.querySelector('[data-field="subId"]')?.value||'').trim();
    return {
      id:existing||makeSubModeId(parent,label),
      parentMode:parent,
      label,
      icon:card.querySelector('[data-field="subIcon"]')?.value||'',
      accentColor:card.querySelector('[data-field="subAccentColor"]')?.value||'#60a5fa',
      imageUrl:card.querySelector('[data-field="subImageUrl"]')?.value||'',
      autoEnabled:card.querySelector('[data-field="subAutoEnabled"]')?.checked===true,
      autoDeviceId:card.querySelector('[data-field="subAutoDeviceId"]')?.value||'',
      autoOperator:card.querySelector('[data-field="subAutoOperator"]')?.value||'above',
      autoWatt:Number(card.querySelector('[data-field="subAutoWatt"]')?.value||50),
      autoDelaySeconds:Number(card.querySelector('[data-field="subAutoDelaySeconds"]')?.value||10),
      autoReturnEnabled:card.querySelector('[data-field="subAutoReturnEnabled"]')?.checked===true,
      autoReturnOperator:card.querySelector('[data-field="subAutoReturnOperator"]')?.value||'below',
      autoReturnWatt:Number(card.querySelector('[data-field="subAutoReturnWatt"]')?.value||15),
      autoReturnDelaySeconds:Number(card.querySelector('[data-field="subAutoReturnDelaySeconds"]')?.value||300)
    };
  }).filter(s=>s.label);
  return config.subModes;
}
function addSubMode(){
  collectSubModes();
  const parent='home';
  const label=tt('Nieuwe submodus','New sub mode');
  config.subModes=config.subModes||[];
  const newId=makeSubModeId(parent,label+' '+Date.now()); openSubModeIds.add(newId); config.subModes.push({id:newId,parentMode:parent,label,autoEnabled:false,autoDeviceId:'',autoOperator:'above',autoWatt:50,autoDelaySeconds:10,autoReturnEnabled:false,autoReturnOperator:'below',autoReturnWatt:15,autoReturnDelaySeconds:300,icon:'',accentColor:'#60a5fa',imageUrl:''});
  renderSubModes();
}

function getSelectedTemperatureDevice(){ const id=config?.displaySettings?.temperatureDeviceId||''; if(!id) return null; return (environment.temperatureSensorDevices||[]).find(d=>d.id===id)||null; }
function formatTemperatureValue(device){ const raw=device?.capabilityValues?.measure_temperature ?? device?.measureTemperature ?? device?.temperature; const n=Number(raw); if(!Number.isFinite(n)) return null; return (Math.round(n*10)/10).toLocaleString(({nl:'nl-NL',en:'en-US',de:'de-DE',fr:'fr-FR',es:'es-ES',no:'nb-NO',sv:'sv-SE',it:'it-IT'}[APP_LANG] || 'en-US'),{minimumFractionDigits: n%1===0?0:1, maximumFractionDigits:1})+'°C'; }
function updateCurrentMode(mode){ const cur=config.modes.find(x=>x.id===mode); const node=document.getElementById('currentMode'); node.textContent=`${tt('Huidige modus', 'Current mode')}: ${cur?cur.label:mode}`; const dev=getSelectedTemperatureDevice(); const value=dev?formatTemperatureValue(dev):null; if(value){ const badge=el('span',{class:'temperature-badge',title:dev.name,text:'🌡️ '+value}); node.appendChild(badge); } }
function tab(id){
  document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));
  ['modes','modeSwitchDevices','zones','temperature','appliances','activities','schedule','export','auto','keypads','debug'].forEach(t=>{ const panel=document.getElementById('tab-'+t); if(panel) panel.style.display=t===id?'':'none'; });
  const active=document.querySelector('.tab[data-tab="'+id+'"]');
  const current=document.getElementById('settingsMenuCurrent');
  if(current && active) current.textContent=active.textContent.trim();
  const nav=document.querySelector('.settings-nav');
  const toggle=document.getElementById('settingsMenuToggle');
  if(nav) nav.classList.remove('menu-open');
  if(toggle) toggle.setAttribute('aria-expanded','false');
  const more=document.querySelector('.more-menu');
  if(more && !more.contains(active)) more.open=false;
  updateContextAddFab(id);
  if(id==='debug') renderCrashLog();
}

function highlightAndScrollToItem(containerId, itemId){
  requestAnimationFrame(()=>{
    const item=document.querySelector(`#${containerId} [data-id="${CSS.escape(itemId)}"]`);
    if(!item) return;
    item.classList.add('new-item-highlight');
    item.scrollIntoView({behavior:'smooth',block:'center'});
    setTimeout(()=>item.classList.remove('new-item-highlight'),1800);
  });
}
function openCreateActivityModal(){
  ensureApplianceState();
  const modal=document.getElementById('createActivityModal');
  const type=document.getElementById('newActivityConditionType');
  const device=document.getElementById('newActivityDevice');
  const name=document.getElementById('newActivityName');
  if(!modal||!type||!device||!name) return;
  type.innerHTML='';
  activityConditionTypes().filter(x=>!['activity_status','time_between','time_after','time_before'].includes(x.id)).forEach(x=>type.appendChild(new Option(x.name,x.id)));
  device.innerHTML='';
  device.appendChild(new Option(tt('Kies een apparaat of sensor','Choose a device or sensor'),''));
  activityDeviceList().forEach(d=>device.appendChild(new Option(d.name||d.id,d.id)));
  name.value=''; type.value='power_above'; device.value='';
  document.getElementById('newActivityThreshold').value='10';
  updateCreateActivityFields();
  modal.classList.add('open');
  setTimeout(()=>name.focus(),80);
}
function closeCreateActivityModal(){ document.getElementById('createActivityModal')?.classList.remove('open'); }
function updateCreateActivityFields(){
  const t=document.getElementById('newActivityConditionType')?.value||'';
  const noThreshold=['device_on','sensor_true','capability_equals','capability_custom'].includes(t);
  const field=document.getElementById('newActivityThresholdField');
  if(field) field.style.display=noThreshold?'none':'';
}
async function confirmCreateActivity(){
  ensureApplianceState();
  const name=(document.getElementById('newActivityName')?.value||'').trim();
  const type=document.getElementById('newActivityConditionType')?.value||'power_above';
  const deviceId=document.getElementById('newActivityDevice')?.value||'';
  const threshold=Number(document.getElementById('newActivityThreshold')?.value||0);
  if(!name){ showToast(tt('Vul eerst een naam in.','Enter a name first.'),'error'); document.getElementById('newActivityName')?.focus(); return; }
  if(!deviceId){ showToast(tt('Kies eerst een apparaat of sensor.','Choose a device or sensor first.'),'error'); document.getElementById('newActivityDevice')?.focus(); return; }
  const dev=deviceByActivityId(deviceId);
  const now=Date.now();
  const r={id:'activity-'+now,name,enabled:true,minConditions:1,historyLimit:20,minHistoryDurationSeconds:0,conditions:[{id:'condition-'+now,type,deviceId,capabilityId:defaultCapabilityForActivityType(type,dev),threshold,operator:defaultActivityOperatorForType(type),requiredCondition:false,conditionRequired:false,requiredActiveSeconds:0,inactiveDelaySeconds:0,value:true}]};
  config.activityRules.push(r); openActivityIds.add(r.id); renderActivityRules(); closeCreateActivityModal();
  highlightAndScrollToItem('activityRules',r.id);
  showToast(tt('Activiteit toegevoegd en wordt opgeslagen...','Activity added and is being saved...'));
  try { await saveAll(); showToast(tt('Activiteit toegevoegd en opgeslagen.','Activity added and saved.')); }
  catch(e){ showToast((e&&e.message)||tt('Opslaan mislukt.','Saving failed.'),'error'); }
}


let pendingCreateType='';
function createModalField(label, node, hint=''){
  const wrap=el('div',{class:'field'},[el('label',{text:label}),node]);
  if(hint) wrap.appendChild(el('div',{class:'hint',text:hint}));
  return wrap;
}
function singleSelect(options, value=''){
  const select=buildSelect(options, value?[value]:[], false);
  if(value) select.value=value;
  return select;
}
function openCreateItemModal(type){
  pendingCreateType=type;
  const modal=document.getElementById('createItemModal');
  const fields=document.getElementById('createItemFields');
  const title=document.getElementById('createItemTitle');
  const description=document.getElementById('createItemDescription');
  const modalIcon=document.getElementById('createItemIcon');
  const hint=document.getElementById('createItemHint');
  const confirmButton=document.getElementById('confirmCreateItem');
  if(!modal||!fields||!title||!description) return;
  if(hint) hint.textContent=tt('Na het toevoegen kun je alle overige instellingen in het geopende item aanpassen.','After adding, you can adjust all remaining settings in the opened item.');
  if(confirmButton) confirmButton.textContent=tt('Toevoegen','Add');
  fields.innerHTML='';
  const name=el('input',{id:'createItemName',type:'text'});
  const row=el('div',{class:'two'});
  if(type==='modes'){
    title.textContent=tt('Nieuwe submodus','New sub mode');
    description.textContent=tt('Kies de hoofdmodus en geef de submodus een herkenbare naam.','Choose the main mode and enter a clear name for the sub mode.');
    if(modalIcon) modalIcon.textContent='◉';
    name.placeholder=tt('Bijvoorbeeld TV kijken','For example Watch TV');
    fields.appendChild(createModalField(tt('Naam','Name'),name));
    const parent=singleSelect((config.modes||[]).filter(m=>!String(m.id).includes(':')).map(m=>({id:m.id,name:localizedModeLabel(m.id,m.label)})), 'home'); parent.id='createItemParentMode';
    const icon=el('input',{id:'createItemIcon',type:'text',placeholder:'🎬'});
    row.append(createModalField(tt('Hoofdmodus','Main mode'),parent)); row.append(createModalField(tt('Icoon / emoji','Icon / emoji'),icon)); fields.appendChild(row);
  } else if(type==='zones'){
    title.textContent=tt('Nieuwe zoneregel','New zone rule');
    description.textContent=tt('Kies de zone en modus. De overige sensoren, lampen en voorwaarden stel je daarna in.','Choose the zone and mode. You can configure the remaining sensors, lights and conditions afterwards.');
    if(modalIcon) modalIcon.textContent='⌂';
    name.placeholder=tt('Bijvoorbeeld Verlichting woonkamer','For example Living room lights'); fields.appendChild(createModalField(tt('Naam','Name'),name));
    const zone=singleSelect(environment.zones||[]); zone.id='createItemZone'; const mode=singleSelect((config.modes||[]).map(m=>({id:m.id,name:m.label})),config.currentMode||config.modes?.[0]?.id||'home'); mode.id='createItemMode';
    row.append(createModalField(tt('Zone/kamer','Zone/room'),zone)); row.append(createModalField(tt('Modus','Mode'),mode)); fields.appendChild(row);
  } else if(type==='temperature'){
    title.textContent=tt('Nieuwe temperatuurregel','New temperature rule');
    description.textContent=tt('Kies de modus, zone en gewenste temperatuur voor deze regel.','Choose the mode, zone and desired temperature for this rule.');
    if(modalIcon) modalIcon.textContent='°';
    name.placeholder=tt('Bijvoorbeeld Woonkamer overdag','For example Living room daytime'); fields.appendChild(createModalField(tt('Naam','Name'),name));
    const zone=singleSelect(environment.zones||[]); zone.id='createItemZone'; const mode=buildSelect((config.modes||[]).map(m=>({id:m.id,name:m.label})),[config.currentMode||config.modes?.[0]?.id||'home']); mode.id='createItemModes';
    row.append(createModalField(tt('Zone/kamer','Zone/room'),zone)); row.append(createModalField(tt('Modussen','Modes'),mode,tt('Selecteer één of meerdere modussen.','Select one or more modes.'))); fields.appendChild(row);
    const temp=el('input',{id:'createItemTemperature',type:'number',min:'5',max:'35',step:'0.5',value:'20'}); fields.appendChild(createModalField(tt('Temperatuur','Temperature'),temp));
  } else if(type==='appliances'){
    title.textContent=tt('Nieuw apparaat','New appliance');
    description.textContent=tt('Kies het apparaat dat je wilt monitoren. De detectiewaarden kun je daarna verfijnen.','Choose the appliance you want to monitor. You can fine-tune the detection values afterwards.');
    if(modalIcon) modalIcon.textContent='⚡';
    name.placeholder=tt('Bijvoorbeeld Wasmachine','For example Washing machine'); fields.appendChild(createModalField(tt('Naam','Name'),name));
    const typeSel=el('select',{id:'createItemApplianceType'}); [['washing_machine',tt('Wasmachine','Washing machine')],['dryer',tt('Droger','Dryer')],['dishwasher',tt('Vaatwasser','Dishwasher')],['other',tt('Anders','Other')]].forEach(([v,l])=>typeSel.appendChild(el('option',{value:v,text:l})));
    const dev=singleSelect(powerTargets()); dev.id='createItemDevice'; row.append(createModalField(tt('Type','Type'),typeSel)); row.append(createModalField(tt('Apparaat','Appliance'),dev)); fields.appendChild(row);
  } else if(type==='schedule'){
    title.textContent=tt('Nieuwe planning','New schedule');
    description.textContent=tt('Geef de planning een naam en kies de eerste actie, het tijdstip en de apparaten.','Name the schedule and choose the first action, time and devices.');
    if(modalIcon) modalIcon.textContent='◷';
    name.placeholder=tt('Bijvoorbeeld Verlichting avond','For example Evening lights'); fields.appendChild(createModalField(tt('Naam','Name'),name));
    const action=el('select',{id:'createItemAction'},[el('option',{value:'on',text:tt('Aan','On')}),el('option',{value:'off',text:tt('Uit','Off')})]);
    const time=el('input',{id:'createItemTime',type:'time',value:'19:00'}); row.append(createModalField(tt('Actie','Action'),action)); row.append(createModalField(tt('Tijd','Time'),time)); fields.appendChild(row);
    const devices=buildSelect(ordinarySwitchTargets(),[]); devices.id='createItemDevices'; fields.appendChild(createModalField(tt('Apparaten/lampen','Devices/lights'),devices,tt('Je kunt meerdere apparaten selecteren.','You can select multiple devices.')));
  }
  modal.classList.add('open'); setTimeout(()=>name.focus(),80);
}
function closeCreateItemModal(){ document.getElementById('createItemModal')?.classList.remove('open'); pendingCreateType=''; }
async function confirmCreateItem(){
  const type=pendingCreateType; const name=(document.getElementById('createItemName')?.value||'').trim();
  if(!name){ showToast(tt('Vul eerst een naam in.','Enter a name first.'),'error'); document.getElementById('createItemName')?.focus(); return; }
  const now=Date.now(); let id='', container='';
  if(type==='modes'){ collectSubModes(); const parent=document.getElementById('createItemParentMode')?.value||'home'; id=makeSubModeId(parent,name+' '+now); openSubModeIds.add(id); config.subModes.push({id,parentMode:parent,label:name,autoEnabled:false,autoDeviceId:'',autoOperator:'above',autoWatt:50,autoDelaySeconds:10,autoReturnEnabled:false,autoReturnOperator:'below',autoReturnWatt:15,autoReturnDelaySeconds:300,icon:document.getElementById('createItemIcon')?.value||'',accentColor:'#60a5fa',imageUrl:''}); renderSubModes(); container='subModeList';
  } else if(type==='zones'){ const zoneId=document.getElementById('createItemZone')?.value||''; if(!zoneId){showToast(tt('Kies eerst een zone.','Choose a zone first.'),'error');return;} id='rule-'+now; const modeId=document.getElementById('createItemMode')?.value||config.currentMode||'home'; config.zoneRules.push({id,name,enabled:true,modeIds:[modeId],zoneId,includeSubzones:false,motionDeviceIds:[],contactDeviceIds:[],lightDeviceIds:[],turnOnOnMotion:true,turnOnOnContact:false,turnOffAfterNoMotion:true,turnOffWhenContactClosed:false,invertContactLogic:false,contactSequenceEnabled:false,contactSequenceEvent:'open',contactSequenceCount:2,contactSequenceResetSeconds:1800,contactSequenceResetOnModeChange:true,noMotionSeconds:180,dimValue:null,lightTemperature:null,lightColorEnabled:false,lightHue:0,lightSaturation:1,timeEnabled:false,timeFrom:'18:00',timeTo:'23:59',onlyIfLightsOff:false,onlyIfDark:false,luxDeviceIds:[],luxBelow:30}); openZoneIds.add(id); renderZoneRules(); container='zoneRules';
  } else if(type==='temperature'){ ensureTemperatureState(); const zoneId=document.getElementById('createItemZone')?.value||''; if(!zoneId){showToast(tt('Kies eerst een zone.','Choose a zone first.'),'error');return;} id='temp-'+now; config.temperatureRules.push({id,name,enabled:true,modeIds:selectedValues(document.getElementById('createItemModes')).length?selectedValues(document.getElementById('createItemModes')):[config.currentMode||'home'],zoneId,includeSubzones:false,thermostatDeviceIds:[],temperature:Number(document.getElementById('createItemTemperature')?.value||20),windowMode:'ignore',windowTemperature:15,liveWindowContact:false,contactDeviceIds:[],smartWeatherEnabled:false,weatherDeviceId:'',weatherColdBelow:5,weatherColdBoost:1,weatherWarmAbove:16,weatherWarmReduce:1,weatherMinTarget:5,weatherMaxTarget:25}); openTempIds.add(id); renderTemperatureRules(); container='temperatureRules';
  } else if(type==='appliances'){ ensureApplianceState(); const deviceId=document.getElementById('createItemDevice')?.value||''; if(!deviceId){showToast(tt('Kies eerst een apparaat.','Choose a device first.'),'error');return;} const applianceType=document.getElementById('createItemApplianceType')?.value||'washing_machine'; id='appliance-'+now; config.applianceRules.push({id,name,enabled:true,type:applianceType,deviceId,...defaultAppliance(applianceType),resetMode:'manual',resetAfterReadySeconds:0,resetMotionDeviceIds:[],resetContactDeviceIds:[],resetLightDeviceIds:[],resetZoneActivity:false,repeatReadyNotification:false,readyReminderSeconds:1800,notifyOnStart:false,notifyOnReady:true,useTimelineNotification:false}); openApplianceIds.add(id); renderApplianceRules(); container='applianceRules';
  } else if(type==='schedule'){ id='schedule-'+now; config.scheduleRules.push({id,name,enabled:true,modeIds:config.modes.map(m=>m.id),deviceIds:selectedValues(document.getElementById('createItemDevices')),action:document.getElementById('createItemAction')?.value||'on',timeMode:'fixed',fixedTime:document.getElementById('createItemTime')?.value||'19:00',randomFrom:'18:30',randomTo:'23:00',sunOffsetMinutes:0,autoOffEnabled:false,autoOffMode:'hours',autoOffAfterHours:1,autoOffTime:'23:00',autoOffRandomFromHours:0.5,autoOffRandomToHours:2,autoOffRandomFromTime:'22:00',autoOffRandomToTime:'23:30',autoOnEnabled:false,autoOnMode:'hours',autoOnAfterHours:1,autoOnTime:'07:00',autoOnRandomFromHours:0.5,autoOnRandomToHours:2,autoOnRandomFromTime:'06:30',autoOnRandomToTime:'08:00',zoneId:environment.zones?.[0]?.id||'',includeSubzones:true,luxCondition:false,luxDeviceIds:[],luxOperator:'below',luxThreshold:30,days:[0,1,2,3,4,5,6],lights:[]}); openScheduleIds.add(id); renderScheduleRules(); container='scheduleRules';
  }
  closeCreateItemModal();
  if(type==='modes'){
    const subModeList=document.getElementById('subModeList');
    const subModesPanel=subModeList?.closest('details');
    if(subModesPanel) subModesPanel.open=true;
  }
  if(container) highlightAndScrollToItem(container,id);
  showToast(tt('Toegevoegd en wordt opgeslagen...','Added and saving...'));
  try{ await saveAll(); showToast(tt('Toegevoegd en opgeslagen.','Added and saved.')); }catch(e){ showToast((e&&e.message)||tt('Opslaan mislukt.','Saving failed.'),'error'); }
}

function updateContextAddFab(id){
  const fab=document.getElementById('contextAddFab');
  if(!fab) return;
  const actions={
    modes:{label:tt('Nieuwe submodus','New sub mode'),run:()=>openCreateItemModal('modes')},
    zones:{label:tt('Nieuwe zoneregel','New zone rule'),run:()=>openCreateItemModal('zones')},
    temperature:{label:tt('Nieuwe temperatuurregel','New temperature rule'),run:()=>openCreateItemModal('temperature')},
    appliances:{label:tt('Nieuw apparaat','New appliance'),run:()=>openCreateItemModal('appliances')},
    activities:{label:tt('Nieuwe activiteit','New activity'),run:openCreateActivityModal},
    schedule:{label:tt('Nieuwe planning','New schedule'),run:()=>openCreateItemModal('schedule')}
  };
  const action=actions[id];
  fab.classList.toggle('is-visible',Boolean(action));
  fab.onclick=action ? action.run : null;
  if(action){
    fab.setAttribute('aria-label',action.label);
    fab.title=action.label;
  }
}
function zoneAndSubZoneIds(zoneId, include){ const ids=new Set(); if(!zoneId) return ids; ids.add(zoneId); if(!include) return ids; let changed=true; while(changed){ changed=false; for(const z of environment.zones){ if(z.parent && ids.has(z.parent) && !ids.has(z.id)){ ids.add(z.id); changed=true; } } } return ids; }
function devicesInZone(list, zoneId, include){ const ids=zoneAndSubZoneIds(zoneId, include); return (list||[]).filter(d=>ids.has(d.zone)); }
function applianceZoneDevices(list, deviceId){
  const selectedDevice=(powerTargets()).find(d=>d.id===deviceId);
  if(!selectedDevice || !selectedDevice.zone) return [];
  const ids=zoneAndSubZoneIds(selectedDevice.zone,true);
  return (list||[]).filter(d=>ids.has(d.zone));
}

function foldCard(id, title, summary, openSet, body){ const card=el('section',{class:`card fold ${openSet.has(id)?'open':''}`,'data-id':id},[]); const head=el('div',{class:'fold-head',role:'button',tabindex:'0'},[el('div',{},[el('strong',{text:title}),el('div',{class:'summary',text:summary})]),el('span',{class:'caret',text:'⌄'})]); head.addEventListener('click',()=>{ card.classList.toggle('open'); if(card.classList.contains('open')) openSet.add(id); else openSet.delete(id); }); card.appendChild(head); card.appendChild(el('div',{class:'fold-body'},body)); return card; }
function modeDelayDisplay(action){ const seconds=Math.max(0,Number(action?.delaySeconds)||0); if(seconds>=3600 && seconds%3600===0)return {value:seconds/3600,unit:'hours'}; if(seconds>=60 && seconds%60===0)return {value:seconds/60,unit:'minutes'}; return {value:seconds||1,unit:'seconds'}; }
function modeDelaySeconds(value,unit){ const n=Math.max(0,Number(value)||0); return Math.round(n*(unit==='hours'?3600:unit==='minutes'?60:1)); }
function createModeDelayedRow(modeId, action={}){ const row=el('div',{class:'card mode-delayed-row','data-mode':modeId},[]); const device=buildSelect(ordinarySwitchTargets([action.deviceId||'']),[action.deviceId||''],false); device.dataset.field='deviceId'; const target=buildSelect([{id:'on',name:tt('Aan','On')},{id:'off',name:tt('Uit','Off')}],[action.target===false?'off':'on'],false); target.dataset.field='target'; const display=modeDelayDisplay(action); const delay=el('input',{type:'number',min:'1',max:'86400',step:'1',value:String(display.value),'data-field':'delay'}); const unit=buildSelect([{id:'seconds',name:tt('Seconden','Seconds')},{id:'minutes',name:tt('Minuten','Minutes')},{id:'hours',name:tt('Uren','Hours')}],[display.unit],false); unit.dataset.field='unit'; const remove=el('button',{class:'btn-danger',type:'button',text:tt('Verwijderen','Delete')}); remove.addEventListener('click',()=>row.remove()); row.append(el('div',{class:'three'},[fieldBlock(tt('Apparaat / plug','Device / plug'),device),fieldBlock(tt('Actie','Action'),target),el('div',{},[el('label',{text:tt('Vertraging','Delay')}),el('div',{class:'two'},[delay,unit])]) ])); row.append(el('div',{class:'actions'},[remove])); return row; }
function delayedModeActionsFromDom(modeId, fallback=[]){ const rows=[...document.querySelectorAll(`.mode-delayed-row[data-mode="${modeId}"]`)]; if(!rows.length){ const container=document.querySelector(`.mode-delayed-list[data-mode="${modeId}"]`); if(!container)return Array.isArray(fallback)?fallback:[]; } return rows.map(row=>{ const deviceId=row.querySelector('[data-field="deviceId"]')?.value||''; const target=(row.querySelector('[data-field="target"]')?.value||'on')!=='off'; const delaySeconds=modeDelaySeconds(row.querySelector('[data-field="delay"]')?.value,row.querySelector('[data-field="unit"]')?.value||'seconds'); return deviceId&&delaySeconds>0?{deviceId,target,delaySeconds}:null; }).filter(Boolean); }
function summarizeModeRule(mode, r){ const onCount=(r.on||[]).length; const offCount=(r.off||[]).length; const delayedCount=(r.delayed||[]).length; const lightCount=(r.lights||[]).length; return `${onCount} ${tt('aan','on')} · ${offCount} ${tt('uit','off')}${lightCount?` · ${lightCount} ${tt('licht','light')}`:''}${delayedCount?` · ${delayedCount} ${tt('vertraagd','delayed')}`:''}`; }
function modeLightDisplay(action={}){ const sec=Math.max(0,Number(action.delaySeconds)||0); if(sec&&sec%3600===0)return{value:sec/3600,unit:'hours'}; if(sec&&sec%60===0)return{value:sec/60,unit:'minutes'}; return{value:sec,unit:'seconds'}; }
function createModeLightRow(modeId, action={}){
  const row=el('div',{class:'card mode-light-row','data-mode':modeId});
  const device=buildSelect(lightTargets(),[action.deviceId||''],false); device.dataset.field='lightDeviceId';
  const on=buildSelect([{id:'on',name:tt('Aan','On')},{id:'off',name:tt('Uit','Off')}],[action.on===false?'off':'on'],false); on.dataset.field='lightOn';
  const dim=el('input',{type:'number',min:'0',max:'100',step:'1',value:action.dim==null?'':String(Math.round(Number(action.dim)*100)),placeholder:'0-100','data-field':'lightDim'});
  const temp=el('input',{type:'number',min:'0',max:'100',step:'1',value:action.lightTemperature==null?'':String(Math.round(Number(action.lightTemperature)*100)),placeholder:tt('0 = warm, 100 = koel','0 = warm, 100 = cool'),'data-field':'lightTemperature'});
  const colorEnabled=checkbox('lightColorEnabled',action.hue!=null||action.saturation!=null,tt('Kleur instellen','Set color')); const colorCheck=colorEnabled.querySelector('input');
  const color=el('input',{type:'color',value:hsvToHex(action.hue??0,action.saturation??1,1),'data-field':'lightColor'});
  const display=modeLightDisplay(action); const delay=el('input',{type:'number',min:'0',max:'86400',step:'1',value:String(display.value),'data-field':'lightDelay'}); const unit=buildSelect([{id:'seconds',name:tt('Seconden','Seconds')},{id:'minutes',name:tt('Minuten','Minutes')},{id:'hours',name:tt('Uren','Hours')}],[display.unit],false); unit.dataset.field='lightDelayUnit';
  const remove=el('button',{class:'btn-danger',type:'button',text:tt('Verwijderen','Delete')}); remove.addEventListener('click',()=>row.remove());
  const capsHint=el('div',{class:'hint',text:''});
  const dimBlock=fieldBlock(tt('Dimniveau %','Dim level %'),dim);
  const tempBlock=fieldBlock(tt('Kleurtemperatuur %','Color temperature %'),temp);
  const colorBlock=fieldBlock(tt('Kleur','Color'),el('div',{},[colorEnabled,color]));
  function updateCaps(){ const d=lightById(device.value); const caps=d?.capabilities||[]; const canDim=caps.includes('dim'); const canTemp=caps.includes('light_temperature'); const canColor=caps.includes('light_hue')&&caps.includes('light_saturation'); dimBlock.style.display=canDim?'':'none'; tempBlock.style.display=canTemp?'':'none'; colorBlock.style.display=canColor?'':'none'; if(!canDim)dim.value=''; if(!canTemp)temp.value=''; if(!canColor){colorCheck.checked=false;} const names=[]; if(canDim)names.push(tt('dimmen','dimming')); if(canTemp)names.push(tt('kleurtemperatuur','color temperature')); if(canColor)names.push(tt('kleur','color')); capsHint.textContent=names.length?tt('Ondersteunt: ','Supports: ')+names.join(', '):tt('Alleen aan/uit beschikbaar.','Only on/off is available.'); }
  device.addEventListener('change',updateCaps);
  row.append(el('div',{class:'three'},[fieldBlock(tt('Lamp','Light'),device),fieldBlock(tt('Status','State'),on),dimBlock]));
  row.append(el('div',{class:'three'},[tempBlock,colorBlock,el('div',{},[el('label',{text:tt('Vertraging','Delay')}),el('div',{class:'two'},[delay,unit])]) ]));
  updateCaps();
  row.append(capsHint,el('div',{class:'actions'},[remove])); return row;
}
function modeLightActionsFromDom(modeId,fallback=[]){ const rows=[...document.querySelectorAll(`.mode-light-row[data-mode="${modeId}"]`)]; if(!rows.length){const container=document.querySelector(`.mode-light-list[data-mode="${modeId}"]`); if(!container)return Array.isArray(fallback)?fallback:[];} return rows.map(row=>{ const deviceId=row.querySelector('[data-field="lightDeviceId"]')?.value||''; if(!deviceId)return null; const colorOn=row.querySelector('[data-field="lightColorEnabled"]')?.checked===true; const hsv=rgbToHsv(row.querySelector('[data-field="lightColor"]')?.value||'#ffffff'); const dimRaw=row.querySelector('[data-field="lightDim"]')?.value??''; const tempRaw=row.querySelector('[data-field="lightTemperature"]')?.value??''; return {deviceId,on:(row.querySelector('[data-field="lightOn"]')?.value||'on')!=='off',dim:dimRaw===''?null:Math.max(0,Math.min(1,Number(dimRaw)/100)),lightTemperature:tempRaw===''?null:Math.max(0,Math.min(1,Number(tempRaw)/100)),hue:colorOn?hsv.h:null,saturation:colorOn?hsv.s:null,delaySeconds:modeDelaySeconds(row.querySelector('[data-field="lightDelay"]')?.value||0,row.querySelector('[data-field="lightDelayUnit"]')?.value||'seconds')}; }).filter(Boolean); }
function createScheduleLightRow(scheduleId, action={}){
  const row=el('div',{class:'card schedule-light-row','data-schedule':scheduleId});
  const device=buildSelect(lightTargets(),[action.deviceId||''],false); device.dataset.field='scheduleLightDeviceId';
  const on=buildSelect([{id:'on',name:tt('Aan','On')},{id:'off',name:tt('Uit','Off')}],[action.on===false?'off':'on'],false); on.dataset.field='scheduleLightOn';
  const dim=el('input',{type:'number',min:'0',max:'100',step:'1',value:action.dim==null?'':String(Math.round(Number(action.dim)*100)),placeholder:'0-100','data-field':'scheduleLightDim'});
  const temp=el('input',{type:'number',min:'0',max:'100',step:'1',value:action.lightTemperature==null?'':String(Math.round(Number(action.lightTemperature)*100)),placeholder:tt('0 = warm, 100 = koel','0 = warm, 100 = cool'),'data-field':'scheduleLightTemperature'});
  const colorEnabled=checkbox('scheduleLightColorEnabled',action.hue!=null||action.saturation!=null,tt('Kleur instellen','Set color')); const colorCheck=colorEnabled.querySelector('input');
  const color=el('input',{type:'color',value:hsvToHex(action.hue??0,action.saturation??1,1),'data-field':'scheduleLightColor'});
  const display=modeLightDisplay(action); const delay=el('input',{type:'number',min:'0',max:'86400',step:'1',value:String(display.value),'data-field':'scheduleLightDelay'}); const unit=buildSelect([{id:'seconds',name:tt('Seconden','Seconds')},{id:'minutes',name:tt('Minuten','Minutes')},{id:'hours',name:tt('Uren','Hours')}],[display.unit],false); unit.dataset.field='scheduleLightDelayUnit';
  const remove=el('button',{class:'btn-danger',type:'button',text:tt('Verwijderen','Delete')}); remove.addEventListener('click',()=>row.remove());
  const capsHint=el('div',{class:'hint',text:''});
  const dimBlock=fieldBlock(tt('Dimniveau %','Dim level %'),dim);
  const tempBlock=fieldBlock(tt('Kleurtemperatuur %','Color temperature %'),temp);
  const colorBlock=fieldBlock(tt('Kleur','Color'),el('div',{},[colorEnabled,color]));
  function updateCaps(){ const d=lightById(device.value); const caps=d?.capabilities||[]; const canDim=caps.includes('dim'); const canTemp=caps.includes('light_temperature'); const canColor=caps.includes('light_hue')&&caps.includes('light_saturation'); dimBlock.style.display=canDim?'':'none'; tempBlock.style.display=canTemp?'':'none'; colorBlock.style.display=canColor?'':'none'; if(!canDim)dim.value=''; if(!canTemp)temp.value=''; if(!canColor){colorCheck.checked=false;} const names=[]; if(canDim)names.push(tt('dimmen','dimming')); if(canTemp)names.push(tt('kleurtemperatuur','color temperature')); if(canColor)names.push(tt('kleur','color')); capsHint.textContent=names.length?tt('Ondersteunt: ','Supports: ')+names.join(', '):tt('Alleen aan/uit beschikbaar.','Only on/off is available.'); }
  device.addEventListener('change',updateCaps);
  row.append(el('div',{class:'three'},[fieldBlock(tt('Lamp','Light'),device),fieldBlock(tt('Status','State'),on),dimBlock]));
  row.append(el('div',{class:'three'},[tempBlock,colorBlock,el('div',{},[el('label',{text:tt('Vertraging','Delay')}),el('div',{class:'two'},[delay,unit])]) ]));
  updateCaps();
  row.append(capsHint,el('div',{class:'actions'},[remove])); return row;
}
function scheduleLightActionsFromDom(scheduleId,fallback=[]){ const rows=[...document.querySelectorAll(`.schedule-light-row[data-schedule="${scheduleId}"]`)]; if(!rows.length){const container=document.querySelector(`.schedule-light-list[data-schedule="${scheduleId}"]`); if(!container)return Array.isArray(fallback)?fallback:[];} return rows.map(row=>{ const deviceId=row.querySelector('[data-field="scheduleLightDeviceId"]')?.value||''; if(!deviceId)return null; const colorOn=row.querySelector('[data-field="scheduleLightColorEnabled"]')?.checked===true; const hsv=rgbToHsv(row.querySelector('[data-field="scheduleLightColor"]')?.value||'#ffffff'); const dimRaw=row.querySelector('[data-field="scheduleLightDim"]')?.value??''; const tempRaw=row.querySelector('[data-field="scheduleLightTemperature"]')?.value??''; return {deviceId,on:(row.querySelector('[data-field="scheduleLightOn"]')?.value||'on')!=='off',dim:dimRaw===''?null:Math.max(0,Math.min(1,Number(dimRaw)/100)),lightTemperature:tempRaw===''?null:Math.max(0,Math.min(1,Number(tempRaw)/100)),hue:colorOn?hsv.h:null,saturation:colorOn?hsv.s:null,delaySeconds:modeDelaySeconds(row.querySelector('[data-field="scheduleLightDelay"]')?.value||0,row.querySelector('[data-field="scheduleLightDelayUnit"]')?.value||'seconds')}; }).filter(Boolean); }

function renderModes(){ const grid=document.getElementById('modeGrid'); grid.innerHTML=''; for(const mode of config.modes){ const r=config.rules[mode.id]||{on:[],off:[],delayed:[],lights:[]}; const on=buildSelect(ordinarySwitchTargets(r.on),r.on); on.dataset.mode=mode.id; on.dataset.target='on'; const off=buildSelect(ordinarySwitchTargets(r.off),r.off); off.dataset.mode=mode.id; off.dataset.target='off'; const delayedList=el('div',{class:'mode-delayed-list','data-mode':mode.id},[]); for(const action of (r.delayed||[])) delayedList.appendChild(createModeDelayedRow(mode.id,action)); const addDelayed=el('button',{class:'btn-secondary',type:'button',text:`+ ${tt('Vertraagde actie toevoegen','Add delayed action')}`}); addDelayed.addEventListener('click',()=>delayedList.appendChild(createModeDelayedRow(mode.id,{target:true,delaySeconds:60}))); const delayedSection=el('section',{class:'card'},[el('h3',{text:tt('Vertraagde acties','Delayed actions')}),el('p',{class:'hint',text:tt('Deze acties worden alleen uitgevoerd als deze modus nog actief is wanneer de vertraging afloopt.','These actions run only if this mode is still active when the delay expires.')}),delayedList,addDelayed]); const lightList=el('div',{class:'mode-light-list','data-mode':mode.id},[]); for(const action of (r.lights||[])) lightList.appendChild(createModeLightRow(mode.id,action)); const addLight=el('button',{class:'btn-secondary',type:'button',text:`+ ${tt('Lichtinstelling toevoegen','Add light setting')}`}); addLight.addEventListener('click',()=>lightList.appendChild(createModeLightRow(mode.id,{on:true,dim:null,lightTemperature:null,hue:null,saturation:null,delaySeconds:0}))); const lightSection=el('section',{class:'card'},[el('h3',{text:tt('Lichtinstellingen','Light settings')}),el('p',{class:'hint',text:tt('Stel per lamp aan/uit, dimniveau, kleurtemperatuur, kleur en eventueel een vertraging in. Alleen ondersteunde opties worden toegepast.','Set on/off, dim level, color temperature, color and an optional delay per light. Only supported options are applied.')}),lightList,addLight]); const btn=el('button',{class:'btn-primary',type:'button',text:`${tt('Activeer', 'Activate')} ${mode.label}`}); btn.addEventListener('click',()=>applyMode(mode.id)); grid.appendChild(foldCard('mode-'+mode.id,mode.label,summarizeModeRule(mode,r),openModeIds,[fieldBlock(tt('Apparaten aan', 'Devices on'),on,tt('Deze apparaten gaan aan bij deze modus.', 'These devices turn on in this mode.')),fieldBlock(tt('Apparaten uit', 'Devices off'),off,tt('Deze apparaten gaan uit bij deze modus.', 'These devices turn off in this mode.')),lightSection,delayedSection,btn])); } }
function collectModeRules(){ const out={}; const existing=config.rules||{}; for(const m of config.modes||[]){ const onSel=document.querySelector(`select[data-mode="${m.id}"][data-target="on"]`); const offSel=document.querySelector(`select[data-mode="${m.id}"][data-target="off"]`); const prev=existing[m.id]||{on:[],off:[],delayed:[],lights:[]}; out[m.id]={on:onSel?selectedValues(onSel):Array.isArray(prev.on)?prev.on:[],off:offSel?selectedValues(offSel):Array.isArray(prev.off)?prev.off:[],delayed:delayedModeActionsFromDom(m.id,prev.delayed),lights:modeLightActionsFromDom(m.id,prev.lights)}; } return out; }
function summarizeZoneRule(r){ const zone=environment.zones.find(z=>z.id===r.zoneId)?.name||tt('geen zone','no zone'); const modes=(r.modeIds||[]).map(id=>config.modes.find(m=>m.id===id)?.label||id).join(', ')||tt('geen modus','no mode'); const parts=[zone,modes]; if(r.includeSubzones) parts.push(tt('incl. subzones','incl. subzones')); if((r.motionDeviceIds||[]).length) parts.push(`${r.motionDeviceIds.length} ${tt('beweging','motion')}`); if((r.contactDeviceIds||[]).length) parts.push(`${r.contactDeviceIds.length} ${tt('deur/raam','door/window')}`); if((r.lightDeviceIds||[]).length) parts.push(`${r.lightDeviceIds.length} ${tt('lampen','lights')}`); return parts.join(' · '); }
function renderZoneRules(){ const h=document.getElementById('zoneRules'); h.innerHTML=''; if(!config.zoneRules.length) h.appendChild(el('section',{class:'card'},[el('p',{text:tt('Nog geen zoneregels.', 'No zone rules yet.')})])); config.zoneRules.forEach((r,i)=>h.appendChild(renderZoneRule(r,i))); }
function renderZoneRule(r,i){ const zone=buildSelect(environment.zones,[r.zoneId],false); zone.dataset.field='zoneId'; zone.addEventListener('change',()=>{ collectZoneRules(); renderZoneRules(); }); const modes=buildSelect(config.modes.map(m=>({id:m.id,name:m.label})),r.modeIds); modes.dataset.field='modeIds'; const include=checkbox('includeSubzones',r.includeSubzones,tt('Onderliggende subzones/kamers meenemen','Include subzones/rooms')); include.querySelector('input').addEventListener('change',()=>{ collectZoneRules(); renderZoneRules(); }); const motion=buildSelect(devicesInZone(environment.motionDevices,r.zoneId,r.includeSubzones),r.motionDeviceIds); motion.dataset.field='motionDeviceIds'; const contact=buildSelect(devicesInZone(environment.contactDevices,r.zoneId,r.includeSubzones),r.contactDeviceIds); contact.dataset.field='contactDeviceIds'; const lights=buildSelect(devicesInZone(environment.lightDevices,r.zoneId,r.includeSubzones),r.lightDeviceIds); lights.dataset.field='lightDeviceIds'; const lux=buildSelect(devicesInZone(environment.luminanceDevices,r.zoneId,r.includeSubzones),r.luxDeviceIds); lux.dataset.field='luxDeviceIds'; const name=el('input',{value:r.name||'','data-field':'name'}); const noMotion=el('input',{type:'number',min:'10',max:'86400',step:'10',value:String(r.noMotionSeconds||180),'data-field':'noMotionSeconds'}); const dim=el('input',{type:'number',min:'0',max:'1',step:'0.05',value:r.dimValue??'',placeholder:tt('Optioneel 0-1','Optional 0-1'),'data-field':'dimValue'}); const lightTemp=el('input',{type:'number',min:'0',max:'100',step:'1',value:r.lightTemperature==null?'':String(Math.round(Number(r.lightTemperature)*100)),placeholder:tt('0 warm - 100 koel','0 warm - 100 cool'),'data-field':'lightTemperature'}); const zoneColorEnabled=checkbox('lightColorEnabled',r.lightColorEnabled===true,tt('Kleur instellen bij inschakelen','Set color when switching on')); const zoneColor=el('input',{type:'color',value:hsvToHex(r.lightHue??0,r.lightSaturation??1,1),'data-field':'lightColor'}); const sequenceEnabled=checkbox('contactSequenceEnabled',r.contactSequenceEnabled===true,tt('Gebruik een teller voor deur-/raamcontacten','Use a counter for door/window contacts')); const sequenceEvent=buildSelect([{id:'open',name:tt('Open','Open')},{id:'closed',name:tt('Dicht','Closed')}],[r.contactSequenceEvent||'open'],false); sequenceEvent.dataset.field='contactSequenceEvent'; const sequenceCount=el('input',{type:'number',min:'2',max:'10',step:'1',value:String(r.contactSequenceCount||2),'data-field':'contactSequenceCount'}); const sequenceReset=el('input',{type:'number',min:'30',max:'86400',step:'30',value:String(r.contactSequenceResetSeconds||1800),'data-field':'contactSequenceResetSeconds'}); const sequenceResetMode=checkbox('contactSequenceResetOnModeChange',r.contactSequenceResetOnModeChange!==false,tt('Teller resetten bij moduswissel','Reset counter on mode change')); const sequenceSection=el('section',{class:'card'},[el('h3',{text:tt('Contact-teller / volgorde','Contact counter / sequence')}),el('p',{class:'hint',text:tt('Voorbeeld: licht aan bij eerste opening en uit bij de tweede opening of tweede sluiting. Daarna begint de teller opnieuw.','Example: switch the light on at the first opening and off at the second opening or second closing. The counter then starts again.')}),sequenceEnabled,el('div',{class:'three'},[fieldBlock(tt('Tel gebeurtenis','Count event'),sequenceEvent),fieldBlock(tt('Licht uit bij telling','Turn light off at count'),sequenceCount),fieldBlock(tt('Teller reset na seconden','Reset counter after seconds'),sequenceReset)]),sequenceResetMode,el('div',{class:'hint','data-contact-counter-status':r.id,text:tt('Tellerstatus laden…','Loading counter status…')}),(()=>{const b=el('button',{class:'btn-secondary',type:'button',text:tt('Teller resetten','Reset counter')});b.addEventListener('click',async()=>{await api('POST','/contact_counter/reset',{ruleId:r.id});await refreshContactCounterStatus();});return b;})()]); const timeFrom=el('input',{type:'time',value:r.timeFrom||'18:00','data-field':'timeFrom'}); const timeTo=el('input',{type:'time',value:r.timeTo||'23:59','data-field':'timeTo'}); const luxBelow=el('input',{type:'number',min:'0',max:'100000',step:'1',value:String(r.luxBelow||30),'data-field':'luxBelow'}); const remove=el('button',{class:'btn-danger',type:'button',text:tt('Verwijderen', 'Delete')}); remove.addEventListener('click',()=>{ collectZoneRules(); config.zoneRules.splice(i,1); renderZoneRules(); }); const test=el('button',{class:'btn-secondary',type:'button',text:tt('Test zone','Test zone')}); test.addEventListener('click',async()=>{ await saveAll(); await api('POST','/run_zone',{zoneId:r.zoneId}); showToast(tt('Zoneregel getest','Zone rule tested')); }); const dimBlock=fieldBlock(tt('Dimwaarde','Dim value'),dim); const tempBlock=fieldBlock(tt('Kleurtemperatuur %','Color temperature %'),lightTemp); const colorBlock=el('div',{},[zoneColorEnabled,fieldBlock(tt('Kleur','Color'),zoneColor)]); function updateZoneLightCaps(){ const selected=[...lights.selectedOptions].map(o=>o.value); const chosen=(environment.lightDevices||[]).filter(d=>selected.includes(d.id)); const caps=chosen.flatMap(d=>d.capabilities||[]); const canDim=caps.includes('dim'); const canTemp=caps.includes('light_temperature'); const canColor=caps.includes('light_hue')&&caps.includes('light_saturation'); dimBlock.style.display=canDim?'':'none'; tempBlock.style.display=canTemp?'':'none'; colorBlock.style.display=canColor?'':'none'; if(!canDim)dim.value=''; if(!canTemp)lightTemp.value=''; if(!canColor)zoneColorEnabled.querySelector('input').checked=false; } lights.addEventListener('change',updateZoneLightCaps); setTimeout(updateZoneLightCaps,0); return foldCard(r.id||`zone-${i}`,r.name||'Zoneregel',summarizeZoneRule(r),openZoneIds,[fieldBlock(tt('Naam','Name'),name),fieldBlock(tt('Modussen','Modes'),modes),fieldBlock(tt('Zone/kamer','Zone/room'),zone),include,fieldBlock(tt('Bewegingssensoren','Motion sensors'),motion),fieldBlock(tt('Deur-/raamsensoren','Door/window sensors'),contact),fieldBlock(tt('Lampen','Lights'),lights),el('div',{class:'two'},[el('div',{},[checkbox('enabled',r.enabled,tt('Regel actief','Rule active')),checkbox('turnOnOnMotion',r.turnOnOnMotion,tt('Lampen aan bij beweging','Turn lights on when motion is detected')),checkbox('turnOffAfterNoMotion',r.turnOffAfterNoMotion,tt('Lampen uit na geen beweging','Turn lights off after no motion')),checkbox('turnOnOnContact',r.turnOnOnContact,tt('Lampen aan bij contact-actief','Turn lights on when contact is active')),checkbox('turnOffWhenContactClosed',r.turnOffWhenContactClosed,tt('Lampen uit bij contact-inactief','Turn lights off when contact is inactive')),checkbox('invertContactLogic',r.invertContactLogic,tt('Deur-/raamcontact omkeren: dicht = aan, open = uit','Invert door/window contact: closed = on, open = off'))]),el('div',{},[fieldBlock(tt('Geen beweging na seconden','No motion after seconds'),noMotion),dimBlock,tempBlock,colorBlock,checkbox('onlyIfLightsOff',r.onlyIfLightsOff,tt('Alleen inschakelen als gekozen lampen uit zijn','Only switch on if selected lights are off'))])]),sequenceSection,el('h3',{text:tt('Voorwaarden','Conditions')}),el('div',{class:'two'},[el('div',{},[checkbox('timeEnabled',r.timeEnabled,tt('Alleen binnen tijdvenster','Only within time window')),fieldBlock(tt('Van','From'),timeFrom),fieldBlock(tt('Tot','Until'),timeTo)]),el('div',{},[checkbox('onlyIfDark',r.onlyIfDark,tt('Alleen als het donker genoeg is','Only when dark enough')),fieldBlock(tt('Luxsensoren','Lux sensors'),lux),fieldBlock(tt('Donker onder luxwaarde','Dark below lux value'),luxBelow)])]),el('div',{class:'actions'},[test,remove])]); }

function collectZoneRules(){ const cards=Array.from(document.querySelectorAll('#zoneRules [data-id]')); config.zoneRules=cards.map((card,i)=>{ const base=config.zoneRules[i]||{}; const get=f=>card.querySelector(`[data-field="${f}"]`); return {...base,name:get('name').value,enabled:get('enabled').checked,modeIds:selectedValues(get('modeIds')),zoneId:get('zoneId').value,includeSubzones:get('includeSubzones').checked,motionDeviceIds:selectedValues(get('motionDeviceIds')),contactDeviceIds:selectedValues(get('contactDeviceIds')),lightDeviceIds:selectedValues(get('lightDeviceIds')),turnOnOnMotion:get('turnOnOnMotion').checked,turnOnOnContact:get('turnOnOnContact').checked,turnOffAfterNoMotion:get('turnOffAfterNoMotion').checked,turnOffWhenContactClosed:get('turnOffWhenContactClosed').checked,invertContactLogic:get('invertContactLogic').checked,contactSequenceEnabled:get('contactSequenceEnabled')?.checked===true,contactSequenceEvent:get('contactSequenceEvent')?.value||'open',contactSequenceCount:Number(get('contactSequenceCount')?.value||2),contactSequenceResetSeconds:Number(get('contactSequenceResetSeconds')?.value||1800),contactSequenceResetOnModeChange:get('contactSequenceResetOnModeChange')?get('contactSequenceResetOnModeChange').checked:true,noMotionSeconds:Number(get('noMotionSeconds').value),dimValue:get('dimValue').value===''?null:Number(get('dimValue').value),lightTemperature:get('lightTemperature').value===''?null:Math.max(0,Math.min(1,Number(get('lightTemperature').value)/100)),lightColorEnabled:get('lightColorEnabled').checked,lightHue:rgbToHsv(get('lightColor').value).h,lightSaturation:rgbToHsv(get('lightColor').value).s,onlyIfLightsOff:get('onlyIfLightsOff').checked,timeEnabled:get('timeEnabled').checked,timeFrom:get('timeFrom').value,timeTo:get('timeTo').value,onlyIfDark:get('onlyIfDark').checked,luxDeviceIds:selectedValues(get('luxDeviceIds')),luxBelow:Number(get('luxBelow').value)}; }); return config.zoneRules; }
function addZoneRule(){ const rule={id:`rule-${Date.now()}`,name:tt('Nieuwe zoneregel','New zone rule'),enabled:true,modeIds:config.modes.map(m=>m.id),zoneId:environment.zones[0]?.id||'',includeSubzones:false,motionDeviceIds:[],contactDeviceIds:[],lightDeviceIds:[],turnOnOnMotion:true,turnOnOnContact:false,turnOffAfterNoMotion:true,turnOffWhenContactClosed:false,invertContactLogic:false,noMotionSeconds:180,dimValue:null,lightTemperature:null,lightColorEnabled:false,lightHue:0,lightSaturation:1,timeEnabled:false,timeFrom:'18:00',timeTo:'23:59',onlyIfLightsOff:false,onlyIfDark:false,luxDeviceIds:[],luxBelow:30}; config.zoneRules.push(rule); openZoneIds.add(rule.id); renderZoneRules(); }

function temperatureModeIds(r){ if(r&&Array.isArray(r.modeIds)) return r.modeIds.map(String); if(r&&r.modeId) return [String(r.modeId)]; return [String(config.currentMode||config.modes?.[0]?.id||'home')]; }
function summarizeTemperatureRule(r){ const modeIds=temperatureModeIds(r); const mode=modeIds.map(id=>config.modes.find(m=>m.id===id)?.label||id).join(', ')||tt('modus','mode'); const zone=(environment.zones||[]).find(z=>z.id===r.zoneId)?.name||tt('geen zone', 'no zone'); const count=(r.thermostatDeviceIds||[]).length; const windowText=r.windowMode==='skip'?tt('sla over bij open raam','skip when window open'):(r.windowMode==='setback'?tt('raam open '+(r.windowTemperature||15)+'°C', 'window open '+(r.windowTemperature||15)+'°C'):tt('raam negeren','ignore window')); const weatherText=r.smartWeatherEnabled?tt('weer-correctie aan','weather compensation on'):tt('weer-correctie uit','weather compensation off'); const liveText=(r.windowMode!=='ignore'&&r.liveWindowContact===true)?` · ${tt('live raam/deur','live window/door')}`:''; return `${mode} · ${zone} · ${r.temperature||20}°C · ${count||tt('alle','all')} thermostaten · ${windowText}${liveText} · ${weatherText}`; }
function renderTemperatureRules(){ const h=document.getElementById('temperatureRules'); h.innerHTML=''; config.temperatureRules=config.temperatureRules||[]; if(!config.temperatureRules.length) h.appendChild(el('section',{class:'card'},[el('p',{text:tt('Nog geen temperatuurregels.', 'No temperature rules yet.')})])); config.temperatureRules.forEach((r,i)=>h.appendChild(renderTemperatureRule(r,i))); }
function renderTemperatureRule(r,i){ const zone=buildSelect(environment.zones,[r.zoneId],false); zone.dataset.field='zoneId'; zone.addEventListener('change',()=>{ collectTemperatureRules(); renderTemperatureRules(); }); const modes=buildSelect(config.modes.map(m=>({id:m.id,name:m.label})),temperatureModeIds(r)); modes.dataset.field='modeIds'; const thermostats=buildSelect(devicesInZone(environment.thermostatDevices||[],r.zoneId,r.includeSubzones),r.thermostatDeviceIds||[]); thermostats.dataset.field='thermostatDeviceIds'; const contacts=buildSelect(devicesInZone(environment.contactDevices||[],r.zoneId,r.includeSubzones),r.contactDeviceIds||[]); contacts.dataset.field='contactDeviceIds'; const weatherDevices=buildSelect(environment.weatherDevices||environment.temperatureSensorDevices||[],[r.weatherDeviceId||''],false); weatherDevices.dataset.field='weatherDeviceId'; const name=el('input',{value:r.name||'','data-field':'name'}); const temp=el('input',{type:'number',min:'5',max:'35',step:'0.5',value:String(r.temperature||20),'data-field':'temperature'}); const windowMode=buildSelect([{id:'ignore',name:tt('Raam/deur negeren','Ignore window/door')},{id:'skip',name:tt('Niet verwarmen als open','Do not heat when open')},{id:'setback',name:tt('Andere temperatuur als open','Different temperature when open')}],[r.windowMode||'ignore'],false); windowMode.dataset.field='windowMode'; const windowTemp=el('input',{type:'number',min:'5',max:'35',step:'0.5',value:String(r.windowTemperature||15),'data-field':'windowTemperature'}); const liveWindowContact=checkbox('liveWindowContact',r.liveWindowContact===true,tt('Direct reageren op raam/deurwijzigingen','React immediately to window/door changes')); const include=checkbox('includeSubzones',r.includeSubzones,tt('Onderliggende subzones/kamers meenemen', 'Include subzones/rooms')); include.querySelector('input').addEventListener('change',()=>{ collectTemperatureRules(); renderTemperatureRules(); }); const smart=checkbox('smartWeatherEnabled',r.smartWeatherEnabled,tt('Slim verwarmen via weerdevice','Smart heating using weather device')); const coldBelow=el('input',{type:'number',min:'-40',max:'40',step:'0.5',value:String(r.weatherColdBelow??5),'data-field':'weatherColdBelow'}); const coldBoost=el('input',{type:'number',min:'0',max:'5',step:'0.5',value:String(r.weatherColdBoost??1),'data-field':'weatherColdBoost'}); const warmAbove=el('input',{type:'number',min:'-40',max:'40',step:'0.5',value:String(r.weatherWarmAbove??16),'data-field':'weatherWarmAbove'}); const warmReduce=el('input',{type:'number',min:'0',max:'5',step:'0.5',value:String(r.weatherWarmReduce??1),'data-field':'weatherWarmReduce'}); const minTarget=el('input',{type:'number',min:'5',max:'35',step:'0.5',value:String(r.weatherMinTarget??5),'data-field':'weatherMinTarget'}); const maxTarget=el('input',{type:'number',min:'5',max:'35',step:'0.5',value:String(r.weatherMaxTarget??25),'data-field':'weatherMaxTarget'}); const remove=el('button',{class:'btn-danger',type:'button',text:tt('Verwijderen','Delete')}); remove.addEventListener('click',()=>{ collectTemperatureRules(); config.temperatureRules.splice(i,1); renderTemperatureRules(); }); return foldCard(r.id||`temp-${i}`,r.name||tt('Temperatuurregel','Temperature rule'),summarizeTemperatureRule(r),openTempIds,[fieldBlock(tt('Naam','Name'),name),el('div',{class:'three'},[fieldBlock(tt('Modussen','Modes'),modes,tt('Selecteer één of meerdere modussen.','Select one or more modes.')),fieldBlock(tt('Zone/kamer','Zone/room'),zone),fieldBlock(tt('Temperatuur','Temperature'),temp)]),include,fieldBlock(tt('Thermostaten','Thermostats'),thermostats,tt('Leeg laten = alle thermostaten in deze zone.', 'Leave empty = all thermostats in this zone.')),el('div',{class:'two'},[fieldBlock(tt('Raam/deur open','Window/door open'),windowMode,tt('Kijkt naar contact-sensoren in dezelfde zone.', 'Uses contact sensors in the same zone.')),fieldBlock(tt('Temperatuur bij open raam/deur','Temperature when window/door is open'),windowTemp,tt('Alleen gebruikt bij: Andere temperatuur als open.', 'Only used for: Different temperature when open.'))]),fieldBlock(tt('Raam/deur sensoren','Window/door sensors'),contacts,tt('Leeg laten = alle contact-sensoren in deze zone. Werkt ook met subzones als die optie aan staat.', 'Leave empty = all contact sensors in this zone. Also includes subzones when that option is enabled.')),el('div',{'data-field-wrap':'liveWindowContact'},[liveWindowContact,el('p',{class:'hint',text:tt('Optioneel. Als dit aanstaat wordt deze temperatuurregel direct opnieuw toegepast zodra een gekozen raam of deur open of dicht gaat.','Optional. When enabled, this temperature rule is reapplied immediately when a selected window or door opens or closes.')})]),el('section',{class:'card'},[el('h3',{text:tt('Slim verwarmen','Smart heating')}),smart,fieldBlock(tt('Weerdevice / buitentemperatuur','Weather device / outdoor temperature'),weatherDevices,tt('Kies een device met measure_temperature, bijvoorbeeld je weerapp.', 'Choose a device with measure_temperature, for example your weather app.')),el('div',{class:'two'},[fieldBlock(tt('Koud onder °C','Cold below °C'),coldBelow),fieldBlock(tt('Verhoog setpoint met °C','Increase setpoint by °C'),coldBoost)]),el('div',{class:'two'},[fieldBlock(tt('Warm boven °C','Warm above °C'),warmAbove),fieldBlock(tt('Verlaag setpoint met °C','Decrease setpoint by °C'),warmReduce)]),el('div',{class:'two'},[fieldBlock(tt('Minimum setpoint','Minimum setpoint'),minTarget),fieldBlock(tt('Maximum setpoint','Maximum setpoint'),maxTarget)])]),checkbox('enabled',r.enabled,tt('Regel actief','Rule active')),remove]); }
function ensureTemperatureState(){ if(!config){ config={modes:[{id:'home',label:tt('Thuis','Home')}],currentMode:'home',rules:{},zoneRules:[],temperatureRules:[],scheduleRules:[],autoMode:{}}; } config.modes=config.modes&&config.modes.length?config.modes:[{id:'home',label:tt('Thuis','Home')}]; config.temperatureRules=Array.isArray(config.temperatureRules)?config.temperatureRules:[]; environment=environment||{}; environment.zones=Array.isArray(environment.zones)?environment.zones:[]; environment.thermostatDevices=Array.isArray(environment.thermostatDevices)?environment.thermostatDevices:[]; environment.contactDevices=Array.isArray(environment.contactDevices)?environment.contactDevices:[]; environment.weatherDevices=Array.isArray(environment.weatherDevices)?environment.weatherDevices:[]; environment.temperatureSensorDevices=Array.isArray(environment.temperatureSensorDevices)?environment.temperatureSensorDevices:[]; }
function collectTemperatureRules(){ ensureTemperatureState(); const cards=Array.from(document.querySelectorAll('#temperatureRules [data-id]')); config.temperatureRules=cards.map((card,i)=>{ const base=config.temperatureRules[i]||{}; const get=f=>card.querySelector(`[data-field="${f}"]`); return {...base,name:get('name')?.value||base.name||'',enabled:get('enabled')?get('enabled').checked:true,modeIds:get('modeIds')?selectedValues(get('modeIds')):temperatureModeIds(base),zoneId:get('zoneId')?.value||base.zoneId||'',includeSubzones:get('includeSubzones')?get('includeSubzones').checked:false,thermostatDeviceIds:get('thermostatDeviceIds')?selectedValues(get('thermostatDeviceIds')):[],temperature:Number(get('temperature')?.value||base.temperature||20),windowMode:get('windowMode')?.value||base.windowMode||'ignore',windowTemperature:Number(get('windowTemperature')?.value||base.windowTemperature||15),liveWindowContact:get('liveWindowContact')?get('liveWindowContact').checked:false,contactDeviceIds:get('contactDeviceIds')?selectedValues(get('contactDeviceIds')):[],smartWeatherEnabled:get('smartWeatherEnabled')?get('smartWeatherEnabled').checked:false,weatherDeviceId:get('weatherDeviceId')?.value||'',weatherColdBelow:Number(get('weatherColdBelow')?.value||5),weatherColdBoost:Number(get('weatherColdBoost')?.value||1),weatherWarmAbove:Number(get('weatherWarmAbove')?.value||16),weatherWarmReduce:Number(get('weatherWarmReduce')?.value||1),weatherMinTarget:Number(get('weatherMinTarget')?.value||5),weatherMaxTarget:Number(get('weatherMaxTarget')?.value||25)}; }); return config.temperatureRules; }
function addTemperatureRule(){ ensureTemperatureState(); const rule={id:`temp-${Date.now()}`,name:tt('Nieuwe temperatuurregel','New temperature rule'),enabled:true,modeIds:[config.currentMode||config.modes[0].id||'home'],zoneId:(environment.zones&&environment.zones[0]&&environment.zones[0].id)||'',includeSubzones:false,thermostatDeviceIds:[],temperature:20,windowMode:'ignore',windowTemperature:15,liveWindowContact:false,contactDeviceIds:[],smartWeatherEnabled:false,weatherDeviceId:'',weatherColdBelow:5,weatherColdBoost:1,weatherWarmAbove:16,weatherWarmReduce:1,weatherMinTarget:5,weatherMaxTarget:25}; config.temperatureRules.push(rule); openTempIds.add(rule.id); renderTemperatureRules(); showToast(tt('Temperatuurregel toegevoegd. Vergeet niet op Alles opslaan te klikken.', 'Temperature rule added. Do not forget to click Save all.')); }
function ensureApplianceState(){ if(!config){ config={modes:[{id:'home',label:tt('Thuis','Home')}],currentMode:'home',rules:{},zoneRules:[],temperatureRules:[],applianceRules:[],applianceState:{},activityRules:[],activityState:{},activityHistory:{},scheduleRules:[],autoMode:{}}; } config.applianceRules=Array.isArray(config.applianceRules)?config.applianceRules:[]; config.applianceState=config.applianceState&&typeof config.applianceState==='object'?config.applianceState:{}; config.activityRules=Array.isArray(config.activityRules)?config.activityRules:[]; config.activityState=config.activityState&&typeof config.activityState==='object'?config.activityState:{}; config.activityHistory=config.activityHistory&&typeof config.activityHistory==='object'?config.activityHistory:{}; environment=environment||{}; environment.powerDevices=Array.isArray(environment.powerDevices)?environment.powerDevices:[]; environment.powerTargets=Array.isArray(environment.powerTargets)?environment.powerTargets:[]; environment.energyTargets=Array.isArray(environment.energyTargets)?environment.energyTargets:[]; environment.motionDevices=Array.isArray(environment.motionDevices)?environment.motionDevices:[]; environment.contactDevices=Array.isArray(environment.contactDevices)?environment.contactDevices:[]; environment.activityDevices=Array.isArray(environment.activityDevices)?environment.activityDevices:[]; }
function applianceTypeName(type){ const map={washing_machine:tt('Wasmachine','Washing machine'),dryer:tt('Droger','Dryer'),dishwasher:tt('Vaatwasser','Dishwasher'),airfryer:'Airfryer',other:tt('Apparaat','Appliance')}; return map[type]||map.other; }
function defaultAppliance(type){ const d={washing_machine:{startThreshold:10,startDelaySeconds:30,readyThreshold:3,readyDelaySeconds:180},dryer:{startThreshold:50,startDelaySeconds:30,readyThreshold:5,readyDelaySeconds:180},dishwasher:{startThreshold:10,startDelaySeconds:30,readyThreshold:3,readyDelaySeconds:300},airfryer:{startThreshold:100,startDelaySeconds:5,readyThreshold:5,readyDelaySeconds:60},other:{startThreshold:10,startDelaySeconds:30,readyThreshold:3,readyDelaySeconds:180}}; return d[type]||d.other; }
function formatApplianceKwh(v){
  const n = Number(v);
  if(!Number.isFinite(n) || n <= 0) return '';

  return ` · ${n.toLocaleString(
    ({nl:'nl-NL',en:'en-US',de:'de-DE',fr:'fr-FR',es:'es-ES',no:'nb-NO',sv:'sv-SE',it:'it-IT'}[APP_LANG] || 'en-US'),
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 3
    }
  )} kWh`;
}
function formatApplianceDuration(ms){ const n=Number(ms); if(!Number.isFinite(n)||n<=0) return ''; const total=Math.max(0,Math.round(n/1000)); const h=Math.floor(total/3600); const m=Math.floor((total%3600)/60); const sec=total%60; const text=h>0?`${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`:`${m}:${String(sec).padStart(2,'0')}`; return ` · ${tt('Duur','Duration')}: ${text}`; }
function applianceStatusText(r){ const st=(config.applianceState&&config.applianceState[r.id])||{}; const status=st.status||'idle'; const power=typeof st.lastPower==='number'?` · ${Math.round(st.lastPower)}W`:''; const energy=formatApplianceKwh(st.finalEnergyKwh ?? st.energyKwh); const duration=formatApplianceDuration(st.finalDurationMs ?? st.durationMs); if(status==='running') return tt('Actief','Running')+power+duration+energy; if(status==='ready') return tt('Klaar / wacht op reset','Ready / waiting for reset')+power+duration+energy; return tt('Uit / idle','Off / idle')+power+energy; }
function summarizeApplianceRule(r){ const dev=(powerTargets()).find(d=>d.id===r.deviceId); return `${applianceTypeName(r.type)} · ${(dev&&dev.name)||tt('geen apparaat gekozen','no device selected')} · ${r.startThreshold||0}W → ${r.readyThreshold||0}W · ${applianceStatusText(r)}`; }
function renderApplianceRules(){ ensureApplianceState(); const h=document.getElementById('applianceRules'); if(!h) return; h.innerHTML=''; if(!config.applianceRules.length) h.appendChild(el('section',{class:'card'},[el('p',{text:tt('Nog geen apparaatmeldingen.', 'No appliance notifications yet.')})])); config.applianceRules.forEach((r,i)=>h.appendChild(renderApplianceRule(r,i))); }
function renderApplianceRule(r,i){ const type=buildSelect([{id:'washing_machine',name:tt('Wasmachine','Washing machine')},{id:'dryer',name:tt('Droger','Dryer')},{id:'dishwasher',name:tt('Vaatwasser','Dishwasher')},{id:'airfryer',name:'Airfryer'},{id:'other',name:tt('Overig','Other')}],[r.type||'washing_machine'],false); type.dataset.field='type'; type.addEventListener('change',()=>{ const d=defaultAppliance(type.value); r.type=type.value; r.startThreshold=d.startThreshold; r.startDelaySeconds=d.startDelaySeconds; r.readyThreshold=d.readyThreshold; r.readyDelaySeconds=d.readyDelaySeconds; renderApplianceRules(); }); const name=el('input',{value:r.name||'','data-field':'name'}); const device=buildSelect(powerTargets(),[r.deviceId||''],false); device.dataset.field='deviceId'; device.addEventListener('change',()=>{ collectApplianceRules(); renderApplianceRules(); }); const availableMotion=applianceZoneDevices(environment.motionDevices||[],r.deviceId); const availableContact=applianceZoneDevices(environment.contactDevices||[],r.deviceId); const availableLights=applianceZoneDevices(environment.lightDevices||[],r.deviceId).filter(d=>d.id!==r.deviceId); const selectedMotion=(r.resetMotionDeviceIds||[]).filter(id=>availableMotion.some(d=>d.id===id)); const selectedContact=(r.resetContactDeviceIds||[]).filter(id=>availableContact.some(d=>d.id===id)); const selectedLights=(r.resetLightDeviceIds||[]).filter(id=>availableLights.some(d=>d.id===id)); const statusInfo=el('p',{text:applianceStatusText(r)}); const start=el('input',{type:'number',min:'1',max:'5000',step:'1',value:String(r.startThreshold||10),'data-field':'startThreshold'}); const startDelay=el('input',{type:'number',min:'0',max:'600',step:'5',value:String(r.startDelaySeconds||30),'data-field':'startDelaySeconds'}); const ready=el('input',{type:'number',min:'0',max:'1000',step:'1',value:String(r.readyThreshold||3),'data-field':'readyThreshold'}); const readyDelay=el('input',{type:'number',min:'10',max:'7200',step:'10',value:String(r.readyDelaySeconds||180),'data-field':'readyDelaySeconds'}); const resetMode=buildSelect([{id:'manual',name:tt('Handmatig / bij nieuwe start','Manual / on new run')},{id:'activity',name:tt('Na activiteit','After activity')},{id:'timer',name:tt('Na vaste tijd','After fixed time')}],[r.resetMode||((r.resetAfterReadySeconds||0)>0?'timer':'manual')],false); resetMode.dataset.field='resetMode'; const reset=el('input',{type:'number',min:'0',max:'86400',step:'60',value:String(r.resetAfterReadySeconds||0),'data-field':'resetAfterReadySeconds'}); const resetMotion=buildSelect(availableMotion,selectedMotion,true); resetMotion.dataset.field='resetMotionDeviceIds'; const resetContact=buildSelect(availableContact,selectedContact,true); resetContact.dataset.field='resetContactDeviceIds'; const resetLights=buildSelect(availableLights,selectedLights,true); resetLights.dataset.field='resetLightDeviceIds'; const reminder=el('input',{type:'number',min:'60',max:'86400',step:'60',value:String(r.readyReminderSeconds||1800),'data-field':'readyReminderSeconds'}); const historyLimit=el('input',{type:'number',min:'1',max:'50',step:'1',value:String(r.historyLimit||20),'data-field':'historyLimit'}); const remove=el('button',{class:'btn-danger',type:'button',text:tt('Verwijderen','Delete')}); remove.addEventListener('click',()=>{ collectApplianceRules(); config.applianceRules.splice(i,1); renderApplianceRules(); }); return foldCard(r.id||`appliance-${i}`,r.name||applianceTypeName(r.type),summarizeApplianceRule(r),openApplianceIds,[fieldBlock(tt('Status','Status'),statusInfo),fieldBlock(tt('Naam','Name'),name),el('div',{class:'two'},[fieldBlock(tt('Type','Type'),type),fieldBlock(tt('Slimme stekker / apparaat','Smart plug / device'),device,tt('Kies een apparaat met stroommeting (measure_power).','Choose a device with power measurement (measure_power).'))]),el('div',{class:'three'},[fieldBlock(tt('Start boven watt','Start above watts'),start),fieldBlock(tt('Startvertraging sec.','Start delay sec.'),startDelay),fieldBlock(tt('Klaar onder watt','Ready below watts'),ready)]),el('div',{class:'two'},[fieldBlock(tt('Klaarvertraging sec.','Ready delay sec.'),readyDelay),fieldBlock(tt('Reset na klaar','Reset after ready'),resetMode,tt('Reset pas nadat het apparaat klaar is.','Reset only after the appliance is ready.'))]),el('div',{class:'three'},[fieldBlock(tt('Reset na sec.','Reset after sec.'),reset,tt('Alleen gebruikt bij vaste tijd. 0 = niet automatisch.','Only used for fixed time. 0 = no automatic reset.')),fieldBlock(tt('Reset bij beweging','Reset on motion'),resetMotion,tt('Alleen sensoren in dezelfde zone als het gekozen apparaat en onderliggende zones.','Only sensors in the same zone as the selected appliance and child zones.')),fieldBlock(tt('Reset bij deur open','Reset on door opened'),resetContact,tt('Alleen sensoren in dezelfde zone als het gekozen apparaat en onderliggende zones.','Only sensors in the same zone as the selected appliance and child zones.')),fieldBlock(tt('Reset bij lamp aan','Reset on light on'),resetLights,tt('Kies specifieke lampen in dezelfde zone als het gekozen apparaat en onderliggende zones.','Choose specific lights in the same zone as the selected appliance and child zones.'))]),checkbox('enabled',r.enabled,tt('Monitoring actief','Monitoring active')),checkbox('notifyOnStart',r.notifyOnStart,tt('Flow-trigger bij starten','Flow trigger when started')),checkbox('notifyOnReady',r.notifyOnReady!==false,tt('Flow-trigger als klaar','Flow trigger when ready')),checkbox('repeatReadyNotification',r.repeatReadyNotification,tt('Herhaal klaar-trigger tot reset','Repeat ready trigger until reset')),fieldBlock(tt('Herhaal elke sec.','Repeat every sec.'),reminder),fieldBlock(tt('Aantal geschiedenisregels','Number of history entries'),historyLimit,tt('Kies hoeveel afgeronde cycli worden onthouden (1-50).','Choose how many completed cycles are kept (1-50).')),checkbox('useTimelineNotification',r.useTimelineNotification,tt('Ook op Activiteiten-tijdlijn zetten','Also add to Activity timeline')),remove]); }
function collectApplianceRules(){ ensureApplianceState(); const cards=Array.from(document.querySelectorAll('#applianceRules [data-id]')); config.applianceRules=cards.map((card,i)=>{ const base=config.applianceRules[i]||{}; const get=f=>card.querySelector(`[data-field="${f}"]`); const selected=f=>Array.from(card.querySelectorAll(`[data-field="${f}"] option:checked`)).map(o=>o.value).filter(Boolean); return {...base,name:get('name')?.value||base.name||'',enabled:get('enabled')?get('enabled').checked:true,type:get('type')?.value||base.type||'washing_machine',deviceId:get('deviceId')?.value||base.deviceId||'',startThreshold:Number(get('startThreshold')?.value||base.startThreshold||10),startDelaySeconds:Number(get('startDelaySeconds')?.value||base.startDelaySeconds||30),readyThreshold:Number(get('readyThreshold')?.value||base.readyThreshold||3),readyDelaySeconds:Number(get('readyDelaySeconds')?.value||base.readyDelaySeconds||180),resetMode:get('resetMode')?.value||base.resetMode||'manual',resetAfterReadySeconds:Number(get('resetAfterReadySeconds')?.value||base.resetAfterReadySeconds||0),resetMotionDeviceIds:selected('resetMotionDeviceIds'),resetContactDeviceIds:selected('resetContactDeviceIds'),resetLightDeviceIds:selected('resetLightDeviceIds'),resetZoneActivity:false,repeatReadyNotification:get('repeatReadyNotification')?get('repeatReadyNotification').checked:false,readyReminderSeconds:Number(get('readyReminderSeconds')?.value||base.readyReminderSeconds||1800),notifyOnStart:get('notifyOnStart')?get('notifyOnStart').checked:false,notifyOnReady:get('notifyOnReady')?get('notifyOnReady').checked:true,useTimelineNotification:get('useTimelineNotification')?get('useTimelineNotification').checked:false,historyLimit:Number(get('historyLimit')?.value||base.historyLimit||20)}; }); return config.applianceRules; }
function addApplianceRule(){ ensureApplianceState(); const type='washing_machine'; const d=defaultAppliance(type); const rule={id:`appliance-${Date.now()}`,name:applianceTypeName(type),enabled:true,type,deviceId:(powerTargets()[0]&&powerTargets()[0].id)||'',...d,resetMode:'manual',resetAfterReadySeconds:0,resetMotionDeviceIds:[],resetContactDeviceIds:[],resetLightDeviceIds:[],resetZoneActivity:false,repeatReadyNotification:false,readyReminderSeconds:1800,notifyOnStart:false,notifyOnReady:true,useTimelineNotification:false,historyLimit:20}; config.applianceRules.push(rule); openApplianceIds.add(rule.id); renderApplianceRules(); showToast(tt('Apparaatmelding toegevoegd. Vergeet niet op Alles opslaan te klikken.', 'Appliance notification added. Do not forget to click Save all.')); }

function summarizeSchedule(r){ const modes=(r.modeIds||[]).map(id=>config.modes.find(m=>m.id===id)?.label||id).join(', ')||tt('alle modi','all modes'); let time=tt('om ','at ')+(r.fixedTime||'19:00'); if(r.timeMode==='random') time=tt('random','random')+' '+(r.randomFrom||'18:30')+'-'+(r.randomTo||'23:00'); if(r.timeMode==='sunrise') time=tt('zonsopkomst','sunrise')+formatOffset(r.sunOffsetMinutes||0); if(r.timeMode==='sunset') time=tt('zonsondergang','sunset')+formatOffset(r.sunOffsetMinutes||0); const lux=r.luxCondition?(' · lux '+(r.luxOperator==='above'?'>=':'<=')+' '+(r.luxThreshold||30)):''; const follow=(r.action==='on'&&r.autoOffEnabled)?(' · '+tt('uit:','off:')+' '+(r.autoOffMode==='time'?(r.autoOffTime||'23:00'):(r.autoOffAfterHours||1)+'h')):(r.action==='off'&&r.autoOnEnabled)?(' · '+tt('aan:','on:')+' '+(r.autoOnMode==='time'?(r.autoOnTime||'07:00'):(r.autoOnAfterHours||1)+'h')):''; const lightCount=(r.lights||[]).length; return `${r.action==='on'?tt('aan','on'):tt('uit','off')} · ${time}${follow}${lux} · ${modes} · ${(r.deviceIds||[]).length} ${tt('apparaten','devices')}${lightCount?` · ${lightCount} ${tt('licht','light')}`:''}`; }
function formatOffset(min){ min=Number(min||0); if(!min) return ''; return ' '+(min>0?'+':'')+min+' min'; }
function renderScheduleRules(){ const h=document.getElementById('scheduleRules'); h.innerHTML=''; if(!config.scheduleRules.length) h.appendChild(el('section',{class:'card'},[el('p',{text:tt('Nog geen planningen.', 'No schedules yet.')})])); config.scheduleRules.forEach((r,i)=>h.appendChild(renderScheduleRule(r,i))); }
function renderScheduleRule(r,i){ const name=el('input',{value:r.name||'','data-field':'name'}); const devices=buildSelect(ordinarySwitchTargets(r.deviceIds),r.deviceIds); devices.dataset.field='deviceIds'; const modes=buildSelect(config.modes.map(m=>({id:m.id,name:m.label})),r.modeIds); modes.dataset.field='modeIds'; const action=buildSelect([{id:'on',name:tt('Aan','On')},{id:'off',name:tt('Uit','Off')}],[r.action||'on'],false); action.dataset.field='action'; const timeMode=buildSelect([{id:'fixed',name:tt('Vaste tijd','Fixed time')},{id:'random',name:tt('Random tussen tijden','Random between times')},{id:'sunrise',name:tt('Zonsopkomst','Sunrise')},{id:'sunset',name:tt('Zonsondergang','Sunset')}],[r.timeMode||'fixed'],false); timeMode.dataset.field='timeMode'; const fixed=el('input',{type:'time',value:r.fixedTime||'19:00','data-field':'fixedTime'}); const randomFrom=el('input',{type:'time',value:r.randomFrom||'18:30','data-field':'randomFrom'}); const randomTo=el('input',{type:'time',value:r.randomTo||'23:00','data-field':'randomTo'}); const offset=el('input',{type:'number',min:'-720',max:'720',step:'1',value:String(r.sunOffsetMinutes||0),'data-field':'sunOffsetMinutes'}); const zone=buildSelect(environment.zones||[],[r.zoneId||''],false); zone.dataset.field='zoneId'; zone.addEventListener('change',()=>{ collectScheduleRules(); renderScheduleRules(); }); const include=checkbox('includeSubzones',r.includeSubzones,tt('Onderliggende subzones/kamers meenemen','Include subzones/rooms')); include.querySelector('input').addEventListener('change',()=>{ collectScheduleRules(); renderScheduleRules(); }); const luxDevices=buildSelect(devicesInZone(environment.luminanceDevices||[],r.zoneId,r.includeSubzones),r.luxDeviceIds||[]); luxDevices.dataset.field='luxDeviceIds'; const luxOperator=buildSelect([{id:'below',name:tt('lager dan of gelijk aan','below or equal to')},{id:'above',name:tt('hoger dan of gelijk aan','above or equal to')}],[r.luxOperator||'below'],false); luxOperator.dataset.field='luxOperator'; const luxThreshold=el('input',{type:'number',min:'0',max:'100000',step:'1',value:String(r.luxThreshold||30),'data-field':'luxThreshold'}); const days=buildSelect(DAYS,r.days||[0,1,2,3,4,5,6]); days.dataset.field='days'; const autoOffMode=buildSelect([{id:'hours',name:tt('Na X uur','After X hours')},{id:'time',name:tt('Op vaste tijd','At fixed time')},{id:'random_hours',name:tt('Random na X-Y uur','Random after X-Y hours')},{id:'random_time',name:tt('Random tussen tijden','Random between times')}],[r.autoOffMode||'hours'],false); autoOffMode.dataset.field='autoOffMode'; const autoOffHours=el('input',{type:'number',min:'0.1',max:'48',step:'0.1',value:String(r.autoOffAfterHours||1),'data-field':'autoOffAfterHours'}); const autoOffTime=el('input',{type:'time',value:r.autoOffTime||'23:00','data-field':'autoOffTime'}); const autoOffRandomFromHours=el('input',{type:'number',min:'0.1',max:'48',step:'0.1',value:String(r.autoOffRandomFromHours||0.5),'data-field':'autoOffRandomFromHours'}); const autoOffRandomToHours=el('input',{type:'number',min:'0.1',max:'48',step:'0.1',value:String(r.autoOffRandomToHours||2),'data-field':'autoOffRandomToHours'}); const autoOffRandomFromTime=el('input',{type:'time',value:r.autoOffRandomFromTime||'22:00','data-field':'autoOffRandomFromTime'}); const autoOffRandomToTime=el('input',{type:'time',value:r.autoOffRandomToTime||'23:30','data-field':'autoOffRandomToTime'}); const autoOnMode=buildSelect([{id:'hours',name:tt('Na X uur','After X hours')},{id:'time',name:tt('Op vaste tijd','At fixed time')},{id:'random_hours',name:tt('Random na X-Y uur','Random after X-Y hours')},{id:'random_time',name:tt('Random tussen tijden','Random between times')}],[r.autoOnMode||'hours'],false); autoOnMode.dataset.field='autoOnMode'; const autoOnHours=el('input',{type:'number',min:'0.1',max:'48',step:'0.1',value:String(r.autoOnAfterHours||1),'data-field':'autoOnAfterHours'}); const autoOnTime=el('input',{type:'time',value:r.autoOnTime||'07:00','data-field':'autoOnTime'}); const autoOnRandomFromHours=el('input',{type:'number',min:'0.1',max:'48',step:'0.1',value:String(r.autoOnRandomFromHours||0.5),'data-field':'autoOnRandomFromHours'}); const autoOnRandomToHours=el('input',{type:'number',min:'0.1',max:'48',step:'0.1',value:String(r.autoOnRandomToHours||2),'data-field':'autoOnRandomToHours'}); const autoOnRandomFromTime=el('input',{type:'time',value:r.autoOnRandomFromTime||'06:30','data-field':'autoOnRandomFromTime'}); const autoOnRandomToTime=el('input',{type:'time',value:r.autoOnRandomToTime||'08:00','data-field':'autoOnRandomToTime'}); const scheduleLightList=el('div',{class:'schedule-light-list','data-schedule':r.id},[]); for(const profile of (r.lights||[])) scheduleLightList.appendChild(createScheduleLightRow(r.id,profile)); const addScheduleLight=el('button',{class:'btn-secondary',type:'button',text:`+ ${tt('Lichtinstelling toevoegen','Add light setting')}`}); addScheduleLight.addEventListener('click',()=>scheduleLightList.appendChild(createScheduleLightRow(r.id,{on:true,dim:null,lightTemperature:null,hue:null,saturation:null,delaySeconds:0}))); const scheduleLightSection=el('section',{class:'card'},[el('h3',{text:tt('Lichtinstellingen','Light settings')}),el('p',{class:'hint',text:tt('Stel voor deze planning per lamp aan/uit, dimniveau, kleurtemperatuur, kleur en eventueel een vertraging in.','For this schedule, set on/off, dim level, color temperature, color and an optional delay per light.')}),scheduleLightList,addScheduleLight]); const remove=el('button',{class:'btn-danger',type:'button',text:tt('Verwijderen', 'Delete')}); remove.addEventListener('click',()=>{ collectScheduleRules(); config.scheduleRules.splice(i,1); renderScheduleRules(); }); return foldCard(r.id||`schedule-${i}`,r.name||tt('Planning','Schedule'),summarizeSchedule(r),openScheduleIds,[fieldBlock(tt('Naam','Name'),name),el('div',{class:'two'},[fieldBlock(tt('Actie','Action'),action),fieldBlock(tt('Alleen in modussen','Only in modes'),modes)]),fieldBlock(tt('Apparaten/lampen','Devices/lights'),devices),scheduleLightSection,el('div',{class:'three'},[fieldBlock(tt('Tijdtype','Time type'),timeMode),fieldBlock(tt('Vaste tijd','Fixed time'),fixed),fieldBlock(tt('Offset bij zon','Sun offset'),offset,tt('Minuten voor/na zonsopkomst of zonsondergang. Bijvoorbeeld -30 of 15.', 'Minutes before/after sunrise or sunset. For example -30 or 15.'))]),el('div',{class:'two'},[fieldBlock(tt('Random vanaf','Random from'),randomFrom),fieldBlock(tt('Random tot','Random until'),randomTo)]),fieldBlock(tt('Dagen','Days'),days,tt('Leeg betekent: alle dagen.', 'Empty means: every day.')),el('h3',{text:tt('Vervolgactie na uitvoeren','Follow-up action after running')}),checkbox('autoOffEnabled',r.autoOffEnabled,tt('Als deze planning inschakelt: automatisch weer uitzetten','When this schedule turns on: automatically switch off')),el('div',{class:'three'},[fieldBlock(tt('Uitzetten via','Switch off by'),autoOffMode),fieldBlock(tt('Na aantal uur uit','Switch off after hours'),autoOffHours),fieldBlock(tt('Uit om tijdstip','Switch off at time'),autoOffTime)]),el('div',{class:'two'},[fieldBlock(tt('Random na vanaf uur','Random after from hours'),autoOffRandomFromHours),fieldBlock(tt('Random na tot uur','Random after until hours'),autoOffRandomToHours)]),el('div',{class:'two'},[fieldBlock(tt('Random uit vanaf','Random off from'),autoOffRandomFromTime),fieldBlock(tt('Random uit tot','Random off until'),autoOffRandomToTime)]),checkbox('autoOnEnabled',r.autoOnEnabled,tt('Als deze planning uitschakelt: automatisch weer aanzetten','When this schedule turns off: automatically switch on')),el('div',{class:'three'},[fieldBlock(tt('Aanzetten via','Switch on by'),autoOnMode),fieldBlock(tt('Na aantal uur aan','Switch on after hours'),autoOnHours),fieldBlock(tt('Aan om tijdstip','Switch on at time'),autoOnTime)]),el('div',{class:'two'},[fieldBlock(tt('Random aan na vanaf uur','Random on after from hours'),autoOnRandomFromHours),fieldBlock(tt('Random aan na tot uur','Random on after until hours'),autoOnRandomToHours)]),el('div',{class:'two'},[fieldBlock(tt('Random aan vanaf','Random on from'),autoOnRandomFromTime),fieldBlock(tt('Random aan tot','Random on until'),autoOnRandomToTime)]),el('p',{class:'hint',text:tt('Automatisch uitzetten verschijnt alleen bij actie Aan. Automatisch aanzetten verschijnt alleen bij actie Uit.', 'Automatic switch-off is only shown for action On. Automatic switch-on is only shown for action Off.')}),el('h3',{text:tt('Lux voorwaarde','Lux condition')}),checkbox('luxCondition',r.luxCondition,tt('Alleen uitvoeren bij luxvoorwaarde','Only run when lux condition matches')),el('div',{class:'two'},[fieldBlock(tt('Zone/kamer voor lux','Zone/room for lux'),zone),el('div',{},[include])]),fieldBlock(tt('Luxsensoren','Lux sensors'),luxDevices,tt('Leeg laten = alle luxsensoren in deze zone.', 'Leave empty = all lux sensors in this zone.')),el('div',{class:'two'},[fieldBlock(tt('Voorwaarde','Condition'),luxOperator),fieldBlock(tt('Luxwaarde','Lux value'),luxThreshold)]),el('div',{},[checkbox('enabled',r.enabled,tt('Planning actief','Schedule active'))]),remove]); }
function collectScheduleRules(){ const cards=Array.from(document.querySelectorAll('#scheduleRules [data-id]')); config.scheduleRules=cards.map((card,i)=>{ const base=config.scheduleRules[i]||{}; const get=f=>card.querySelector(`[data-field="${f}"]`); return {...base,name:get('name')?.value||'',enabled:get('enabled')?get('enabled').checked:true,modeIds:get('modeIds')?selectedValues(get('modeIds')):[],deviceIds:get('deviceIds')?selectedValues(get('deviceIds')):[],action:get('action')?.value||'on',timeMode:get('timeMode')?.value||'fixed',fixedTime:get('fixedTime')?.value||'19:00',randomFrom:get('randomFrom')?.value||'18:30',randomTo:get('randomTo')?.value||'23:00',sunOffsetMinutes:Number(get('sunOffsetMinutes')?.value||0),autoOffEnabled:get('autoOffEnabled')?get('autoOffEnabled').checked:false,autoOffMode:get('autoOffMode')?.value||'hours',autoOffAfterHours:Number(get('autoOffAfterHours')?.value||1),autoOffTime:get('autoOffTime')?.value||'23:00',autoOffRandomFromHours:Number(get('autoOffRandomFromHours')?.value||0.5),autoOffRandomToHours:Number(get('autoOffRandomToHours')?.value||2),autoOffRandomFromTime:get('autoOffRandomFromTime')?.value||'22:00',autoOffRandomToTime:get('autoOffRandomToTime')?.value||'23:30',autoOnEnabled:get('autoOnEnabled')?get('autoOnEnabled').checked:false,autoOnMode:get('autoOnMode')?.value||'hours',autoOnAfterHours:Number(get('autoOnAfterHours')?.value||1),autoOnTime:get('autoOnTime')?.value||'07:00',autoOnRandomFromHours:Number(get('autoOnRandomFromHours')?.value||0.5),autoOnRandomToHours:Number(get('autoOnRandomToHours')?.value||2),autoOnRandomFromTime:get('autoOnRandomFromTime')?.value||'06:30',autoOnRandomToTime:get('autoOnRandomToTime')?.value||'08:00',zoneId:get('zoneId')?.value||'',includeSubzones:get('includeSubzones')?get('includeSubzones').checked:false,luxCondition:get('luxCondition')?get('luxCondition').checked:false,luxDeviceIds:get('luxDeviceIds')?selectedValues(get('luxDeviceIds')):[],luxOperator:get('luxOperator')?.value||'below',luxThreshold:Number(get('luxThreshold')?.value||30),days:get('days')?selectedValues(get('days')).map(Number):[0,1,2,3,4,5,6],lights:scheduleLightActionsFromDom(card.dataset.id,base.lights)}; }); return config.scheduleRules; }
function addScheduleRule(){ const rule={id:`schedule-${Date.now()}`,name:tt('Nieuwe planning','New schedule'),enabled:true,modeIds:config.modes.map(m=>m.id),deviceIds:[],action:'on',timeMode:'fixed',fixedTime:'19:00',randomFrom:'18:30',randomTo:'23:00',sunOffsetMinutes:0,autoOffEnabled:false,autoOffMode:'hours',autoOffAfterHours:1,autoOffTime:'23:00',autoOffRandomFromHours:0.5,autoOffRandomToHours:2,autoOffRandomFromTime:'22:00',autoOffRandomToTime:'23:30',autoOnEnabled:false,autoOnMode:'hours',autoOnAfterHours:1,autoOnTime:'07:00',autoOnRandomFromHours:0.5,autoOnRandomToHours:2,autoOnRandomFromTime:'06:30',autoOnRandomToTime:'08:00',zoneId:(environment.zones&&environment.zones[0]&&environment.zones[0].id)||'',includeSubzones:true,luxCondition:false,luxDeviceIds:[],luxOperator:'below',luxThreshold:30,days:[0,1,2,3,4,5,6],lights:[]}; config.scheduleRules.push(rule); openScheduleIds.add(rule.id); renderScheduleRules(); }


function activityDeviceList(){ ensureApplianceState(); const all=[...(environment.activityDevices||[]),...switchTargets(),...powerTargets(),...energyTargets(),...(environment.waterDevices||[]),...(environment.gasDevices||[]),...(environment.temperatureSensorDevices||[]),...(environment.humiditySensorDevices||[]),...(environment.motionDevices||[]),...(environment.contactDevices||[])]; const seen=new Set(); return all.filter(d=>d&&d.id&&!seen.has(d.id)&&seen.add(d.id)); }
function activityMeterDevices(kind){ ensureApplianceState(); if(kind==='energy') return energyTargets(); const caps={water:['meter_water','measure_water'],gas:['meter_gas','measure_gas']}[kind]||[]; return activityDeviceList().filter(d=>Array.isArray(d.capabilities)&&caps.some(c=>d.capabilities.includes(c))); }
function activityConditionOpenKey(ruleId, conditionId, index){ return String(ruleId||'')+':'+String(conditionId||index||0); }
function rememberOpenActivityConditions(){
  document.querySelectorAll('#activityRules .activity-condition').forEach(row=>{
    const activityCard=row.closest('#activityRules [data-id]');
    const ruleId=activityCard?.dataset?.id||'';
    const conditionId=row.dataset.conditionId||'';
    const index=row.dataset.conditionIndex||'0';
    const key=activityConditionOpenKey(ruleId,conditionId,index);
    if(row.open) openActivityConditionIds.add(key); else openActivityConditionIds.delete(key);
  });
}
function rerenderActivityRulesPreserveOpen(){ rememberOpenActivityConditions(); renderActivityRules(); }
function activityConditionTypes(){ return [{id:'water_above',name:tt('Water boven waarde','Water above value')},{id:'gas_above',name:tt('Gas boven waarde','Gas above value')},{id:'power_above',name:tt('Stroom boven watt','Power above watts')},{id:'temperature_above',name:tt('Temperatuur boven','Temperature above')},{id:'temperature_below',name:tt('Temperatuur onder','Temperature below')},{id:'temperature_rising',name:tt('Temperatuur stijgt','Temperature rising')},{id:'temperature_falling',name:tt('Temperatuur daalt','Temperature falling')},{id:'humidity_above',name:tt('Vochtigheid boven','Humidity above')},{id:'humidity_below',name:tt('Vochtigheid onder','Humidity below')},{id:'humidity_rising',name:tt('Vochtigheid stijgt','Humidity rising')},{id:'humidity_falling',name:tt('Vochtigheid daalt','Humidity falling')},{id:'device_on',name:tt('Apparaat staat aan','Device is on')},{id:'sensor_true',name:tt('Sensorwaarde is waar','Sensor value is true')},{id:'capability_above',name:tt('Meetwaarde boven','Capability above')},{id:'capability_below',name:tt('Meetwaarde onder','Capability below')},{id:'capability_equals',name:tt('Meetwaarde gelijk aan','Capability equals')},{id:'capability_custom',name:tt('Aangepaste capability','Custom capability')},{id:'activity_status',name:tt('Andere activiteit','Other activity')},{id:'zone_motion',name:tt('Zone actief','Zone active')},{id:'time_between',name:tt('Tijd tussen','Time between')},{id:'time_after',name:tt('Tijd na','Time after')},{id:'time_before',name:tt('Tijd voor','Time before')}]; }
function defaultCapabilityForActivityType(type, device){ if(type==='water_above')return device?.capabilities?.includes('measure_water')?'measure_water':'meter_water'; if(type==='gas_above')return device?.capabilities?.includes('measure_gas')?'measure_gas':'meter_gas'; if(type==='power_above')return (device?.capabilities||[]).find(c=>c==='measure_power'||c.startsWith('measure_power.'))||'measure_power'; if(type&&type.indexOf('temperature_')===0)return 'measure_temperature'; if(type&&type.indexOf('humidity_')===0)return 'measure_humidity'; if(type==='device_on')return (device?.capabilities||[]).find(c=>c==='onoff'||c.startsWith('onoff.'))||'onoff'; if(type==='sensor_true') return firstActivityBooleanCapability(device)||'alarm_motion'; if(type==='capability_custom') return device?.capabilities?.[0]||''; if(type==='time_between'||type==='time_after'||type==='time_before') return ''; return ''; }
function activityCapabilityOperators(){ return [{id:'above',name:'>'},{id:'above_or_equal',name:'>='},{id:'below',name:'<'},{id:'below_or_equal',name:'<='},{id:'equals',name:'='},{id:'not_equals',name:'!='},{id:'contains',name:tt('bevat','contains')},{id:'true',name:tt('is waar','is true')},{id:'false',name:tt('is onwaar','is false')}]; }
function defaultActivityOperatorForType(type){ if(type==='time_between'||type==='time_after'||type==='time_before')return 'time'; if(type==='activity_status')return 'true'; if(type==='capability_above')return 'above_or_equal'; if(type==='capability_below')return 'below_or_equal'; if(type==='capability_equals')return 'equals'; if(type==='device_on'||type==='sensor_true')return 'true'; return 'above_or_equal'; }
function firstActivityBooleanCapability(device){ const caps=device?.capabilities||[]; return ['onoff','alarm_motion','alarm_contact','alarm_generic','alarm_water','alarm_smoke','alarm_co','presence'].find(c=>caps.includes(c))||''; }
function deviceByActivityId(id){ return activityDeviceList().find(d=>d.id===id)||null; }
function renderActivityRules(){
  ensureApplianceState();
  const h=document.getElementById('activityRules');
  if(!h) return;
  h.innerHTML='';
  if(!config.activityRules.length){
    h.appendChild(el('section',{class:'card'},[el('p',{text:tt('Nog geen activiteiten ingesteld.','No activities configured yet.')})]));
    return;
  }
  config.activityRules.forEach((r,i)=>h.appendChild(renderActivityRule(r,i)));
  applyConditionalVisibility();
}
function activityRequiredCount(r){ return (r.conditions||[]).filter(c=>c && (c.requiredCondition===true || c.conditionRequired===true)).length; }
function renderActivityRule(r,i){
  r.conditions=Array.isArray(r.conditions)?r.conditions:[];
  const name=el('input',{value:r.name||'','data-field':'name'});
  const min=el('input',{type:'number',min:'1',max:String(Math.max(1,r.conditions.length)),value:String(Math.min(Math.max(1,Number(r.minConditions||1)),Math.max(1,r.conditions.length))),'data-field':'minConditions'});
  const limit=el('input',{type:'number',min:'1',max:'50',value:String(r.historyLimit||20),'data-field':'historyLimit'});
  const minHistory=el('input',{type:'number',min:'0',step:'1',value:String(r.minHistoryDurationSeconds||0),'data-field':'minHistoryDurationSeconds'});
  const waterMeter=buildSelect(activityMeterDevices('water'),[r.waterMeterDeviceId||''],false); waterMeter.dataset.field='waterMeterDeviceId';
  const energyMeter=buildSelect(activityMeterDevices('energy'),[r.energyMeterDeviceId||''],false); energyMeter.dataset.field='energyMeterDeviceId';
  const gasMeter=buildSelect(activityMeterDevices('gas'),[r.gasMeterDeviceId||''],false); gasMeter.dataset.field='gasMeterDeviceId';
  const state=(config.activityState&&config.activityState[r.id])||{};
  const hist=((config.activityHistory&&config.activityHistory[r.id])||[])[0];
  const live=(state.status==='active')?(' · '+formatDurationClient(state.durationMs||0)):'';
  const usage=' · '+Number(state.waterUsed||0).toFixed(2)+' L · '+Number(state.energyKwh||0).toFixed(3)+' kWh · '+Number(state.gasUsed||0).toFixed(3)+' m³';
  const statusText=(state.status==='active'?tt('Actief','Active'):tt('Stand-by','Standby'))+' · '+(state.trueConditions||0)+'/'+(state.requiredConditions||r.minConditions||1)+live+usage;
  const status=el('p',{text:statusText});
  const requiredCount=activityRequiredCount(r);
  const conditionBox=el('div',{class:'condition-list','data-field':'conditions'});
  if(r.conditions.length){ r.conditions.forEach((c,ci)=>conditionBox.appendChild(renderActivityCondition(c,ci,r))); }
  else { conditionBox.appendChild(el('div',{class:'activity-empty',text:tt('Nog geen voorwaarden. Voeg er minimaal één toe.','No conditions yet. Add at least one.')})); }
  const add=el('button',{type:'button',class:'btn-secondary',text:tt('Voorwaarde toevoegen','Add condition')});
  add.addEventListener('click',()=>{ collectActivityRules(); const target=config.activityRules[i]||r; target.conditions=target.conditions||[]; const newCondition={id:'condition-'+Date.now(),type:'power_above',deviceId:'',capabilityId:'measure_power',threshold:10,value:true,requiredCondition:false,requiredActiveSeconds:0,inactiveDelaySeconds:0}; target.conditions.push(newCondition); openActivityIds.add(target.id); openActivityConditionIds.add(activityConditionOpenKey(target.id,newCondition.id,target.conditions.length-1)); renderActivityRules(); });
  const del=el('button',{type:'button',class:'btn-danger',text:tt('Verwijderen','Delete')});
  del.addEventListener('click',()=>{ collectActivityRules(); config.activityRules.splice(i,1); renderActivityRules(); });
  const last=hist?el('p',{class:'hint',text:tt('Laatste sessie','Last session')+': '+formatDurationClient(hist.durationMs||0)+' · '+Number(hist.waterUsed||0).toFixed(2)+' L · '+Number(hist.energyKwh||0).toFixed(3)+' kWh · '+Number(hist.gasUsed||0).toFixed(3)+' m³'}):el('p',{class:'hint',text:tt('Nog geen sessiehistorie.','No session history yet.')});
  const metrics=el('div',{class:'activity-metrics'},[
    el('span',{class:'activity-metric',text:(state.status==='active'?'🟢 ':'⚪ ')+statusText.split(' · ')[0]}),
    el('span',{class:'activity-metric',text:'✓ '+(r.minConditions||1)+'/'+Math.max(1,r.conditions.length)+' '+tt('voorwaarden','conditions')}),
    el('span',{class:'activity-metric',text:'⭐ '+requiredCount+' '+tt('verplicht','required')})
  ]);
  return foldCard(r.id||`activity-${i}`,r.name||tt('Nieuwe activiteit','New activity'),`${r.minConditions||1}/${r.conditions.length||1} ${tt('voorwaarden','conditions')} · ⭐ ${requiredCount}`,openActivityIds,[
    metrics,
    el('div',{class:'activity-section'},[
      el('h3',{text:tt('Basis','Basics')}),
      fieldBlock(tt('Status','Status'),status),
      last,
      fieldBlock(tt('Naam','Name'),name),
      checkbox('enabled',r.enabled!==false,tt('Activiteit actief','Activity active'))
    ]),
    el('div',{class:'activity-section'},[
      el('h3',{text:tt('Gedrag','Behaviour')}),
      el('div',{class:'three'},[
        fieldBlock(tt('Start bij aantal ware voorwaarden','Start at true conditions'),min,tt('Verplichte voorwaarden moeten altijd waar zijn. Dit aantal geldt voor alle voorwaarden samen.','Required conditions must always be true. This number applies to all conditions together.')),
        fieldBlock(tt('Historie aantal sessies','History sessions'),limit),
        fieldBlock(tt('Min. duur voor historie (sec)','Min. duration for history (sec)'),minHistory,tt('0 = elke sessie bewaren. Kortere sessies worden niet aan de geschiedenis toegevoegd.','0 = save every session. Shorter sessions are not added to history.'))
      ])
    ]),
    el('div',{class:'activity-section'},[
      el('h3',{text:tt('Voorwaarden','Conditions')}),
      el('p',{class:'hint',text:tt('Klik een voorwaarde open. Alleen velden die nodig zijn voor het gekozen type worden getoond.','Open a condition. Only fields needed for the selected type are shown.')}),
      conditionBox,
      add
    ]),
    el('details',{class:'activity-section'},[
      el('summary',{text:tt('Meetbronnen voor verbruik','Usage meter sources')}),
      el('p',{class:'hint',text:tt('Deze meters tellen alleen verbruik tijdens de activiteit. Ze zijn geen voorwaarde om de activiteit te starten of stoppen.','These meters only register usage during the activity. They are not conditions for starting or stopping the activity.')}),
      el('div',{class:'three'},[
        fieldBlock(tt('Watermeter','Water meter'),waterMeter,tt('Optioneel. Gebruik bijvoorbeeld je watermeter voor liters per sessie.','Optional. Use your water meter for litres per session.')),
        fieldBlock(tt('kWh-meter / stroombron','kWh meter / power source'),energyMeter,tt('Optioneel. Gebruikt meter_power of integreert measure_power.','Optional. Uses meter_power or integrates measure_power.')),
        fieldBlock(tt('Gasmeter','Gas meter'),gasMeter,tt('Optioneel. Gebruik je gasmeter voor m³ per sessie zonder gas als voorwaarde te gebruiken.','Optional. Use your gas meter for m³ per session without using gas as a condition.'))
      ])
    ]),
    el('div',{class:'condition-actions'},[del])
  ]);
}
function formatDurationClient(ms){ ms=Math.max(0,Number(ms||0)); const s=Math.floor(ms/1000); const h=Math.floor(s/3600); const m=Math.floor((s%3600)/60); const sec=s%60; return h>0?`${h}u ${String(m).padStart(2,'0')}m`:`${m}m ${String(sec).padStart(2,'0')}s`; }
function formatDurationLongClient(ms){ ms=Math.max(0,Number(ms||0)); const total=Math.floor(ms/1000); const h=Math.floor(total/3600); const m=Math.floor((total%3600)/60); const sec=total%60; const parts=[]; if(h) parts.push(`${h} uur`); if(h||m) parts.push(`${m} min`); parts.push(`${sec} sec`); return parts.join(' '); }
function activityOptionsForCondition(currentRule){
  return (config.activityRules||[])
    .filter(a=>a && a.id && (!currentRule || a.id!==currentRule.id))
    .map(a=>({id:a.id,name:a.name||tt('Activiteit','Activity')}));
}
function activityConditionSummary(c){
  const typeName=(activityConditionTypes().find(x=>x.id===(c.type||'power_above'))||{}).name||c.type||'';
  const req=(c.requiredCondition===true || c.conditionRequired===true)?' ⭐':'';
  if(c.type==='activity_status'){
    const target=(config.activityRules||[]).find(a=>a.id===(c.activityId||c.deviceId||c.value));
    return typeName+' · '+(target?(target.name||target.id):tt('Kies activiteit','Choose activity'))+' · '+((c.status==='inactive'||c.operator==='false'||c.value===false)?tt('niet actief','inactive'):tt('actief','active'))+req;
  }
  if(c.type==='zone_motion'){
    const zone=(environment.zones||[]).find(z=>z.id===c.zoneId);
    return typeName+' · '+(zone?(zone.name||zone.id):tt('Kies zone','Choose zone'))+' · '+((c.status==='inactive'||c.operator==='false'||c.value===false)?tt('niet actief','inactive'):tt('actief','active'))+(c.includeSubzones?' · '+tt('incl. subzones','incl. subzones'):'')+req;
  }
  if(c.type==='time_between') return typeName+' · '+(c.startTime||'18:00')+' - '+(c.endTime||'20:00')+req;
  if(c.type==='time_after') return typeName+' · '+tt('na','after')+' '+(c.startTime||'18:00')+req;
  if(c.type==='time_before') return typeName+' · '+tt('voor','before')+' '+(c.endTime||'20:00')+req;
  const dev=deviceByActivityId(c.deviceId);
  return typeName+(dev?' · '+dev.name:'')+(c.threshold!==undefined?' · '+c.threshold:'')+req;
}
function conditionMainLabel(c){
  const typeName=(activityConditionTypes().find(x=>x.id===(c.type||'power_above'))||{}).name||c.type||'';
  if(c.type==='activity_status'){
    const target=(config.activityRules||[]).find(a=>a.id===(c.activityId||c.deviceId||c.value));
    return (target?(target.name||target.id):tt('Andere activiteit','Other activity'));
  }
  if(c.type==='zone_motion'){
    const zone=(environment.zones||[]).find(z=>z.id===c.zoneId);
    return zone?(zone.name||zone.id):tt('Zone actief','Zone active');
  }
  if((c.type||'').startsWith('time_')) return typeName;
  const dev=deviceByActivityId(c.deviceId);
  return dev?dev.name:typeName;
}
function renderActivityCondition(c,ci,rule){
  const details=el('details',{class:'card activity-condition','data-condition-index':String(ci),'data-condition-id':String(c.id||'')});
  details.open = openActivityConditionIds.has(activityConditionOpenKey(rule.id,c.id,ci));
  const selectedDevice=deviceByActivityId(c.deviceId);
  const type=buildSelect(activityConditionTypes(),[c.type||'power_above'],false); type.dataset.field='conditionType';
  const dev=buildSelect(activityDeviceList(),[c.deviceId||''],false); dev.dataset.field='conditionDeviceId';
  const activitySelect=buildSelect(activityOptionsForCondition(rule),[c.activityId||c.deviceId||c.value||''],false); activitySelect.dataset.field='conditionActivityId';
  const activityStatus=buildSelect([{id:'active',name:tt('Is actief','Is active')},{id:'inactive',name:tt('Is niet actief','Is not active')}],[c.status || ((c.operator==='false'||c.value===false||String(c.value).toLowerCase()==='false')?'inactive':'active')],false); activityStatus.dataset.field='conditionActivityStatus';
  const zoneSelect=buildSelect(environment.zones||[],[c.zoneId||''],false); zoneSelect.dataset.field='conditionZoneId';
  const zoneStatus=buildSelect([{id:'active',name:tt('Zone is actief','Zone is active')},{id:'inactive',name:tt('Zone is niet actief','Zone is not active')}],[c.status || ((c.operator==='false'||c.value===false||String(c.value).toLowerCase()==='false')?'inactive':'active')],false); zoneStatus.dataset.field='conditionZoneStatus';
  const zoneIncludeSubzones=checkbox('conditionIncludeSubzones',c.includeSubzones===true,tt('Onderliggende subzones/kamers meenemen','Include subzones/rooms'));
  const capabilityOptions=(selectedDevice?.capabilities||[]).map(id=>({id,name:id}));
  const fallbackCap=c.capabilityId||defaultCapabilityForActivityType(c.type,selectedDevice);
  const capSelect=buildSelect(capabilityOptions.length?capabilityOptions:[{id:fallbackCap,name:fallbackCap||tt('Automatisch','Automatic')}],[fallbackCap],false); capSelect.dataset.field='conditionCapabilityId';
  const operator=buildSelect(activityCapabilityOperators(),[c.operator||defaultActivityOperatorForType(c.type)],false); operator.dataset.field='conditionOperator';
  const th=el('input',{type:'number',step:'0.1',value:String(c.threshold??0),'data-field':'conditionThreshold'});
  const delta=el('input',{type:'number',step:'0.1',min:'0',value:String(c.delta??1),'data-field':'conditionDelta'});
  const win=el('input',{type:'number',step:'5',min:'5',value:String(c.windowSeconds??300),'data-field':'conditionWindowSeconds'});
  const required=el('input',{type:'number',step:'1',min:'0',value:String(c.requiredActiveSeconds??0),'data-field':'conditionRequiredActiveSeconds'});
  const inactive=el('input',{type:'number',step:'1',min:'0',value:String(c.inactiveDelaySeconds??0),'data-field':'conditionInactiveDelaySeconds'});
  const mustBeTrue=checkbox('conditionRequired',c.requiredCondition===true || c.conditionRequired===true,tt('Verplichte voorwaarde','Required condition'));
  const val=el('input',{value:String(c.value===undefined?true:c.value),'data-field':'conditionValue'});
  const start=el('input',{type:'time',value:c.startTime||c.timeFrom||'18:00','data-field':'conditionStartTime'});
  const end=el('input',{type:'time',value:c.endTime||c.timeTo||'20:00','data-field':'conditionEndTime'});
  const del=el('button',{type:'button',class:'btn-danger',text:tt('Verwijderen','Delete')});
  del.addEventListener('click',()=>{ collectActivityRules(); const target=config.activityRules.find(x=>x.id===rule.id)||rule; target.conditions.splice(ci,1); rerenderActivityRulesPreserveOpen(); });
  type.addEventListener('change',()=>{ collectActivityRules(); const target=config.activityRules.find(x=>x.id===rule.id)||rule; if(target.conditions&&target.conditions[ci]){ target.conditions[ci].type=type.value; target.conditions[ci].operator=defaultActivityOperatorForType(type.value); target.conditions[ci].capabilityId=defaultCapabilityForActivityType(type.value,deviceByActivityId(target.conditions[ci].deviceId)); } rerenderActivityRulesPreserveOpen(); });
  dev.addEventListener('change',()=>{ collectActivityRules(); rerenderActivityRulesPreserveOpen(); });
  activitySelect.addEventListener('change',()=>{ collectActivityRules(); rerenderActivityRulesPreserveOpen(); });
  activityStatus.addEventListener('change',()=>{ collectActivityRules(); rerenderActivityRulesPreserveOpen(); });
  zoneSelect.addEventListener('change',()=>{ collectActivityRules(); rerenderActivityRulesPreserveOpen(); });
  zoneStatus.addEventListener('change',()=>{ collectActivityRules(); rerenderActivityRulesPreserveOpen(); });
  zoneIncludeSubzones.querySelector('input').addEventListener('change',()=>{ collectActivityRules(); rerenderActivityRulesPreserveOpen(); });
  const t=c.type||'power_above';
  const isTime=t==='time_between'||t==='time_after'||t==='time_before';
  const isTrend=t==='temperature_rising'||t==='temperature_falling'||t==='humidity_rising'||t==='humidity_falling';
  const isSimpleBool=t==='device_on'||t==='sensor_true';
  const isCustom=t==='capability_custom'||t==='capability_equals';
  const isActivity=t==='activity_status';
  const isZone=t==='zone_motion';
  const badges=[];
  if(c.requiredCondition===true || c.conditionRequired===true) badges.push(el('span',{class:'condition-badge',text:'⭐ '+tt('Verplicht','Required')}));
  if(Number(c.requiredActiveSeconds||0)>0) badges.push(el('span',{class:'condition-badge',text:'⏱ '+c.requiredActiveSeconds+'s'}));
  if(Number(c.inactiveDelaySeconds||0)>0) badges.push(el('span',{class:'condition-badge',text:'↘ '+c.inactiveDelaySeconds+'s'}));
  const summary=el('summary',{},[
    el('span',{class:'condition-title'},[
      el('span',{class:'condition-name',text:(ci+1)+'. '+conditionMainLabel(c)}),
      el('span',{class:'condition-meta',text:activityConditionSummary(c)})
    ]),
    el('span',{class:'condition-badges'},badges)
  ]);
  details.appendChild(summary);
  const body=el('div',{class:'condition-body'});
  if(isZone){
    body.appendChild(el('div',{class:'three'},[fieldBlock(tt('Type','Type'),type),fieldBlock(tt('Zone/kamer','Zone/room'),zoneSelect),fieldBlock(tt('Status','Status'),zoneStatus)]));
    body.appendChild(zoneIncludeSubzones);
    body.appendChild(el('p',{class:'hint',text:tt('Een zone is actief zodra minimaal één bewegingssensor in de gekozen zone beweging meldt. Bij niet actief moeten alle bewegingssensoren in de zone inactief zijn.','A zone is active when at least one motion sensor in the selected zone reports motion. For inactive, all motion sensors in the zone must be inactive.')}));
  } else {
    body.appendChild(el('div',{class:'three'},[fieldBlock(tt('Type','Type'),type), isActivity?fieldBlock(tt('Activiteit','Activity'),activitySelect):fieldBlock(tt('Apparaat/sensor','Device/sensor'),dev), isActivity?fieldBlock(tt('Status','Status'),activityStatus):fieldBlock(tt('Capability','Capability'),capSelect)]));
  }
  if(isActivity){
    body.appendChild(el('p',{class:'hint',text:tt('Gebruik dit om bijvoorbeeld Douchen alleen te starten als Bewatering niet actief is. De huidige activiteit kan zichzelf niet als voorwaarde gebruiken.','Use this for example to start Shower only when Irrigation is not active. The current activity cannot use itself as a condition.')}));
  } else if(isZone){
    // Zone fields are rendered above.
  } else if(isTime){
    const timeFields=[];
    if(t==='time_between'||t==='time_after') timeFields.push(fieldBlock(tt('Starttijd','Start time'),start));
    if(t==='time_between'||t==='time_before') timeFields.push(fieldBlock(tt('Eindtijd','End time'),end));
    body.appendChild(el('div',{class:'three'},timeFields));
  } else {
    const compareFields=[];
    if(!isSimpleBool) compareFields.push(fieldBlock(tt('Vergelijking','Comparison'),operator));
    if(!isSimpleBool && !isCustom) compareFields.push(fieldBlock(tt('Grenswaarde','Threshold'),th));
    if(isCustom) compareFields.push(fieldBlock(tt('Waarde','Value'),val));
    if(compareFields.length) body.appendChild(el('div',{class:'three'},compareFields));
    if(isTrend){ body.appendChild(el('div',{class:'two'},[fieldBlock(tt('Stijging/daling minimaal','Minimum rise/fall'),delta),fieldBlock(tt('Periode in seconden','Period in seconds'),win)])); }
  }
  body.appendChild(el('details',{class:'condition-advanced'},[
    el('summary',{text:tt('Geavanceerd','Advanced')}),
    el('div',{class:'condition-advanced-body'},[
      el('div',{class:'two'},[
        fieldBlock(tt('Waar gedurende (sec)','True for (sec)'),required,tt('De voorwaarde telt pas mee als deze zo lang onafgebroken waar is. 0 = direct.','The condition only counts after being true for this many seconds. 0 = immediately.')),
        fieldBlock(tt('Niet actief na (sec)','Inactive after (sec)'),inactive,tt('De voorwaarde blijft nog zo lang meetellen nadat deze niet meer waar is. 0 = direct stoppen.','The condition keeps counting for this many seconds after it is no longer true. 0 = stop immediately.'))
      ]),
      mustBeTrue,
      el('p',{class:'hint',text:tt('Verplicht betekent: deze voorwaarde moet waar zijn, naast het minimale aantal voorwaarden.','Required means: this condition must be true, in addition to the minimum number of conditions.')})
    ])
  ]));
  body.appendChild(el('div',{class:'condition-actions'},[del]));
  body.appendChild(el('p',{class:'hint',text:tt('Alleen de velden die nodig zijn voor dit type voorwaarde worden getoond.','Only the fields needed for this condition type are shown.')}));
  details.appendChild(body);
  return details;
}
function collectActivityRules(){
  ensureApplianceState();
  const cards=Array.from(document.querySelectorAll('#activityRules [data-id]'));
  config.activityRules=cards.map((card,i)=>{
    const base=config.activityRules[i]||{};
    const conditions=Array.from(card.querySelectorAll('.activity-condition')).map((row,ci)=>{
      const type=row.querySelector('[data-field="conditionType"]')?.value||'power_above';
      const deviceId=row.querySelector('[data-field="conditionDeviceId"]')?.value||'';
      const device=deviceByActivityId(deviceId);
      const rawCap=row.querySelector('[data-field="conditionCapabilityId"]')?.value||'';
      const activityId=row.querySelector('[data-field="conditionActivityId"]')?.value||'';
      const activityStatus=row.querySelector('[data-field="conditionActivityStatus"]')?.value||'active';
      const zoneId=row.querySelector('[data-field="conditionZoneId"]')?.value||'';
      const zoneStatus=row.querySelector('[data-field="conditionZoneStatus"]')?.value||'active';
      const includeSubzones=row.querySelector('[data-field="conditionIncludeSubzones"]')?.checked===true;
      const requiredCondition=row.querySelector('[data-field="conditionRequired"]')?.checked===true;
      const status=type==='zone_motion'?zoneStatus:activityStatus;
      return {id:(base.conditions&&base.conditions[ci]&&base.conditions[ci].id)||('condition-'+Date.now()+'-'+ci),type,deviceId:type==='activity_status'?activityId:deviceId,activityId,zoneId,includeSubzones,status,capabilityId:rawCap||defaultCapabilityForActivityType(type,device),threshold:Number(row.querySelector('[data-field="conditionThreshold"]')?.value||0),operator:(type==='activity_status'||type==='zone_motion')?(status==='inactive'?'false':'true'):(row.querySelector('[data-field="conditionOperator"]')?.value||defaultActivityOperatorForType(type)),delta:Number(row.querySelector('[data-field="conditionDelta"]')?.value||1),windowSeconds:Number(row.querySelector('[data-field="conditionWindowSeconds"]')?.value||300),requiredActiveSeconds:Number(row.querySelector('[data-field="conditionRequiredActiveSeconds"]')?.value||0),inactiveDelaySeconds:Number(row.querySelector('[data-field="conditionInactiveDelaySeconds"]')?.value||0),requiredCondition,conditionRequired:requiredCondition,required:requiredCondition,startTime:row.querySelector('[data-field="conditionStartTime"]')?.value||'18:00',endTime:row.querySelector('[data-field="conditionEndTime"]')?.value||'20:00',value:(type==='activity_status'||type==='zone_motion')?(status==='active'):((row.querySelector('[data-field="conditionValue"]')?.value)||true)};
    });
    const min=Math.max(1,Math.min(Number(card.querySelector('[data-field="minConditions"]')?.value||1),Math.max(1,conditions.length)));
    return {...base,id:card.dataset.id||base.id||('activity-'+Date.now()),name:card.querySelector('[data-field="name"]')?.value||'',enabled:card.querySelector('[data-field="enabled"]')?.checked!==false,minConditions:min,historyLimit:Number(card.querySelector('[data-field="historyLimit"]')?.value||20),minHistoryDurationSeconds:Number(card.querySelector('[data-field="minHistoryDurationSeconds"]')?.value||0),waterMeterDeviceId:card.querySelector('[data-field="waterMeterDeviceId"]')?.value||'',energyMeterDeviceId:card.querySelector('[data-field="energyMeterDeviceId"]')?.value||'',gasMeterDeviceId:card.querySelector('[data-field="gasMeterDeviceId"]')?.value||'',conditions};
  });
  return config.activityRules;
}
function addActivityRule(){ openCreateActivityModal(); }


const EXPORT_SECTIONS=[{id:'subModes',labelNl:'Submodussen',labelEn:'Sub modes'},{id:'rules',labelNl:'Modusregels',labelEn:'Mode rules'},{id:'zoneRules',labelNl:'Zoneregels',labelEn:'Zone rules'},{id:'temperatureRules',labelNl:'Temperatuurregels',labelEn:'Temperature rules'},{id:'applianceRules',labelNl:'Apparaat monitoring',labelEn:'Appliance monitoring'},{id:'activityRules',labelNl:'Activiteit monitoring',labelEn:'Activity monitoring'},{id:'scheduleRules',labelNl:'Planning',labelEn:'Schedule'},{id:'autoMode',labelNl:'Automatische modus',labelEn:'Automatic mode'},{id:'displaySettings',labelNl:'Weergave huidige modus',labelEn:'Current mode display'},{id:'modeSwitchDeviceRules',labelNl:'Mode & Switch device acties',labelEn:'Mode & Switch device actions'}];
let pendingImportData=null;
function sectionLabel(section){ return tt(section.labelNl,section.labelEn); }
function renderExportImport(){ const exportBox=document.getElementById('exportSectionList'); const importBox=document.getElementById('importSectionList'); if(exportBox&&!exportBox.dataset.rendered){ exportBox.dataset.rendered='1'; EXPORT_SECTIONS.forEach(section=>exportBox.appendChild(checkbox('export_'+section.id,true,sectionLabel(section)))); } if(importBox&&!importBox.dataset.rendered){ importBox.dataset.rendered='1'; EXPORT_SECTIONS.forEach(section=>importBox.appendChild(checkbox('import_'+section.id,true,sectionLabel(section)))); } }
function selectedSectionIds(prefix){ return EXPORT_SECTIONS.filter(section=>document.querySelector('[data-field="'+prefix+section.id+'"]')?.checked).map(section=>section.id); }
function cloneData(value){ return JSON.parse(JSON.stringify(value)); }
function buildExportData(sectionIds){ collectSubModes(); collectZoneRules(); collectTemperatureRules(); collectApplianceRules(); collectActivityRules(); collectScheduleRules(); collectAutoMode(); const data={meta:{app:'com.eevoosten.modeswitch',name:'Mode Switch',version: '3.1.21',exportedAt:new Date().toISOString()},sections:{}}; sectionIds.forEach(id=>{ data.sections[id]=cloneData(config[id] ?? (id==='rules'?{}:[])); }); return data; }
async function copyExportJson(){
  renderExportImport();
  const sectionIds=selectedSectionIds('export_');
  if(!sectionIds.length){ showToast(tt('Kies minimaal 1 onderdeel om te exporteren.','Select at least 1 section to export.'),'error'); return; }
  const json=JSON.stringify(buildExportData(sectionIds),null,2);
  const area=document.getElementById('exportDownloadArea');
  if(area){
    area.innerHTML='';
    const hint=document.createElement('div');
    hint.className='hint';
    hint.textContent=tt('JSON staat klaar. Kopieer via de knop of handmatig vanuit het tekstveld hieronder.','JSON is ready. Copy it with the button or manually from the text field below.');
    area.appendChild(hint);
    const box=document.createElement('textarea');
    box.value=json;
    box.readOnly=true;
    box.style.display='block';
    box.style.width='100%';
    box.style.minHeight='260px';
    box.style.marginTop='10px';
    area.appendChild(box);
    box.focus();
    box.select();
    try{ await navigator.clipboard.writeText(json); showToast(tt('JSON gekopieerd naar klembord.','JSON copied to clipboard.')); }catch(e){ showToast(tt('Selecteer en kopieer de JSON handmatig.','Select and copy the JSON manually.')); }
  }
}

function updateImportPreview(data){ const preview=document.getElementById('importPreview'); const keys=Object.keys(data?.sections||{}); if(preview) preview.textContent=keys.length ? tt('Gevonden onderdelen: ','Found sections: ')+keys.map(id=>sectionLabel(EXPORT_SECTIONS.find(s=>s.id===id)||{labelNl:id,labelEn:id})).join(', ') : tt('Geen geldige onderdelen gevonden.','No valid sections found.'); EXPORT_SECTIONS.forEach(section=>{ const cb=document.querySelector('[data-field="import_'+section.id+'"]'); if(cb){ cb.disabled=!keys.includes(section.id); cb.checked=keys.includes(section.id); } }); }
function readFileAsText(file){ return new Promise((resolve,reject)=>{ try{ if(file && typeof file.text==='function'){ file.text().then(resolve).catch(()=>{ const reader=new FileReader(); reader.onload=()=>resolve(String(reader.result||'')); reader.onerror=()=>reject(reader.error||new Error('Kan bestand niet lezen.')); reader.readAsText(file); }); return; } const reader=new FileReader(); reader.onload=()=>resolve(String(reader.result||'')); reader.onerror=()=>reject(reader.error||new Error('Kan bestand niet lezen.')); reader.readAsText(file); }catch(e){ reject(e); } }); }
function loadImportJsonText(text){ const data=JSON.parse(String(text||'')); if(!data||typeof data!=='object'||!data.sections||typeof data.sections!=='object') throw new Error(tt('Geen geldig Mode Switch exportbestand.','Not a valid Mode Switch export file.')); pendingImportData=data; updateImportPreview(data); return data; }
async function handleImportFile(event){ const file=event.target.files&&event.target.files[0]; if(!file) return; try{ const text=await readFileAsText(file); const ta=document.getElementById('importJsonText'); if(ta) ta.value=text; loadImportJsonText(text); showToast(tt('Importbestand geladen. Kies onderdelen en klik op import toepassen.','Import file loaded. Select sections and apply import.')); }catch(e){ pendingImportData=null; updateImportPreview(null); showToast(e.message||String(e),'error'); } }
async function applyImport(){
  const btn=document.getElementById('importBtn');
  if(btn) btn.disabled=true;
  try{
    if(!pendingImportData){
      const text=(document.getElementById('importJsonText')?.value||'').trim();
      if(text) loadImportJsonText(text);
    }
    if(!pendingImportData){ showToast(tt('Kies eerst een importbestand of plak JSON.','Choose an import file first or paste JSON.'),'error'); return; }
    const ids=selectedSectionIds('import_').filter(id=>Object.prototype.hasOwnProperty.call(pendingImportData.sections,id));
    if(!ids.length){ showToast(tt('Kies minimaal 1 onderdeel om te importeren.','Select at least 1 section to import.'),'error'); return; }
    const preview=document.getElementById('importPreview');
    if(preview) preview.textContent=tt('Import wordt toegepast...','Applying import...');
    const result=await api('POST','/import',{ids,sections:pendingImportData.sections});
    await loadData();
    if(preview) preview.textContent=tt('Import toegepast: ','Import applied: ')+(result.imported||ids).map(id=>sectionLabel(EXPORT_SECTIONS.find(s=>s.id===id)||{labelNl:id,labelEn:id})).join(', ');
    showToast(tt('Import toegepast.','Import applied.'));
  }catch(e){
    showToast(e.message||String(e),'error');
    const preview=document.getElementById('importPreview');
    if(preview) preview.textContent=tt('Import mislukt: ','Import failed: ')+(e.message||String(e));
  }finally{
    if(btn) btn.disabled=false;
  }
}
function normalizeSleepPowerRules(auto){
  const s=auto||{};
  const existing=Array.isArray(s.sleepPowerRules)?s.sleepPowerRules:[];
  if(existing.length){
    return existing.map(r=>({
      id:r.id||('spr_'+Date.now()+'_'+Math.random().toString(16).slice(2)),
      deviceId:r.deviceId||'',
      operator:r.operator==='above'?'above':'below',
      watt:Number(r.watt ?? (r.operator==='above'?s.sleepPowerAbove:s.sleepPowerBelow) ?? 0)
    }));
  }
  const ids=Array.isArray(s.sleepPowerDeviceIds)?s.sleepPowerDeviceIds:[];
  if(ids.length){
    const rules=[];
    const below=Number(s.sleepPowerBelow||0);
    const above=Number(s.sleepPowerAbove||0);
    ids.forEach(id=>{
      if(below>0) rules.push({id:'spr_'+id+'_below',deviceId:id,operator:'below',watt:below});
      if(above>0) rules.push({id:'spr_'+id+'_above',deviceId:id,operator:'above',watt:above});
    });
    return rules;
  }
  return [];
}
function renderSleepPowerRules(auto){
  const rules=normalizeSleepPowerRules(auto);
  const wrap=el('div',{id:'sleepPowerRules','data-field':'sleepPowerRules'});
  const list=el('div',{class:'rule-list compact'});
  if(!rules.length){
    list.appendChild(el('div',{class:'hint',text:tt('Nog geen stopcontactregels. Voeg per stopcontact onder/boven + wattage toe.','No socket rules yet. Add below/above + wattage per socket.')}));
  }
  rules.forEach(rule=>{
    const row=el('div',{class:'rule-row sleep-power-rule','data-rule-id':rule.id});
    const device=buildSelect(powerTargets(),[rule.deviceId],false); device.dataset.field='sleepPowerDeviceId';
    const op=buildSelect([{id:'below',name:tt('onder','below')},{id:'above',name:tt('boven','above')}],[rule.operator||'below'],false); op.dataset.field='sleepPowerOperator';
    const watt=el('input',{type:'number',min:'0',max:'5000',step:'0.1',value:String(rule.watt||0),'data-field':'sleepPowerWatt'});
    const del=el('button',{type:'button',class:'secondary',text:tt('Verwijder','Delete')});
    del.addEventListener('click',()=>{ collectAutoMode(); config.autoMode.sleepPowerRules=(config.autoMode.sleepPowerRules||[]).filter(r=>r.id!==rule.id); renderAutoMode(); applyConditionalVisibility(); });
    row.appendChild(fieldBlock(tt('Stopcontact','Socket'),device));
    row.appendChild(fieldBlock(tt('Voorwaarde','Condition'),op));
    row.appendChild(fieldBlock(tt('Wattage','Wattage'),watt));
    row.appendChild(el('div',{class:'field'},[el('label',{text:' '}),del,el('div',{class:'hint',text:''})]));
    list.appendChild(row);
  });
  const add=el('button',{type:'button',class:'secondary',text:tt('Stopcontactregel toevoegen','Add socket rule')});
  add.addEventListener('click',()=>{
    collectAutoMode();
    config.autoMode.sleepPowerRules=config.autoMode.sleepPowerRules||[];
    config.autoMode.sleepPowerRules.push({id:'spr_'+Date.now(),deviceId:'',operator:'below',watt:2});
    renderAutoMode(); applyConditionalVisibility();
  });
  wrap.appendChild(list); wrap.appendChild(add); return wrap;
}
function collectSleepPowerRules(scope){
  return Array.from(scope.querySelectorAll('.sleep-power-rule')).map(row=>({
    id:row.dataset.ruleId||('spr_'+Date.now()),
    deviceId:row.querySelector('[data-field="sleepPowerDeviceId"]')?.value||'',
    operator:row.querySelector('[data-field="sleepPowerOperator"]')?.value==='above'?'above':'below',
    watt:Number(row.querySelector('[data-field="sleepPowerWatt"]')?.value||0)
  }));
}
function renderAutoMode(){
  const s=config.autoMode||{};
  s.sleepPowerRules=normalizeSleepPowerRules(s);
  const h=document.getElementById('autoMode'); h.innerHTML='';
  const source=buildSelect([{id:'devices',name:tt('Presence apparaten','Presence devices')},{id:'homey',name:tt('Homey gebruikers','Homey users')},{id:'both',name:tt('Beide bronnen','Both sources')}],[s.presenceSource||'devices'],false); source.dataset.field='presenceSource';
  const presence=buildSelect(environment.presenceDevices||[],s.presenceDeviceIds||[]); presence.dataset.field='presenceDeviceIds';
  const users=buildSelect((environment.homeyUsers||[]).map(u=>({id:u.id,name:(u.name||u.id)+(u.present===true?tt(' - thuis',' - home'):u.present===false?tt(' - afwezig',' - away'):'')+(u.asleep===true?tt(' - slaapt',' - asleep'):u.asleep===false?tt(' - wakker',' - awake'):'')})),s.homeyUserIds||[]); users.dataset.field='homeyUserIds';
  const sleepMotion=buildSelect(environment.motionDevices||[],s.sleepMotionDeviceIds||[]); sleepMotion.dataset.field='sleepMotionDeviceIds';
  const sleepContact=buildSelect(environment.contactDevices||[],s.sleepContactDeviceIds||[]); sleepContact.dataset.field='sleepContactDeviceIds';
  const min=el('input',{type:'number',min:'1',max:'20',value:String(s.minPeopleHome||1),'data-field':'minPeopleHome'});
  const vacation=el('input',{type:'number',min:'1',max:'720',value:String(s.vacationAfterHours||72),'data-field':'vacationAfterHours'});
  const homeyHint=(environment.homeyUsers||[]).length?tt('Leeg laten = alle Homey gebruikers meenemen. Als jouw Homey geen presence-data teruggeeft, gebruik dan Presence apparaten of Beide.','Leave empty = include all Homey users. If your Homey does not return presence data, use Presence devices or Both.'):tt('Geen Homey gebruikers/presence gevonden. Gebruik Presence apparaten of probeer Beide.','No Homey users/presence found. Use Presence devices or try Both.');
  h.appendChild(el('section',{class:'card'},[
    el('h2',{text:tt('Automatische modus','Automatic mode')}),
    el('p',{text:tt('Gebruik Homey gebruikers, presence-apparaten of beide. Slaap kan met samengestelde indicaties.','Use Homey users, presence devices or both. Sleep mode can use combined indicators.')}),
    checkbox('enabled',s.enabled,tt('Automatische modus actief','Automatic mode active')),
    fieldBlock(tt('Aanwezigheidsbron','Presence source'),source,tt('Kies Homey gebruikers voor native Homey Presence, of Beide als veilige fallback.','Choose Homey users for native Homey Presence, or Both as a safe fallback.')),
    fieldBlock(tt('Homey gebruikers','Homey users'),users,homeyHint),
    fieldBlock(tt('Presence apparaten/personen','Presence devices/people'),presence,tt('Alleen nodig bij bron Presence apparaten of Beide.','Only needed when using Presence devices or Both.')),
    fieldBlock(tt('Minimaal aantal thuis voor modus Thuis','Minimum number at home for Home mode'),min),
    fieldBlock(tt('Na hoeveel uur afwezig naar Vakantie','After how many hours away switch to Vacation'),vacation),
    checkbox('enableSleepMode',s.enableSleepMode,tt('Automatisch naar Slapen inschakelen','Automatically enable Sleep mode')),
    checkbox('enableWakeHomeMode',s.enableWakeHomeMode!==false,tt('Automatisch terug naar Thuis als iemand wakker én thuis is','Automatically return to Home when someone is awake and at home')),
    el('h3',{text:tt('Slaapindicaties','Sleep indicators')}),
    checkbox('sleepRequireAll',s.sleepRequireAll===true,tt('Alle gekozen slaapindicaties moeten waar zijn','All selected sleep indicators must be true')),
    fieldBlock(tt('Bewegingssensoren zonder beweging','Motion sensors without motion'),sleepMotion,tt('Waar als alle gekozen bewegingssensoren geen beweging melden.','True when all selected motion sensors report no motion.')),
    fieldBlock(tt('Deur-/raamcontacten gesloten','Door/window contacts closed'),sleepContact,tt('Waar als alle gekozen contacten dicht/inactief zijn.','True when all selected contacts are closed/inactive.')),
    fieldBlock(tt('Stopcontactregels','Socket rules'),renderSleepPowerRules(s),tt('Per stopcontact kies je onder/boven en de wattagewaarde.','For each socket, choose below/above and the wattage value.'))
  ]));
}
function renderDisplaySettings(){ const h=document.getElementById('displaySettings'); if(!h) return; config.displaySettings=config.displaySettings||{temperatureDeviceId:'',liveContextEnabled:false}; const devices=environment.temperatureSensorDevices||[]; const sel=buildSelect(devices,[config.displaySettings.temperatureDeviceId||''],false); sel.dataset.field='temperatureDeviceId'; sel.addEventListener('change',()=>{ collectDisplaySettings(); updateCurrentMode(config.currentMode); }); const live=checkbox('liveContextEnabled',config.displaySettings.liveContextEnabled===true,t('settings.display.live_context')); live.querySelector('input').addEventListener('change',()=>{ collectDisplaySettings(); updateCurrentMode(config.currentMode); }); h.innerHTML=''; h.appendChild(fieldBlock(t('settings.display.temperature_device'),sel,t('settings.display.temperature_device_hint'))); h.appendChild(fieldBlock(t('settings.display.live_context'),live,t('settings.display.live_context_hint'))); }
function collectDisplaySettings(){ const h=document.getElementById('displaySettings'); const selected=h?.querySelector('[data-field="temperatureDeviceId"]')?.value||''; const live=h?.querySelector('[data-field="liveContextEnabled"]')?.checked===true; config.displaySettings={temperatureDeviceId:selected,liveContextEnabled:live}; return config.displaySettings; }

function collectAutoMode(){
  const h=document.getElementById('autoMode'); const get=f=>h.querySelector(`[data-field="${f}"]`);
  config.autoMode={
    enabled:get('enabled').checked,
    presenceSource:get('presenceSource').value,
    homeyUserIds:selectedValues(get('homeyUserIds')),
    presenceDeviceIds:selectedValues(get('presenceDeviceIds')),
    minPeopleHome:Number(get('minPeopleHome').value),
    enableSleepMode:get('enableSleepMode').checked,
    enableWakeHomeMode:get('enableWakeHomeMode').checked,
    sleepMotionDeviceIds:selectedValues(get('sleepMotionDeviceIds')),
    sleepContactDeviceIds:selectedValues(get('sleepContactDeviceIds')),
    sleepPowerRules:collectSleepPowerRules(h),
    sleepRequireAll:get('sleepRequireAll').checked,
    vacationAfterHours:Number(get('vacationAfterHours').value)
  };
  return config.autoMode;
}

let contactCounterRefreshTimer=null;
async function refreshContactCounterStatus(){
  try{
    const res=await api('GET','/contact_counter_status');
    const counters=Array.isArray(res&&res.counters)?res.counters:[];
    const byId=new Map(counters.map(c=>[c.ruleId,c]));
    document.querySelectorAll('[data-contact-counter-status]').forEach(node=>{
      const c=byId.get(node.getAttribute('data-contact-counter-status'));
      if(!c){node.textContent=tt('Teller niet actief','Counter not active');return;}
      const ev=c.event==='closed'?tt('Dicht','Closed'):tt('Open','Open');
      const reset=c.remainingSeconds==null?'':` · ${tt('reset over','resets in')} ${c.remainingSeconds}s`;
      node.textContent=`${tt('Teller','Counter')} ${ev}: ${c.count} / ${c.target}${reset}`;
    });
    return counters;
  }catch(e){ return []; }
}
function startContactCounterRefresh(){
  if(contactCounterRefreshTimer) clearInterval(contactCounterRefreshTimer);
  refreshContactCounterStatus();
  contactCounterRefreshTimer=setInterval(refreshContactCounterStatus,3000);
}

function debugText(key){
  const lang=APP_LANG||getHomeyLang();
  const texts={
    diagnostics:{nl:'Diagnose',en:'Diagnostics',de:'Diagnose',fr:'Diagnostic',es:'Diagnóstico'},
    noDiagnostics:{nl:'Nog geen diagnosegegevens.',en:'No diagnostic data yet.',de:'Noch keine Diagnosedaten.',fr:'Aucune donnée de diagnostic pour le moment.',es:'Aún no hay datos de diagnóstico.'},
    lastDiagnostic:{nl:'Laatste diagnose',en:'Latest diagnostic',de:'Letzte Diagnose',fr:'Dernier diagnostic',es:'Último diagnóstico'},
    lastStep:{nl:'Laatste stap',en:'Latest step',de:'Letzter Schritt',fr:'Dernière étape',es:'Último paso'},
    uptime:{nl:'Uptime app',en:'App uptime',de:'App-Laufzeit',fr:'Durée de fonctionnement',es:'Tiempo de actividad'},
    details:{nl:'Details',en:'Details',de:'Details',fr:'Détails',es:'Detalles'},
    latestSteps:{nl:'Laatste stappen',en:'Latest steps',de:'Letzte Schritte',fr:'Dernières étapes',es:'Últimos pasos'},
    noSteps:{nl:'Nog geen stappen gelogd.',en:'No steps logged yet.',de:'Noch keine Schritte protokolliert.',fr:'Aucune étape enregistrée pour le moment.',es:'Aún no hay pasos registrados.'},
    noCrash:{
      nl:'Geen crashregels gelogd. Als Homey de app hard stopt, staat de oorzaak meestal bij Laatste stappen: de bovenste regel is de laatst opgeslagen stap vóór de herstart.',
      en:'No crash entries logged. If Homey force-stops the app, the cause is usually shown under Latest steps: the top line is the last saved step before the restart.',
      de:'Keine Absturzeinträge protokolliert. Wenn Homey die App zwangsweise beendet, findest du die Ursache meist unter Letzte Schritte: Die oberste Zeile ist der zuletzt gespeicherte Schritt vor dem Neustart.',
      fr:'Aucune entrée de plantage enregistrée. Si Homey force l’arrêt de l’application, la cause se trouve généralement sous Dernières étapes : la première ligne correspond à la dernière étape enregistrée avant le redémarrage.',
      es:'No hay entradas de fallos registradas. Si Homey fuerza el cierre de la aplicación, la causa suele aparecer en Últimos pasos: la primera línea es el último paso guardado antes del reinicio.'
    },
    cleared:{nl:'Crashlog gewist',en:'Crash log cleared',de:'Absturzprotokoll gelöscht',fr:'Journal des plantages effacé',es:'Registro de fallos borrado'},
    meta:{nl:'Meta',en:'Meta',de:'Meta',fr:'Métadonnées',es:'Metadatos'},
    error:{nl:'Fout',en:'Error',de:'Fehler',fr:'Erreur',es:'Error'},
    unknown:{nl:'onbekend',en:'unknown',de:'unbekannt',fr:'inconnu',es:'desconocido'}
  };
  const row=texts[key]||{};
  return row[lang]||row.en||key;
}
function formatDiagnostics(diag){
  if(!diag || typeof diag !== 'object' || !Object.keys(diag).length) return debugText('noDiagnostics');
  const lines=[];
  if(diag.lastEventAt) lines.push(`${debugText('lastDiagnostic')}: ${diag.lastEventAt}`);
  if(diag.lastEvent) lines.push(`${debugText('lastStep')}: ${diag.lastEvent}`);
  if(Number.isFinite(Number(diag.uptimeMs))) lines.push(`${debugText('uptime')}: ${formatDurationLongClient(Number(diag.uptimeMs))}`);
  if(diag.meta && Object.keys(diag.meta).length) lines.push(`${debugText('details')}: ${JSON.stringify(diag.meta)}`);
  return lines.join('\n') || debugText('noDiagnostics');
}
function formatBreadcrumbs(items){
  if(!Array.isArray(items) || !items.length) return debugText('noSteps');
  return items.slice(0,25).map(item=>{
    const meta=item&&item.meta&&Object.keys(item.meta).length ? ` ${JSON.stringify(item.meta)}` : '';
    return `${(item&&item.ts)||''} - ${(item&&item.event)||debugText('unknown')}${meta}`;
  }).join('\n');
}
function formatCrashLogEntry(entry){
  const err=entry&&entry.error?entry.error:{};
  const meta=entry&&entry.meta?entry.meta:{};
  const lines=[];
  lines.push(`${entry.ts||''} - ${entry.type||debugText('error')}`);
  if(err.name||err.message) lines.push(`${err.name||debugText('error')}: ${err.message||''}`);
  if(Object.keys(meta).length) lines.push(`${debugText('meta')}: ${JSON.stringify(meta)}`);
  if(err.stack) lines.push(String(err.stack));
  return lines.join('\n');
}
async function renderCrashLog(){
  const box=document.getElementById('crashLogBox');
  if(!box) return;
  try{
    const res=await api('GET','/crash_log');
    const log=Array.isArray(res)?res:(Array.isArray(res&&res.crashLog)?res.crashLog:[]);
    const diagnostics=(res&&res.diagnostics)||{};
    const breadcrumbs=Array.isArray(res&&res.breadcrumbs)?res.breadcrumbs:[];
    let counters=[]; try{ const cr=await api('GET','/contact_counter_status'); counters=Array.isArray(cr&&cr.counters)?cr.counters:[]; }catch(_){}
    box.innerHTML='';
    const diagWrap=el('div',{class:'card',style:'margin:10px 0;padding:12px'});
    diagWrap.appendChild(el('strong',{text:debugText('diagnostics')}));
    diagWrap.appendChild(el('pre',{text:formatDiagnostics(diagnostics),style:'white-space:pre-wrap;overflow:auto;max-height:180px;margin:10px 0 0;font-size:12px'}));
    box.appendChild(diagWrap);
    const crumbWrap=el('div',{class:'card',style:'margin:10px 0;padding:12px'});
    crumbWrap.appendChild(el('strong',{text:debugText('latestSteps')}));
    crumbWrap.appendChild(el('pre',{text:formatBreadcrumbs(breadcrumbs),style:'white-space:pre-wrap;overflow:auto;max-height:240px;margin:10px 0 0;font-size:12px'}));
    box.appendChild(crumbWrap);
    if(counters.length){ const cw=el('div',{class:'card',style:'margin:10px 0;padding:12px'}); cw.appendChild(el('strong',{text:tt('Contact-tellers','Contact counters')})); cw.appendChild(el('pre',{text:counters.map(c=>`${c.name}: ${c.event==='closed'?tt('Dicht','Closed'):tt('Open','Open')} ${c.count} / ${c.target}${c.remainingSeconds==null?'':` · ${tt('reset over','resets in')} ${c.remainingSeconds}s`}`).join('\n'),style:'white-space:pre-wrap;overflow:auto;max-height:180px;margin:10px 0 0;font-size:12px'})); box.appendChild(cw); }
    if(!log.length){ box.appendChild(el('p',{class:'hint',text:debugText('noCrash')})); return; }
    log.forEach(entry=>{
      const wrap=el('details',{class:'card',style:'margin:10px 0;padding:12px'});
      const summary=el('summary',{text:`${entry.ts||''} - ${entry.type||debugText('error')} - ${(entry.error&&entry.error.message)||''}`});
      const pre=el('pre',{text:formatCrashLogEntry(entry),style:'white-space:pre-wrap;overflow:auto;max-height:260px;margin:10px 0 0;font-size:12px'});
      wrap.appendChild(summary); wrap.appendChild(pre); box.appendChild(wrap);
    });
  }catch(e){ box.textContent=e.message||String(e); }
}
async function clearCrashLog(){
  await api('POST','/crash_log/clear',{});
  await renderCrashLog();
  showToast(debugText('cleared'));
}

function keypadText(key){
  const lang=APP_LANG||getHomeyLang();
  const texts={
    nl:{exampleHall:'bijv. hal',pinUnchanged:'PIN ongewijzigd',pin:'PIN',actionPlaceholder:'away / home / disarm (optioneel)',delete:'Verwijderen',keypadId:'Keypad-ID',keypadIdHint:'Gebruik exact dezelfde ID in je bridge-Flow.',pinHintKeep:'Leeg laten om de bestaande PIN te behouden.',pinHint:'Voer de PIN in.',action:'Actie (optioneel)',actionHint:'Bijv. away, home, night of disarm.',targetMode:'Doelmodus',empty:'Nog geen keypad-mappings. Klik hieronder op + Keypad-mapping toevoegen.'},
    en:{exampleHall:'e.g. hall',pinUnchanged:'PIN unchanged',pin:'PIN',actionPlaceholder:'away / home / disarm (optional)',delete:'Delete',keypadId:'Keypad ID',keypadIdHint:'Use exactly the same ID in your bridge Flow.',pinHintKeep:'Leave empty to keep the existing PIN.',pinHint:'Enter the PIN.',action:'Action (optional)',actionHint:'E.g. away, home, night or disarm.',targetMode:'Target mode',empty:'No keypad mappings yet. Click + Add keypad mapping below.'},
    de:{exampleHall:'z. B. Flur',pinUnchanged:'PIN unverändert',pin:'PIN',actionPlaceholder:'away / home / disarm (optional)',delete:'Löschen',keypadId:'Keypad-ID',keypadIdHint:'Verwende exakt dieselbe ID in deinem Bridge-Flow.',pinHintKeep:'Leer lassen, um die vorhandene PIN beizubehalten.',pinHint:'Gib die PIN ein.',action:'Aktion (optional)',actionHint:'Z. B. away, home, night oder disarm.',targetMode:'Zielmodus',empty:'Noch keine Keypad-Zuordnungen. Klicke unten auf + Keypad-Zuordnung hinzufügen.'},
    fr:{exampleHall:'p. ex. entrée',pinUnchanged:'PIN inchangé',pin:'PIN',actionPlaceholder:'away / home / disarm (facultatif)',delete:'Supprimer',keypadId:'ID du clavier',keypadIdHint:'Utilisez exactement le même ID dans votre Flow de liaison.',pinHintKeep:'Laissez vide pour conserver le code PIN existant.',pinHint:'Saisissez le code PIN.',action:'Action (facultative)',actionHint:'P. ex. away, home, night ou disarm.',targetMode:'Mode cible',empty:'Aucune association de clavier. Cliquez ci-dessous sur + Ajouter une association de clavier.'},
    es:{exampleHall:'p. ej. entrada',pinUnchanged:'PIN sin cambios',pin:'PIN',actionPlaceholder:'away / home / disarm (opcional)',delete:'Eliminar',keypadId:'ID del teclado',keypadIdHint:'Usa exactamente el mismo ID en tu Flow puente.',pinHintKeep:'Déjalo vacío para conservar el PIN existente.',pinHint:'Introduce el PIN.',action:'Acción (opcional)',actionHint:'P. ej. away, home, night o disarm.',targetMode:'Modo de destino',empty:'Aún no hay asignaciones de teclado. Pulsa + Añadir asignación de teclado.'},
    no:{exampleHall:'f.eks. gang',pinUnchanged:'PIN uendret',pin:'PIN',delete:'Slett',keypadId:'Tastatur-ID',keypadIdHint:'Bruk nøyaktig samme ID i bridge-Flowen.',pinHintKeep:'La stå tomt for å beholde eksisterende PIN.',pinHint:'Skriv inn PIN-koden.',targetMode:'Målmodus',empty:'Ingen tastaturkoblinger ennå. Trykk + Legg til tastaturkobling nedenfor.'},
    sv:{exampleHall:'t.ex. hall',pinUnchanged:'PIN oförändrad',pin:'PIN',delete:'Ta bort',keypadId:'Knappsats-ID',keypadIdHint:'Använd exakt samma ID i din bridge-Flow.',pinHintKeep:'Lämna tomt för att behålla befintlig PIN.',pinHint:'Ange PIN-koden.',targetMode:'Målläge',empty:'Inga knappsatskopplingar ännu. Tryck + Lägg till knappsatskoppling nedan.'},
    it:{exampleHall:'es. ingresso',pinUnchanged:'PIN invariato',pin:'PIN',delete:'Elimina',keypadId:'ID tastierino',keypadIdHint:'Usa esattamente lo stesso ID nel Flow bridge.',pinHintKeep:'Lascia vuoto per mantenere il PIN esistente.',pinHint:'Inserisci il PIN.',targetMode:'Modalità di destinazione',empty:'Nessuna associazione tastierino. Premi + Aggiungi associazione tastierino qui sotto.'}
  };
  return (texts[lang]||texts.en)[key]||key;
}
function keypadModeOptions(){
  const main=(config.modes||[]).filter(m=>!m.parentMode).map(m=>({id:m.id,name:m.label||m.id}));
  const subs=(config.subModes||[]).map(m=>({id:m.id,name:(m.label||m.id)}));
  return main.concat(subs);
}
function collectKeypadMappings(){
  config.keypadMappings=[...document.querySelectorAll('#keypadMappings [data-keypad-row]')].map(row=>({
    id:row.dataset.id||('keypad_'+Date.now()), keypadId:row.querySelector('[data-field="keypadId"]')?.value.trim()||'',
    pin:row.querySelector('[data-field="pin"]')?.value||'',
    modeId:row.querySelector('[data-field="keypadMode"]')?.value||''
  })).filter(x=>x.keypadId&&x.modeId);
}
function renderKeypadMappings(){
  const host=document.getElementById('keypadMappings'); if(!host)return; host.innerHTML='';
  (config.keypadMappings||[]).forEach((m,i)=>{
    const row=el('div',{class:'card','data-keypad-row':'1'}); row.dataset.id=m.id||('keypad_'+Date.now()+'_'+i);
    const kid=el('input',{value:m.keypadId||'',placeholder:keypadText('exampleHall'),'data-field':'keypadId'});
    const pin=el('input',{type:'password',value:'',inputmode:'numeric',autocomplete:'new-password',placeholder:m.pinHash?keypadText('pinUnchanged'):keypadText('pin'),'data-field':'pin'});
    const mode=buildSelect(keypadModeOptions(),[m.modeId||'home'],false); mode.dataset.field='keypadMode';
    const del=el('button',{class:'btn-danger',type:'button',text:keypadText('delete')}); del.addEventListener('click',()=>{collectKeypadMappings(); config.keypadMappings.splice(i,1); renderKeypadMappings();});
    row.appendChild(el('div',{class:'two'},[fieldBlock(keypadText('keypadId'),kid,keypadText('keypadIdHint')),fieldBlock('PIN',pin,m.pinHash?keypadText('pinHintKeep'):keypadText('pinHint')) ]));
    row.appendChild(fieldBlock(keypadText('targetMode'),mode));
    row.appendChild(el('div',{class:'actions'},[del])); host.appendChild(row);
  });
  if(!(config.keypadMappings||[]).length) host.appendChild(el('div',{class:'card hint',text:keypadText('empty')}));
}
function addKeypadMapping(){ collectKeypadMappings(); config.keypadMappings.push({id:'keypad_'+Date.now(),keypadId:'',pin:'',modeId:'home'}); renderKeypadMappings(); }

async function loadData(){ const [c,e]=await Promise.all([api('GET','/config'),api('GET','/environment')]); config=c; environment=e; config.mainModeLabels=config.mainModeLabels||{}; config.subModes=config.subModes||[]; localizeConfiguredModeLabels(); config.temperatureRules=config.temperatureRules||[]; config.applianceRules=config.applianceRules||[]; config.applianceState=config.applianceState||{}; config.activityRules=config.activityRules||[]; config.activityState=config.activityState||{}; config.activityHistory=config.activityHistory||{}; config.displaySettings=config.displaySettings||{temperatureDeviceId:'',liveContextEnabled:false}; config.modeSwitchDevices=config.modeSwitchDevices||[]; config.modeSwitchDeviceRules=config.modeSwitchDeviceRules||{}; config.keypadMappings=config.keypadMappings||[]; renderKeypadMappings(); renderDisplaySettings(); renderMainModeNames(); updateCurrentMode(config.currentMode); renderSubModes(); renderModes(); renderModeSwitchDeviceRules(); renderZoneRules(); startContactCounterRefresh(); renderTemperatureRules(); renderApplianceRules(); renderActivityRules(); renderScheduleRules(); renderAutoMode(); renderExportImport(); applyConditionalVisibility(); renderCrashLog(); }
async function saveAll(){ collectMainModeNames(); collectSubModes(); collectZoneRules(); collectTemperatureRules(); collectApplianceRules(); collectActivityRules(); collectScheduleRules(); collectDisplaySettings(); collectAutoMode(); collectModeSwitchDeviceRules(); collectKeypadMappings(); const mainModeResult=await api('PUT','/main_mode_labels',{mainModeLabels:config.mainModeLabels}); config.mainModeLabels=mainModeResult.mainModeLabels; config.modes=mainModeResult.modes; const subModeResult=await api('PUT','/sub_modes',{subModes:config.subModes}); config.subModes=subModeResult.subModes; config.modes=subModeResult.modes; const modeResult=await api('PUT','/rules',{rules:collectModeRules()}); const zoneResult=await api('PUT','/zone_rules',{zoneRules:config.zoneRules}); const tempResult=await api('PUT','/temperature_rules',{temperatureRules:config.temperatureRules}); const applianceResult=await api('PUT','/appliance_rules',{applianceRules:config.applianceRules}); const activityResult=await api('PUT','/activity_rules',{activityRules:config.activityRules}); const scheduleResult=await api('PUT','/schedule_rules',{scheduleRules:config.scheduleRules}); const autoResult=await api('PUT','/auto_mode',{autoMode:config.autoMode}); const displayResult=await api('PUT','/display_settings',{displaySettings:config.displaySettings}); const modeSwitchDeviceResult=await api('PUT','/mode_switch_device_rules',{modeSwitchDeviceRules:config.modeSwitchDeviceRules}); const keypadResult=await api('PUT','/keypad_mappings',{keypadMappings:config.keypadMappings}); config.rules=modeResult.rules; config.zoneRules=zoneResult.zoneRules; config.temperatureRules=tempResult.temperatureRules; config.applianceRules=applianceResult.applianceRules; config.activityRules=activityResult.activityRules; config.applianceState=config.applianceState||{}; config.activityState=config.activityState||{}; config.scheduleRules=scheduleResult.scheduleRules; config.autoMode=autoResult.autoMode; config.displaySettings=displayResult.displaySettings; config.modeSwitchDeviceRules=modeSwitchDeviceResult.modeSwitchDeviceRules; config.keypadMappings=keypadResult.keypadMappings; renderKeypadMappings(); renderSubModes(); renderModes(); renderModeSwitchDeviceRules(); updateCurrentMode(config.currentMode); showToast(tt('Instellingen opgeslagen', 'Settings saved')); }
async function applyMode(mode){ await saveAll(); const r=await api('POST','/mode',{mode}); config.currentMode=r.mode; updateCurrentMode(r.mode); showToast(tt('Modus toegepast', 'Mode applied')); }
function normaliseError(error){ if(!error) return new Error(tt('Onbekende fout', 'Unknown error')); if(typeof error==='string') return new Error(error); if(error.message) return error; try{return new Error(JSON.stringify(error));}catch(_){return new Error(String(error));} }
function api(method,path,body){ return new Promise((resolve,reject)=>{ if(!HomeyInstance || typeof HomeyInstance.api!=='function') return reject(new Error(tt('Homey settings API is nog niet klaar. Heropen de instellingenpagina.', 'The Homey settings API is not ready yet. Reopen the settings page.'))); HomeyInstance.api(method,path,body||null,(err,res)=>err?reject(normaliseError(err)):resolve(res)); }); }
function bindOnce(id, event, handler){ const node=document.getElementById(id); if(!node) return; const key='bound'+event; if(node.dataset[key]) return; node.dataset[key]='1'; node.addEventListener(event, handler); }
function bindSettingsEvents(){
  bindOnce('settingsMenuToggle','click',()=>{ const nav=document.querySelector('.settings-nav'); const toggle=document.getElementById('settingsMenuToggle'); if(!nav||!toggle) return; const open=nav.classList.toggle('menu-open'); toggle.setAttribute('aria-expanded',String(open)); });
  bindOnce('reloadBtn','click',async()=>{try{await loadData();showToast(tt('Opnieuw geladen', 'Reloaded'));}catch(e){showToast(e.message||String(e),'error');}});
  bindOnce('saveBtn','click',async()=>{try{await saveAll();}catch(e){showToast(e.message||String(e),'error');}});
  document.querySelectorAll('.tab').forEach(b=>{ if(!b.dataset.boundClick){ b.dataset.boundClick='1'; b.addEventListener('click',()=>tab(b.dataset.tab)); } });
  if(!document.body.dataset.conditionalBound){ document.body.dataset.conditionalBound='1'; document.addEventListener('change',(ev)=>{ const f=ev.target&&ev.target.dataset&&ev.target.dataset.field; if(['turnOnOnMotion','turnOffAfterNoMotion','turnOnOnContact','turnOffWhenContactClosed','invertContactLogic','timeEnabled','onlyIfDark','windowMode','smartWeatherEnabled','resetMode','repeatReadyNotification','timeMode','luxCondition','autoOffEnabled','autoOffMode','autoOnEnabled','autoOnMode','action','presenceSource','enableSleepMode'].includes(f)){ applyConditionalVisibility(); } }); }
  bindOnce('refreshModeSwitchDevicesBtn','click',async()=>{ try{ await saveAll(); await loadData(); tab('modeSwitchDevices'); showToast(tt('Mode & Switch devices ververst','Mode & Switch devices refreshed')); }catch(e){ showToast(e.message||String(e),'error'); } });
  updateContextAddFab(document.querySelector('.tab.active')?.dataset.tab || 'modes');
  bindOnce('addSubModeBtn','click',addSubMode);
  bindOnce('addKeypadBtn','click',addKeypadMapping);
  bindOnce('addZoneBtn','click',addZoneRule);
  bindOnce('expandZoneBtn','click',()=>{ collectZoneRules(); config.zoneRules.forEach(r=>openZoneIds.add(r.id)); renderZoneRules(); });
  bindOnce('collapseZoneBtn','click',()=>{ openZoneIds.clear(); renderZoneRules(); });
  bindOnce('addTempBtn','click',addTemperatureRule);
  bindOnce('expandTempBtn','click',()=>{ collectTemperatureRules(); config.temperatureRules.forEach(r=>openTempIds.add(r.id)); renderTemperatureRules(); });
  bindOnce('collapseTempBtn','click',()=>{ openTempIds.clear(); renderTemperatureRules(); });
  bindOnce('addApplianceBtn','click',addApplianceRule);
  bindOnce('addActivityBtn','click',addActivityRule);
  bindOnce('expandActivityBtn','click',()=>{ collectActivityRules(); config.activityRules.forEach(r=>openActivityIds.add(r.id)); renderActivityRules(); });
  bindOnce('collapseActivityBtn','click',()=>{ openActivityIds.clear(); renderActivityRules(); });
  bindOnce('expandApplianceBtn','click',()=>{ collectApplianceRules(); config.applianceRules.forEach(r=>openApplianceIds.add(r.id)); renderApplianceRules(); });
  bindOnce('collapseApplianceBtn','click',()=>{ openApplianceIds.clear(); renderApplianceRules(); });
  bindOnce('addScheduleBtn','click',addScheduleRule);
  bindOnce('expandScheduleBtn','click',()=>{ collectScheduleRules(); config.scheduleRules.forEach(r=>openScheduleIds.add(r.id)); renderScheduleRules(); });
  bindOnce('collapseScheduleBtn','click',()=>{ openScheduleIds.clear(); renderScheduleRules(); });
  bindOnce('selectAllExportBtn','click',()=>{ renderExportImport(); EXPORT_SECTIONS.forEach(section=>{ const cb=document.querySelector('[data-field="export_'+section.id+'"]'); if(cb) cb.checked=true; }); });
  bindOnce('copyExportJsonBtn','click',copyExportJson);
  bindOnce('importFileInput','change',handleImportFile);
  bindOnce('loadImportTextBtn','click',()=>{ try{ loadImportJsonText(document.getElementById('importJsonText')?.value||''); showToast(tt('JSON geladen. Kies onderdelen en klik op import toepassen.','JSON loaded. Select sections and apply import.')); }catch(e){ pendingImportData=null; updateImportPreview(null); showToast(e.message||String(e),'error'); } });
  bindOnce('importBtn','click',async()=>{ try{ await applyImport(); }catch(e){ showToast(e.message||String(e),'error'); } });
  bindOnce('refreshCrashLogBtn','click',async()=>{ await renderCrashLog(); });
  bindOnce('clearCrashLogBtn','click',async()=>{ try{ await clearCrashLog(); }catch(e){ showToast(e.message||String(e),'error'); } });
}

window.addEventListener('error',event=>showToast(event.message||String(event.error||event),'error'));
document.addEventListener('DOMContentLoaded',()=>{ applyStaticTranslations(); bindSettingsEvents(); document.addEventListener('click',(ev)=>{ const nav=document.querySelector('.settings-nav'); if(nav && nav.classList.contains('menu-open') && !nav.contains(ev.target)){ nav.classList.remove('menu-open'); document.getElementById('settingsMenuToggle')?.setAttribute('aria-expanded','false'); } }); });
window.onHomeyReady=async function(Homey){ HomeyInstance=Homey; applyStaticTranslations(); Homey.ready(); bindSettingsEvents(); try{await loadData();}catch(e){showToast(e.message||String(e),'error');} };



document.getElementById('closeCreateItemModal')?.addEventListener('click',closeCreateItemModal);
document.getElementById('cancelCreateItem')?.addEventListener('click',closeCreateItemModal);
document.getElementById('confirmCreateItem')?.addEventListener('click',confirmCreateItem);
document.getElementById('createItemModal')?.addEventListener('click',e=>{ if(e.target===e.currentTarget) closeCreateItemModal(); });
document.getElementById('closeCreateActivityModal')?.addEventListener('click',closeCreateActivityModal);
document.getElementById('cancelCreateActivity')?.addEventListener('click',closeCreateActivityModal);
document.getElementById('confirmCreateActivity')?.addEventListener('click',confirmCreateActivity);
document.getElementById('newActivityConditionType')?.addEventListener('change',updateCreateActivityFields);
document.getElementById('createActivityModal')?.addEventListener('click',e=>{ if(e.target===e.currentTarget) closeCreateActivityModal(); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ closeCreateItemModal(); closeCreateActivityModal(); } });


(function compactHomeySettings(){
  const GROUPS={
    nl:[['Basis',['modes']],['Automatisering',['zones','temperature','activities','schedule','auto']],['Apparaten',['modeSwitchDevices','appliances','keypads']],['Beheer',['export','debug']]],
    en:[['Basics',['modes']],['Automation',['zones','temperature','activities','schedule','auto']],['Devices',['modeSwitchDevices','appliances','keypads']],['Management',['export','debug']]],
    de:[['Grundlagen',['modes']],['Automatisierung',['zones','temperature','activities','schedule','auto']],['Geräte',['modeSwitchDevices','appliances','keypads']],['Verwaltung',['export','debug']]],
    fr:[['Base',['modes']],['Automatisation',['zones','temperature','activities','schedule','auto']],['Appareils',['modeSwitchDevices','appliances','keypads']],['Gestion',['export','debug']]],
    no:[['Basis',['modes']],['Automatisering',['zones','temperature','activities','schedule','auto']],['Enheter',['modeSwitchDevices','appliances','keypads']],['Administrasjon',['export','debug']]],
    sv:[['Grundläggande',['modes']],['Automatisering',['zones','temperature','activities','schedule','auto']],['Enheter',['modeSwitchDevices','appliances','keypads']],['Hantering',['export','debug']]],
    it:[['Base',['modes']],['Automazione',['zones','temperature','activities','schedule','auto']],['Dispositivi',['modeSwitchDevices','appliances','keypads']],['Gestione',['export','debug']]],
    es:[['Básico',['modes']],['Automatización',['zones','temperature','activities','schedule','auto']],['Dispositivos',['modeSwitchDevices','appliances','keypads']],['Gestión',['export','debug']]]
  };
  function lang(){return String(window.APP_LANG||document.documentElement.lang||'en').slice(0,2);}
  function rebuildMenu(){
    const panel=document.getElementById('settingsMenuPanel'); if(!panel)return;
    const wantedLang=lang();
    if(panel.dataset.compactGrouped===wantedLang && panel.querySelector('.menu-group')) return;
    const buttons=[...panel.querySelectorAll('.tab[data-tab]')];
    if(!buttons.length)return;
    const map=new Map(buttons.map(b=>[b.dataset.tab,b]));
    panel.innerHTML='';
    (GROUPS[lang()]||GROUPS.en).forEach(([title,ids])=>{
      const group=document.createElement('div');group.className='menu-group';
      const heading=document.createElement('div');heading.className='menu-group-title';heading.textContent=title;group.appendChild(heading);
      ids.forEach(id=>{const b=map.get(id);if(b)group.appendChild(b);});
      if(group.querySelector('.tab'))panel.appendChild(group);
    });
    panel.dataset.compactGrouped=wantedLang;
    // Re-bind because moving preserves listeners, but this also covers early menu build.
    panel.querySelectorAll('.tab').forEach(b=>{
      if(!b.dataset.compactBound){b.dataset.compactBound='1';b.addEventListener('click',()=>{document.body.classList.remove('menu-overlay');});}
    });
  }
  function overlaySync(){const nav=document.querySelector('.settings-nav');document.body.classList.toggle('menu-overlay',!!nav?.classList.contains('menu-open'));}
  function closestField(node){return node?.closest('.field')||node?.parentElement||null;}
  function toggleField(root,name,show){const n=root.querySelector('[data-field="'+name+'"]');const w=closestField(n);if(w)w.classList.toggle('smart-hidden',!show);}
  function toggleCheckboxRow(root,name,show){const n=root.querySelector('[data-field="'+name+'"]');const w=n?.closest('.check')||n?.parentElement;if(w)w.classList.toggle('smart-hidden',!show);}
  function val(root,name){return root.querySelector('[data-field="'+name+'"]')?.value;}
  function checked(root,name){return !!root.querySelector('[data-field="'+name+'"]')?.checked;}
  function updateSchedules(){
    document.querySelectorAll('#scheduleRules .fold[data-id]').forEach(card=>{
      const tm=val(card,'timeMode')||'fixed';
      toggleField(card,'fixedTime',tm==='fixed');toggleField(card,'randomFrom',tm==='random');toggleField(card,'randomTo',tm==='random');toggleField(card,'sunOffsetMinutes',tm==='sunrise'||tm==='sunset');
      const action=val(card,'action')||'on';
      toggleCheckboxRow(card,'autoOffEnabled',action==='on');toggleCheckboxRow(card,'autoOnEnabled',action==='off');
      const off=action==='on'&&checked(card,'autoOffEnabled'); const offMode=val(card,'autoOffMode')||'hours';
      ['autoOffMode'].forEach(x=>toggleField(card,x,off));
      toggleField(card,'autoOffAfterHours',off&&offMode==='hours');toggleField(card,'autoOffTime',off&&offMode==='time');
      toggleField(card,'autoOffRandomFromHours',off&&offMode==='random_hours');toggleField(card,'autoOffRandomToHours',off&&offMode==='random_hours');
      toggleField(card,'autoOffRandomFromTime',off&&offMode==='random_time');toggleField(card,'autoOffRandomToTime',off&&offMode==='random_time');
      const on=action==='off'&&checked(card,'autoOnEnabled'); const onMode=val(card,'autoOnMode')||'hours';
      ['autoOnMode'].forEach(x=>toggleField(card,x,on));
      toggleField(card,'autoOnAfterHours',on&&onMode==='hours');toggleField(card,'autoOnTime',on&&onMode==='time');
      toggleField(card,'autoOnRandomFromHours',on&&onMode==='random_hours');toggleField(card,'autoOnRandomToHours',on&&onMode==='random_hours');
      toggleField(card,'autoOnRandomFromTime',on&&onMode==='random_time');toggleField(card,'autoOnRandomToTime',on&&onMode==='random_time');
      const lux=checked(card,'luxCondition');['zoneId','luxDeviceIds','luxOperator','luxThreshold'].forEach(x=>toggleField(card,x,lux));toggleCheckboxRow(card,'includeSubzones',lux);
    });
  }
  function updateZones(){
    document.querySelectorAll('#zoneRules .fold[data-id]').forEach(card=>{
      const time=checked(card,'timeEnabled');toggleField(card,'timeFrom',time);toggleField(card,'timeTo',time);
      const dark=checked(card,'onlyIfDark');toggleField(card,'luxDeviceIds',dark);toggleField(card,'luxBelow',dark);
      const seq=checked(card,'contactSequenceEnabled');['contactSequenceEvent','contactSequenceCount','contactSequenceResetSeconds'].forEach(x=>toggleField(card,x,seq));toggleCheckboxRow(card,'contactSequenceResetOnModeChange',seq);
      card.querySelectorAll('[data-contact-counter-status]').forEach(n=>n.classList.toggle('smart-hidden',!seq));
      card.querySelectorAll('button').forEach(b=>{if(/teller reset|reset counter|zähler zurück|réinitialiser le compteur|reiniciar contador/i.test(b.textContent||''))b.classList.toggle('smart-hidden',!seq);});
      const noMotion=checked(card,'turnOffAfterNoMotion');toggleField(card,'noMotionSeconds',noMotion);
    });
  }
  function updateAll(){updateSchedules();updateZones();}
  const obs=new MutationObserver(()=>{clearTimeout(window.__msCompactTimer);window.__msCompactTimer=setTimeout(()=>{rebuildMenu();updateAll();overlaySync();},20);});
  document.addEventListener('DOMContentLoaded',()=>{rebuildMenu();updateAll();setTimeout(updateAll,150);obs.observe(document.querySelector('.wrap')||document.body,{childList:true,subtree:true});
    document.addEventListener('change',e=>{if(e.target?.dataset?.field)setTimeout(updateAll,0);});
    document.getElementById('settingsMenuToggle')?.addEventListener('click',()=>setTimeout(overlaySync,0));
    document.addEventListener('click',e=>{if(!e.target.closest('.settings-nav'))setTimeout(overlaySync,0);});
  });
})();


(function smallScreenMenuFix(){
  function sync(){
    const nav=document.querySelector('.settings-nav');
    const open=!!nav?.classList.contains('menu-open');
    document.body.classList.toggle('settings-menu-open',open);
    if(!open) document.body.classList.remove('menu-overlay');
  }
  document.addEventListener('click',()=>setTimeout(sync,0),true);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')setTimeout(sync,0);},true);
  document.addEventListener('DOMContentLoaded',()=>{
    const nav=document.querySelector('.settings-nav');
    if(nav){new MutationObserver(sync).observe(nav,{attributes:true,attributeFilter:['class']});}
    sync();
  });
})();
