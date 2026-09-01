# 3.1.55
- Moved the new Zones & Sensors light-profile translations into the Homey `locales/*.json` i18n files.
- Sensor-inactive title, explanation, light state and related controls now use locale keys instead of page-specific hardcoded translations.
- Added matching translations for NL, EN, DE, FR, ES, IT, SV, NO and NB.

## 3.1.53
- Zones & sensoren: het tweede lichtprofiel werkt nu bij sensor-inactief: geen beweging of deur-/raamcontact weer inactief/gesloten.
- De koppeling van dit profiel aan een modus/statuswissel is verwijderd.
- Vertraagde sensor-inactief-acties worden niet uitgevoerd als de sensor ondertussen opnieuw actief wordt.
- Zonder apart sensor-inactief-profiel blijven de gekozen lampen automatisch uitgaan zoals voorheen.

## 3.1.52
- Added optional per-light actions for Zones & Sensors when the linked mode/status is deactivated.
- Deactivation actions support on/off, dim level, color temperature, color and delay per light.
- Leaving the deactivation list empty keeps the previous behavior.

## 3.1.51
- Added per-light settings to Zones & Sensors, matching Planning.
- Each zone light can now have its own on/off state, dim level, color temperature, color and optional delay.
- Existing zone light selections and legacy dim/color settings are migrated automatically.
- Zone light options are shown only when supported by the selected light.

## 3.1.50
- Fixed Homey widget API routes after migration to `.homeycompose`.
- Restored API definitions for Monitoring, Appliance Monitoring, Activity Monitoring, Mode and Settings widgets.
- Added complete Settings widget API routes so data loading and saving remain available after Homey Compose rebuilds `app.json`.

## 3.1.37
- Completed Norwegian translations for Activities, Planning, Mode & Switch devices, Monitoring and Keypads.
- Added Norwegian, Swedish and Italian keypad UI translations.
- Fixed remaining hardcoded labels in Mode & Switch device settings.

# 3.1.20
- Fixed saving and reloading of delayed mode actions.
- Delayed actions are preserved by export/import.

# 3.1.19
- Added delayed on/off actions per mode for devices and individual multi-plug endpoints.
- Delay can be configured in seconds, minutes or hours.
- Pending delayed actions are cancelled when another mode becomes active.

## 3.1.18
- Translated Crash log diagnostics and status text for Dutch, English, German, French and Spanish.

## 3.1.16
- Fixed an error when adding a new sub mode from the Settings page.

## 3.1.14
- Completed German, French and Spanish translations in the Sub Mode add/edit section of Settings.

## 3.1.12
- Prevent multi-plug/socket endpoints from being detected as Switch input devices solely because of `onoff.*` capabilities or switch-like names.

## 3.1.11
- Fix: bestaande temperatuurregels migreren exact hun oude enkele modus naar de nieuwe multi-select.
- Een expliciet lege modusselectie betekent niet langer automatisch alle modussen of Thuis.
- Dezelfde migratielogica wordt gebruikt in de instellingenpagina en het Settings Panel.

## 3.1.10
- Temperatuurregels kunnen nu aan meerdere hoofd- en submodussen tegelijk worden gekoppeld.
- Bestaande temperatuurregels met één modus worden automatisch compatibel ingelezen.
- Ondersteuning toegevoegd aan zowel de normale instellingenpagina als het compacte Settings Panel.

# 3.1.9
- Multi-channel endpoint support expanded across modes, schedules, Mode & Switch actions, appliance monitoring, submode power automation, sleep power rules and activity energy monitoring.
- Separate measure_power.* / meter_power.* channels are matched per endpoint where available.
- Toggle and dim actions are endpoint-aware.
- Existing single-channel device IDs remain backwards compatible.

## 3.1.8
- Multi-plug support: individual on/off channels can be selected separately in Modes and Planning.
- Existing single-output device rules remain compatible.

# 3.1.7
- Hersteld: het Keypads-tabblad wordt nu daadwerkelijk geopend door de centrale tabnavigatie.
- Keypad-mapping toevoegen blijft gekoppeld aan de bestaande keypadconfiguratie.

# Changelog

## 3.1.4

- Dashboardplanning filtert planningen nu op de werkelijk actieve modus.
- Een planning die alleen voor bijvoorbeeld Vakantie geldt, wordt niet meer aan Home Overview doorgegeven wanneer Thuis, Slapen of Afwezig actief is.
- De Dashboard Service levert `modeIds`, `requiredModeIds`, `modeMatch` en `currentMode` mee voor compatibele dashboardclients.
- Reeds ingeplande vervolgacties (automatisch aan/uit) blijven zichtbaar, omdat die voortkomen uit een eerder uitgevoerde planning.

## 3.1.1

- Herstelde berekening van de volgende planning voor de Dashboard Service.
- Tijdzone van Homey wordt nu gebruikt in plaats van de tijdzone van het app-proces.
- Vaste tijden, zonsondergang/zonsopkomst, random planning zodra bekend en vervolgacties worden ondersteund.
- De volgende planning wordt betrouwbaarder doorgegeven aan Home Overview.

## 3.1.0

- Added central Dashboard Service and read-only dashboard endpoints.
## 3.1.15
- Widgets now preserve custom names for default sub modes instead of replacing them with built-in labels.


## 3.1.21
- Added per-mode light profiles: on/off, dim level, color temperature, color and optional delay.
- Zone and sensor-triggered lighting rules can now apply color temperature and color.
- Unsupported light capabilities are skipped automatically.
- Removed the separate keypad action field; keypad mappings are now Keypad ID + PIN -> mode.

## 3.1.22
- Planning now supports the same advanced light profiles as Modes: on/off, dim level, color temperature and color.
- Light actions in Planning can have an optional delay. Delayed planning light actions are stored in schedule state so they survive app restarts.
- Existing device on/off planning remains unchanged and compatible.

## 3.1.25
- Added configurable contact sensor counters/sequences for zone rules.
- Lights can switch off on the second (or later) open/close event.
- Added timeout and mode-change reset for the contact counter.


## 3.1.26
- Added live contact-counter status and manual reset controls in Zones & Sensors.
- Added active contact counters to Diagnostics.
## 3.1.29
- Complete compact redesign of the Settings page for Homey small-screen use.
- Cleaner grouped navigation, compact cards and clearer summaries.
- Context-sensitive fields are hidden until they are relevant.
- Improved mobile dialogs, actions and spacing without changing existing configuration logic.



## 3.1.30
- Improved the compact Homey settings menu: smaller rows, correct icon spacing, smooth internal scrolling and locked background scrolling while the menu is open.
## 3.1.32
- Temperature rules now react live to selected door/window contacts.
- Window setback temperature is applied when a contact opens and the normal active-mode temperature is restored when it closes.
- No mode change is required anymore.

