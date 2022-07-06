import { Construct } from "constructs"
import * as ecs from "aws-cdk-lib/aws-ecs"
import { EcsSecret } from "./EcsSecret"
export interface DatadogContainerProps {
  imageName: string
  taskDefinition: ecs.FargateTaskDefinition
  ddApiKeyName: string
  ddTags: {
    service: string
    role: string
  }
  logging?: ecs.LogDriver
}

export class DatadogAgentContainer extends Construct {
  container: ecs.ContainerDefinition
  constructor(scope: Construct, id: string, props: DatadogContainerProps) {
    super(scope, id)
    const ddApiKey = EcsSecret.fromSecretsManager(
      this,
      props.ddApiKeyName,
      "DD_API_KEY"
    )
    this.container = props.taskDefinition.addContainer("dd-agent", {
      image: ecs.ContainerImage.fromRegistry(props.imageName),
      memoryLimitMiB: 256,
      logging: props.logging,
      environment: {
        DD_APM_ENABLED: "true",
        DD_TAGS: `Service:${props.ddTags.service} Role:${props.ddTags.role}`,
        ECS_FARGATE: "true"
      },
      secrets: {
        DD_API_KEY: ddApiKey
      }
    })
    this.container.addPortMappings({
      containerPort: 8126,
      protocol: ecs.Protocol.TCP,
      hostPort: 8126
    })
  }
}
