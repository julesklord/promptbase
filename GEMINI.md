# PromptVault - Internal Instructions

## Project Overview
PromptVault is a personal, self-hosted LLM prompt library. It is designed to be a private repository for a user's technical prompts, accessible across a local network.

### New Strategic Focus: Personal Knowledge Management (PKM)
- **Private Use**: The application is no longer community-driven. All references to "community", "submitting", or "contributing" have been replaced with "Personal Vault", "Adding", and "Local Management".
- **Local Network Exposure**: The server is configured to be accessible by other devices on the same Wi-Fi/LAN via the host machine's local IP.

## Architecture & Data Flow
- **Static Vault**: No database or backend. Data is stored in `data/prompts/*.json`.
- **LAN Server**: Uses `browser-sync` with `--host 0.0.0.0` to expose port 5500 to the network.

## User Workflow
1. **Manage Locally**: The user adds prompts by using the UI to generate a JSON object.
2. **Manual Persistence**: The user manually copies the generated JSON and pastes it into the respective local file in `data/prompts/`.
3. **LAN Access**: The user can view and copy prompts from any device in their network (mobile, second laptop, tablet) by navigating to the external IP of the host.

## Development Constraints
- **Maintain Simplicity**: Do not add backends or databases unless explicitly requested.
- **Privacy First**: Ensure no telemetry or external calls are added that could leak the user's private vault contents.
- **UI Branding**: Keep the "PromptVault" branding (Logo mark: 'V').
