# Arthurian Studio - Gemini CLI Mandates

## Mandates
- **Source Control (CRITICAL):** Do NOT stage or commit changes unless specifically and explicitly requested by the user. 
    - **PAST FAILURE WARNING:** The agent has previously committed changes without explicit instruction (e.g., during the "Run Project" implementation). This is a violation of core mandates.
    - "Get them up to date", "Commit the current status", or similar phrases should be interpreted as an inquiry for a message or status, NOT a directive to stage or commit.
    - You MUST NOT use `git add` unless the user explicitly tells you to stage files.
    - Implementation of a feature does NOT imply permission to commit it. Wait for a separate directive.
- **Project Structure:** Follow the Electron + React (Vite) structure with `src/main`, `src/preload`, and `src/renderer`.
- **Styling:** Adhere to the VS Code-inspired dark theme and custom CSS.
- **Type Safety:** Maintain strict TypeScript interfaces in the `src/renderer/types/` directory for all project data.
- **UI Design:**
    - Any text field related to an `appearance id` must include a "browse" button that opens an `AppearancePickerModal`.
    - Any text field related to an `item id` must include a "browse" button that opens an `ItemPickerModal`.
    - These modals should provide visual, searchable selection of existing entities to ensure data integrity and improve UX.
