export type FormattedParameter = {
  Name: string
  Value?: string
}

export const formatConfigmap = (prefix = '') =>
  ({Name, Value}: FormattedParameter) => `${prefix}${Name}: "${Value}"`

export const yaml2ConfigMap = (content: string[]) => {
  const result = content.map(element => '  ' + element)

  const header =
    'apiVersion: v1\r\nkind: ConfigMap\r\nmetadata:\r\n  name: ${KUBE_NAME}-env-cm\r\n  namespace: ${KUBE_NAME}\r\ndata:\r\n'
  const body = result.join('\n')
  return header + body
}
