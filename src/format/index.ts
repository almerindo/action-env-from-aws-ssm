import {formatShell} from './shell'
import {formatDotenv} from './dotenv'
import {formatYaml} from './yaml'
import { formatConfigmap } from './configmap'

export function formatter(type: 'shell' | 'dotenv' | 'yaml' | 'configmap' | string) {
  if (type === 'shell') {
    return formatShell
  }
  if (type === 'dotenv') {
    return formatDotenv
  }
  if (type === 'yaml') {
    return formatYaml
  }
  if (type === 'configmap') {
    return formatConfigmap
  }
  return _ => _
}
