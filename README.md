# Arthurian Studio

Arthurian Studio is a specialized editor for RPG game assets, built with Electron, React, and Vite. It provides a structured environment for managing appearances, mob types, items, and more.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (usually bundled with Node.js)

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Slashie/arthurianStudio.git
cd arthurianStudio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the application in development mode
```bash
npm run dev
```

## Available Scripts

- `npm run dev`: Starts the application with hot-reloading for development.
- `npm run build`: Compiles the application for production.
- `npm run preview`: Previews the production build.

## Project Structure

The project follows an Electron + React (Vite) structure:

- `src/main`: Electron main process logic.
- `src/preload`: Preload scripts for bridging the main and renderer processes.
- `src/renderer`: React-based UI components and application logic.
  - `components/`: UI components like `AppearanceCanvas`, `ProjectLoader`, etc.
  - `types/`: Split TypeScript interfaces for different project entities (NPCs, Items, etc.).
  - `ProjectContext.tsx`: React Context for global state management.

## Project Data

A sample project is included in the `testProject` directory. This can be used to test the editor's features. It includes:
- `data/`: JSON files for appearances, items, mob types, etc.
- `res/`: Image resources for tilesets and sprites.

## Technical Details

- **Framework**: [React 19](https://react.dev/)
- **Runtime**: [Electron 40](https://www.electronjs.org/)
- **Build Tool**: [electron-vite](https://electron-vite.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Custom CSS with a VS Code-inspired dark theme.

## Type Safety

Maintain strict adherence to TypeScript interfaces defined in `src/renderer/types/` for all project data to ensure consistency across the application.
