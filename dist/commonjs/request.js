"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
class Request {
    constructor(config) {
        this.config = config;
    }
    async send(action, data) {
        const params = Object.assign({}, data, {
            action
        });
        const slowQueryWarning = setTimeout(() => {
            console.warn('Database operation is longer than 3s. Please check query performance and your network environment.');
        }, 3000);
        const token = this.config.getAccessToken();
        try {
            const res = await axios_1.default
                .post(this.config.entryUrl, params, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                timeout: this.config.timeout
            });
            return res.data;
        }
        finally {
            clearTimeout(slowQueryWarning);
        }
    }
}
exports.Request = Request;
