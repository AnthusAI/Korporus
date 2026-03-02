# Hello World Help

The Hello World app is a reference implementation of Korporus app contracts.

## What This App Demonstrates

- A federated app loaded at runtime by the shell.
- A standardized settings experience with a sidebar and shell Save/Cancel controls.
- Consumption of system appearance settings (mode/theme/motion).

## Language Setting

Use **Settings** from the app menu to choose the greeting language.

- Changes are buffered while editing.
- **Save** applies your selection.
- **Cancel** reverts to the last saved value.

## Troubleshooting

### I changed a setting and nothing happened

Settings changes are not applied until you press **Save** in the shell footer.

### I cannot see this page from the Help menu

Verify the app was opened from the shell and use **Help > Hello World Help**.
