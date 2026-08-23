# Keypads (v3.1.6)

ModeSwitch kan PIN-invoer van Ring, frient en andere Homey-keypads verwerken via een bridge-Flow.

1. Open ModeSwitch instellingen > Keypads en voeg een mapping toe.
2. Kies een eigen Keypad-ID (bijv. `hal`), PIN, optionele actie (`away`, `home`, `disarm`, etc.) en doelmodus.
3. Maak in Homey een Flow met de trigger van je keypad-app.
4. Gebruik als actie **Mode Switch > Verwerk keypad-invoer** en geef Keypad-ID, PIN-token en eventueel actie-token door.

PIN-codes worden niet als platte tekst opgeslagen. ModeSwitch bewaart een unieke salt en SHA-256 hash.
