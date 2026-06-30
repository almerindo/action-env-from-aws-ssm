import {FormattedParameter} from './configmap'

export const formatDotenv = (prefix = '') =>
  ({Name, Value}: FormattedParameter) => `${prefix}${Name}=${Value}`
