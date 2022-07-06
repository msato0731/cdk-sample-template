import * as ecs from "aws-cdk-lib/aws-ecs"
import { NagSuppressions } from "cdk-nag"

export class FargateSuppresions {
  constructor(fargate: ecs.FargateService) {
    NagSuppressions.addResourceSuppressions(
      fargate.taskDefinition,
      [
        {
          // ecr:GetAuthorizationTokenのポリシーでワイルドカードが必要
          id: "AwsSolutions-IAM5",
          reason: "iam wildcard permission auto crete"
        }
      ],
      true
    )
  }
}
