import {FormattedParameter} from './configmap'

export const formatYaml = (prefix = '') =>
  ({Name, Value}: FormattedParameter) => `${prefix}${Name}: ${Value}`
