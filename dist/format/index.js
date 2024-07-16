"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatter = void 0;
const shell_1 = require("./shell");
const dotenv_1 = require("./dotenv");
const yaml_1 = require("./yaml");
const configmap_1 = require("./configmap");
function formatter(type) {
    if (type === 'shell') {
        return shell_1.formatShell;
    }
    if (type === 'dotenv') {
        return dotenv_1.formatDotenv;
    }
    if (type === 'yaml') {
        return yaml_1.formatYaml;
    }
    if (type === 'configmap') {
        return configmap_1.formatConfigmap;
    }
    return _ => _;
}
exports.formatter = formatter;
