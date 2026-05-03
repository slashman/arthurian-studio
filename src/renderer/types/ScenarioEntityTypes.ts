export interface ScenarioConfig {
  tileWidth: number;
  tileHeight: number;
  chunkSize: number;
  chunksWidth: number;
  chunksHeight: number;
}

export interface ScenarioPosition {
  x: number;
  y: number;
}

export interface ScenarioStartingState {
  minuteOfDay: number;
  party: string[];
  scene: string;
  position: ScenarioPosition;
}

export interface ScenarioMap {
  name: string;
  filename: string;
  x: number;
  y: number;
}

export interface Scenario {
  config: ScenarioConfig;
  startingState: ScenarioStartingState;
  maps: ScenarioMap[];
  scenes: Record<string, string[]>;
}
