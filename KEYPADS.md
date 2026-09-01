# Keypads in Mode Switch

Mode Switch can link a keypad PIN directly to a main mode or submode.

## Configuration

1. Open **Settings > Keypads**.
2. Add a keypad mapping.
3. Enter a recognizable **Keypad ID**, for example `hall`.
4. Enter the **PIN**. The PIN is stored as a salted SHA-256 hash after saving.
5. Select the **target mode**.
6. Save the settings.

## Homey Flow bridge

Create a Flow using the trigger from your Ring, frient or compatible keypad app. Add the Mode Switch action **Process keypad input** and pass:

- the same Keypad ID configured in Mode Switch;
- the PIN token from the keypad trigger.

A separate keypad action (Home/Away/Disarm) is no longer required. The configured PIN determines which Mode Switch mode is activated.

Multiple PINs and multiple keypads can be configured.
