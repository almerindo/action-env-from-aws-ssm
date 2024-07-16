"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yaml2ConfigMap = exports.formatConfigmap = void 0;
exports.formatConfigmap = (prefix = '') => ({ Name, Value }) => `${prefix}${Name}: "${Value}"`;
exports.yaml2ConfigMap = (content) => {
    const result = content.map((element) => {
        return "  " + element;
    });
    const header = "apiVersion: v1\r\nkind: ConfigMap\r\nmetadata:\r\n  name: ${KUBE_NAME}-env-cm\r\n  namespace: ${KUBE_NAME}\r\ndata:\r\n";
    const body = result.join('\n').toString();
    return header + body;
};
