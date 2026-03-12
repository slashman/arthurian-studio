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
  name?: string; // for dialogInterruption
  value?: any;
}

export type DialogLine = string | DialogObject;

/**
 * DialogLines can be a single string, a single object, or an array of either.
 * We'll mostly normalize to array in the editor but support both in data.
 */
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

export interface ScheduleAction {
  type: string;
  hours?: number;
  once?: boolean;
  [key: string]: any;
}

export interface ScheduleItem {
  id: string;
  time: number;
  location: { x: number, y: number };
  action?: ScheduleAction;
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
  schedule?: ScheduleItem[];
  triggers?: any[];
}
