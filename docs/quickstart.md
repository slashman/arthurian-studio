# How to Create a Game Using OpenArthurianX6 (OAX6)

OpenArthurianX6 (OAX6) follows a structured approach where you define the world, its inhabitants, and the rules of interaction before setting the scenario in motion.

Arthurian Studio is the primary tool for managing these definitions. Each module in the sidebar represents a core component of your game's data.

## Workflow Approaches

### A. Use the OAX6 Foundations Pack
Focus on **NPCs**, **Scenario**, and **Maps**. Repurpose existing **Creatures** and **Items** to tell a new story using the built-in assets.

### B. Extending the OAX6 Foundations Pack
Define your own **Creatures**, **Items**, and **Interactables** to create a completely unique universe before building the world grid and scenario.

### C. Create a Universe Pack
Start with **Tilesets** and **Appearances** to create a completely unique universe before building Creatures. Items and Interactables.

---

## 1. World Configuration
The **World** module is split into two sections: **Config** and **Maps**.

### World Config
Defines the fundamental metrics of your game world.
- **Tile Size**: The base pixel dimensions for all tiles (e.g., 16x16).
- **Chunk Dimensions**: The size of each map chunk, measured in tiles (e.g., 64x64).
- **World Grid Size**: How many chunks make up the total world (e.g., 4x4 chunks).

### Maps (Map Chunks)
Manage the layout of your world by placing map files on the global grid.
- **Grid Cell**: Clicking a cell allows you to assign a map chunk.
- **Name**: Internal name for the chunk.
- **Filename**: The Tiled JSON map file associated with this chunk.
- **Coordinates**: The [X, Y] position on the world grid.

---

## 2. Tilesets
Manage the graphical assets (spritesheets) used in your project.
- **Select Asset**: Browse PNG files located in your project's `res/` directory.
- **Tileset ID**: Unique identifier used to reference this asset.
- **Tile Size Override**: Optionally define specific pixel dimensions for this tileset if it differs from the global world configuration.

---

## 3. Appearances
Appearances map specific regions of a **Tileset** to entity IDs.
- **Creature Appearances**: Group directional frames (Up, Down, Left, Right) for animated characters.
- **Item Appearances**: Define a single frame index for static objects or items.

---

## 3. Creatures
These are the templates for all living things in the world.
- **ID & Name**: Unique identifier and display name.
- **Appearance**: Links to a specific **Creature Appearance**.
- **Stats**: HP, Damage, Defense, and Speed (Speed determines combat turn order).
- **Alignment**: 'Player', 'Enemy', or 'Neutral'.
- **Corpse**: The Item ID dropped when this creature dies.
- **Portrait**: Appearance ID used for dialogue windows.
- **Default Intent**: 'Wait Command', 'Seek Player', or 'Follow Schedule'.

---

## 4. NPCs
Unique instances of characters in the world. NPCs are built upon **Creature** templates but have specific behaviors.

### Basic Data
- **Creature Type**: The base template (e.g., 'avatar', 'guard').
- **Name & Alignment**: Override the base template values if necessary.

### Conversations (Dialogs)
Defined as a tree of fragments tied to keywords.
- **Keyword**: The trigger word (e.g., "job", "king", "health").
- **Dialog Pieces**: Can be text strings or special events:
    - `event`: Describes an action (e.g., "*The guard sighs*").
    - `endConversation`: Closes the dialogue UI.
    - `joinParty`: Recruits the NPC.
    - `setFlag`: Modifies a global game state flag.
- **Variants**: Conditional responses based on game flags.
- **Unknown**: The fallback response when no keyword matches.

### Schedule
Define where the NPC goes and what they do at specific times of the day (measured in minutes).

### Triggers
Logic that executes when certain conditions are met (e.g., `playerDistance`).

---

## 5. Items
Objects that can be placed in the world, picked up, or used.
- **Subtypes**: Items can be configured as specific types like `lightSource`, `container`, or `linkedDoor`.
- **Stats**: Damage, Range, and Weight.
- **Throwable**: Configure if the item can be thrown and its flight animation ('rotate' or 'straight').

---

## 6. Interactables
Fixed map objects that players can interact with but typically cannot pick up (e.g., signs, switches, static decorations with descriptions).

---

## 7. Cutscenes
Dialogue-based story sequences that can be triggered at game start or through NPC interactions. They consist of a series of text lines displayed sequentially.

---

## 8. Scenario
Defines the entry point of your game.
- **Starting Minute**: The time of day when the game begins.
- **Starting Position**: The [X, Y] coordinates and the specific **Scene** (Map) where the player appears.
- **Initial Party**: Use the **NPC Picker** to select which characters start in the player's party.
