export interface IVideoConfigEntry {
  slug: string;
  manifestURL: string;
  callNumber: string;
  [key: string]: string;
}

export interface ControlBarLinkConfig {
  property: string;
  label: string;
}

export interface IConfig {
  videos: Array<IVideoConfigEntry>;
  onlyUseCriticalEditions?: boolean;
  ignoreVideoPartLabels?: boolean;
  controlBarLinks?: Array<ControlBarLinkConfig>;
}
