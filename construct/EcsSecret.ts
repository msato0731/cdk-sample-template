import { Construct } from "constructs"
import * as ecs from "aws-cdk-lib/aws-ecs"
import * as ssm from "aws-cdk-lib/aws-ssm"
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager"
export class EcsSecret extends Construct {
  static fromSsmSecret(
    scope: Construct,
    attrs: ssm.SecureStringParameterAttributes
  ) {
    return ecs.Secret.fromSsmParameter(
      ssm.StringParameter.fromSecureStringParameterAttributes(
        scope,
        attrs.parameterName,
        attrs
      )
    )
  }
  static fromSecretsManager(
    scope: Construct,
    secretName: string,
    field?: string
  ) {
    return ecs.Secret.fromSecretsManager(
      secretsmanager.Secret.fromSecretNameV2(scope, secretName, secretName),
      field ? field : undefined
    )
  }
}
