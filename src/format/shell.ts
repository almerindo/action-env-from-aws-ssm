import {FormattedParameter} from './configmap'

export const formatShell = (prefix = '') =>
  ({Name, Value}: FormattedParameter) => `export ${prefix}${Name}=${Value}`
