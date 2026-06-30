import * as core from '@actions/core'
import {
  GetParametersByPathCommand,
  Parameter,
  SSMClient,
} from '@aws-sdk/client-ssm'
import {appendFileSync, existsSync, writeFileSync} from 'fs'
import {formatter, FormattedParameter} from './format'
import {yaml2ConfigMap} from './format/configmap'

type SsmParameter = Pick<Parameter, 'Name' | 'Value'>

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

async function run() {
  const region = process.env.AWS_DEFAULT_REGION
  const ssm = new SSMClient({region})

  try {
    const ssmPath = core.getInput('ssm-path', {required: true})
    const format = core.getInput('format', {required: true})
    const output = core.getInput('output', {required: true})
    const prefix = core.getInput('prefix')
    const allParameters: SsmParameter[] = []
    const withDecryption = core.getInput('decryption') === 'true'
    let nextToken: string | undefined

    try {
      do {
        const result = await ssm.send(
          new GetParametersByPathCommand({
            WithDecryption: withDecryption,
            Path: ssmPath,
            Recursive: true,
            NextToken: nextToken,
          }),
        )

        core.debug(`parameters length: ${result.Parameters?.length ?? 0}`)
        nextToken = result.NextToken
        if (result.Parameters) {
          allParameters.push(...result.Parameters)
        }
      } while (nextToken)

      const envs = allParameters
        .map<FormattedParameter>(p => ({
          Value: p.Value,
          Name: p.Name?.split('/').pop() ?? '',
        }))
        .map<string>(formatter(format, prefix))
      if (envs.length > 0) {
        envs.push('\n')
      }

      let content = envs.join('\n')

      if (format === 'configmap') {
        content = yaml2ConfigMap(envs)
      }

      if (existsSync(output)) {
        console.log(`append to ${output} file`)
        appendFileSync(output, '\n' + content)
      } else {
        console.log(`create ${output} file`)
        writeFileSync(output, content)
      }
    } catch (error) {
      core.error(getErrorMessage(error))
      core.setFailed(getErrorMessage(error))
    }
  } catch (error) {
    core.setFailed(getErrorMessage(error))
  }
}

run()
