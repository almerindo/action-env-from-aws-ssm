import {formatShell} from './shell'
import {formatDotenv} from './dotenv'
import {formatYaml} from './yaml'
import {formatConfigmap, FormattedParameter} from './configmap'

export type {FormattedParameter}

type ParameterFormatter = (parameter: FormattedParameter) => string

export function formatter(type: string, prefix = ''): ParameterFormatter {
  if (type === 'shell') {
    return formatShell(prefix)
  }
  if (type === 'dotenv') {
    return formatDotenv(prefix)
  }
  if (type === 'yaml') {
    return formatYaml(prefix)
  }
  if (type === 'configmap') {
    return formatConfigmap(prefix)
  }
  return ({Name, Value}: FormattedParameter) => `${Name}=${Value}`
}
