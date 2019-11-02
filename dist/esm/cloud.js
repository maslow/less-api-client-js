import { Db } from './database';
import { Request } from './request';
class Cloud {
    constructor(config) {
        this.config = {
            entryUrl: config.entryUrl,
            getAccessToken: config.getAccessToken,
            timeout: config.timeout || 15000
        };
    }
    database() {
        Db.reqClass = Request;
        Db.getAccessToken = this.config.getAccessToken;
        return new Db(Object.assign({}, this.config));
    }
}
export { Cloud };
