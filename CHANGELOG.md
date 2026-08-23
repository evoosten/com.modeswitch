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

