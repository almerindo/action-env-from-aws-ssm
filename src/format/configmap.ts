export const formatConfigmap = (prefix = '') =>
({Name, Value}) => `${prefix}${Name}: ${Value}`

export const yaml2ConfigMap = (content) =>{
  
  const result = content.map((element) => {
    return "  " + element
  })

  const header = "apiVersion: v1\r\nkind: ConfigMap\r\nmetadata:\r\n  name: ${KUBE_NAME}\r\n  namespace: ${KUBE_NAME}-env-cm\r\ndata:\r\n"
  const body = result.join('\n').toString();
  return header + body
}