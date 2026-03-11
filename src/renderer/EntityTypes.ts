export interface ArthurianProject {
  studioVersion: string;
  arthurianVersion: string;
  appearancesFile: string;
  mobTypesFile: string;
  itemsFile: string;
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

export interface UseEffect {
  type: string;
}

export interface MobItem {
  itemId: string;
  quantity: number;
}

export interface MobType {
  id: string;
  appearance: string;
  name: string;
  hp: number;
  damage: number;
  defense: number;
  speed: number;
  corpse: string;
  weapon?: string;
  portrait?: string;
  useEffect?: UseEffect;
  description?: string;
  intent?: 'waitCommand' | 'seekPlayer' | 'followSchedule' | string;
  alignment?: 'enemy' | 'player' | string;
  items?: MobItem[];
}

export interface ItemEffect {
  type: 'unlockDoor' | 'recoverHP' | 'playMusic' | 'toggleLit' | 'reduceHunger' | string;
  hungerRecovery?: number;
  transformTo?: string;
  audioAssetKey?: string;
  offset?: number;
  timingType?: 'fixed' | 'manual' | string;
  fragments?: number[];
  fragmentLength?: number;
  keys?: number;
}

export interface Item {
  id: string;
  name: string;
  appearance?: string;
  description?: string;
  value?: number;
  weight?: number;
  type?: 'lightSource' | 'container' | 'linkedDoor' | string;
  damage?: number;
  defense?: number;
  flyAppearance?: string;
  throwable?: boolean;
  range?: number;
  flyType?: 'rotate' | 'straight' | string;
  usesProjectileType?: string;
  stackLimit?: number;
  capacity?: number;
  fixed?: boolean;
  closedAppearance?: string;
  openAppearance?: string;
  linked?: { x: number, y: number };
  isBook?: boolean;
  title?: string;
  contents?: string;
  effect?: ItemEffect;
  spendable?: boolean;
  useOnSelf?: boolean;
  lightRadius?: number;
  appearances?: { [key: string]: string };
  solid?: boolean;
  containerType?: 'medium' | 'backpack' | string;
}

export interface MobAppearance {
  id: string;
  u: number[];
  d: number[];
  l: number[];
  r: number[];
}

export interface ItemAppearance {
  id: string;
  i: number;
}

export interface Tileset {
  tileset: string;
  mobs?: MobAppearance[];
  items?: ItemAppearance[];
}

export interface ProjectData {
  filePath: string;
  project: ArthurianProject;
  data: {
    mobTypes: MobType[];
    appearances: Tileset[];
    items: Item[];
  };
}
