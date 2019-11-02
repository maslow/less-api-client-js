import { Db } from './database';
interface Config {
    entryUrl: string;
    getAccessToken: Function;
    timeout?: number;
}
declare class Cloud {
    private config;
    constructor(config: Config);
    database(): Db;
}
export { Cloud, Config };
