"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan = require("bunyan");
const enviroment_1 = require("./enviroment");
exports.logger = bunyan.createLogger({
    name: enviroment_1.enviroment.log.name,
    level: bunyan.resolveLevel(enviroment_1.enviroment.log.level)
});
//# sourceMappingURL=logger.js.map