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
