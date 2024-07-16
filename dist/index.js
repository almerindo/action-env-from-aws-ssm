"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const AWS = require("aws-sdk");
const format_1 = require("./format");
const fs_1 = require("fs");
const configmap_1 = require("./format/configmap");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const region = process.env.AWS_DEFAULT_REGION;
        const ssm = new AWS.SSM({ region });
        try {
            const ssmPath = core.getInput('ssm-path', { required: true });
            const format = core.getInput('format', { required: true });
            const output = core.getInput('output', { required: true });
            const prefix = core.getInput('prefix');
            const allParameters = [];
            const withDecryption = core.getInput('decryption') === 'true';
            let nextToken;
            try {
                do {
                    const result = yield ssm
                        .getParametersByPath({
                        WithDecryption: withDecryption,
                        Path: ssmPath,
                        Recursive: true,
                        NextToken: nextToken,
                    })
                        .promise();
                    core.debug(`parameters length: ${result.Parameters.length}`);
                    nextToken = result.NextToken;
                    allParameters.push(...result.Parameters);
                } while (nextToken);
                const envs = allParameters
                    .map(p => ({
                    Value: p.Value,
                    Name: p.Name.split('/').pop(),
                }))
                    .map(format_1.formatter(format)(prefix));
                if (envs.length > 0) {
                    envs.push('\n');
                }
                let content = envs.join('\n');
                if (format === "configmap") {
                    content = configmap_1.yaml2ConfigMap(envs);
                }
                if (fs_1.existsSync(output)) {
                    console.log(`append to ${output} file`);
                    fs_1.appendFileSync(output, '\n' + content);
                }
                else {
                    console.log(`create ${output} file`);
                    fs_1.writeFileSync(output, content);
                }
            }
            catch (e) {
                core.error(e);
                core.setFailed(e.message);
            }
        }
        catch (e) {
            core.setFailed(e.message);
        }
    });
}
run();
