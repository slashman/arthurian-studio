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
