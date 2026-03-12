import { MobItem } from './MobEntityTypes';

export interface DialogCondition {
  flag?: string;
  value?: any;
  joined?: boolean;
}

export interface DialogObject {
  type: string;
  text?: string;
  flagName?: string;
  name?: string; // for interruption
  value?: any;
}

export type DialogLine = string | DialogObject;

export type DialogLines = DialogLine | DialogLine[];

export interface DialogVariant {
  condition?: DialogCondition;
  dialog: DialogLines;
}

export interface DialogFragment {
  key: string;
  dialog?: DialogLines;
  variants?: DialogVariant[];
  synonym?: string;
}

export interface NPC {
  id: string;
  name: string;
  type: string;
  alignment?: 'enemy' | 'player' | string;
  description?: string;
  weapon?: string;
  armor?: string;
  backpack?: string;
  items?: MobItem[];
  intent?: 'waitCommand' | 'seekPlayer' | 'followSchedule' | string;
  dialog?: DialogFragment[];
  schedule?: any[];
  triggers?: any[];
}
