"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloud_1 = require("./cloud");
exports.Cloud = cloud_1.Cloud;
function init(config) {
    return new cloud_1.Cloud(config);
}
exports.init = init;
