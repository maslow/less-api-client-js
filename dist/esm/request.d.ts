import { Config } from './cloud';
export declare class Request {
    private config;
    constructor(config: Config);
    send(action: string, data: object): Promise<any>;
}
