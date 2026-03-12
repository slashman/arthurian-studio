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
