import { MobType } from './MobEntityTypes';
import { Tileset } from './AppearanceEntityTypes';
import { Item } from './ItemEntityTypes';
import { NPC } from './NPCEntityTypes';
import { ObjectType } from './ObjectEntityTypes';
import { Scenario } from './ScenarioEntityTypes';

export interface ArthurianProject {
  projectName?: string;
  templateCode?: string;
  templateVersion?: string;
  runtimeCode?: string;
  studioVersion: string;
  arthurianVersion: string;
  appearancesFile: string;
  mobTypesFile: string;
  itemsFile: string;
  npcsFile: string;
  objectTypesFile: string;
  tilesetsFile: string;
  scenarioFile: string;
  tileWidth: number;
  tileHeight: number;
}

export interface TilesetDefinition {
  id: string;
  file: string;
  tileWidth?: number;
  tileHeight?: number;
}

export interface ProjectData {
  filePath: string;
  project: ArthurianProject;
  data: {
    mobTypes: MobType[];
    appearances: Tileset[];
    items: Item[];
    npcs: NPC[];
    objectTypes: ObjectType[];
    scenario: Scenario;
    tilesets: TilesetDefinition[];
  };
}
