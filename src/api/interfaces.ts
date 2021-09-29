export interface IVideoConfigEntry {
    slug: string;
    manifestURL: string;
    callNumber: string;
}


export interface IConfig {
    videos: Array<IVideoConfigEntry>;
}
