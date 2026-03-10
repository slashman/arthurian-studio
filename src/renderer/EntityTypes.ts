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
  intent?: string;
  alignment?: string;
  items?: MobItem[];
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
  project: {
    studioVersion: string;
    arthurianVersion: string;
    appearancesFile: string;
    mobTypesFile: string;
  };
  data: {
    mobTypes: MobType[];
    appearances: Tileset[];
  };
}
