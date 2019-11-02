"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const request_1 = require("./request");
class Cloud {
    constructor(config) {
        this.config = {
            entryUrl: config.entryUrl,
            getAccessToken: config.getAccessToken,
            timeout: config.timeout || 15000
        };
    }
    database() {
        database_1.Db.reqClass = request_1.Request;
        database_1.Db.getAccessToken = this.config.getAccessToken;
        return new database_1.Db(Object.assign({}, this.config));
    }
}
exports.Cloud = Cloud;
