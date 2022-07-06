import { Construct } from "constructs"
import * as ecs from "aws-cdk-lib/aws-ecs"
import { EcsSecret } from "./EcsSecret"

export interface DatadogEcsLogDriverProps {
  clusterName: string
  containerName: string
  ddTags: {
    role: string
    service: string
  }
  ddApiKeyName: string
}

export class DatadogEcsLogDriver extends Construct {
  logDriver: ecs.FireLensLogDriver
  constructor(scope: Construct, id: string, props: DatadogEcsLogDriverProps) {
    super(scope, id)
    const ddApiKey = EcsSecret.fromSecretsManager(
      this,
      props.ddApiKeyName,
      "DD_API_KEY"
    )

    this.logDriver = new ecs.FireLensLogDriver({
      options: {
        dd_service: props.ddTags.role,
        dd_host: props.clusterName,
        dd_source: props.containerName,
        dd_tags: `Service:${props.ddTags.service} Role:${props.ddTags.role}`,
        dd_message_key: "log",
        Name: "datadog",
        Host: "http-intake.logs.datadoghq.com",
        TLS: "on",
        provider: "ecs"
      },
      secretOptions: {
        apikey: ddApiKey
      }
    })
  }
}
