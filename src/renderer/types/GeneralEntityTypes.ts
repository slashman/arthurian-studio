import { MobType } from './MobEntityTypes';
import { Tileset } from './AppearanceEntityTypes';
import { Item } from './ItemEntityTypes';
import { NPC } from './NPCEntityTypes';
import { ObjectType } from './ObjectEntityTypes';

export interface ArthurianProject {
  studioVersion: string;
  arthurianVersion: string;
  appearancesFile: string;
  mobTypesFile: string;
  itemsFile: string;
  npcsFile: string;
  objectTypesFile: string;
  tileWidth: number;
  tileHeight: number;
  tilesets: TilesetDefinition[];
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
  };
}
