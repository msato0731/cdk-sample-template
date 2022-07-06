import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2"
import { NagSuppressions } from "cdk-nag"

export class AlbSuppresions {
  constructor(alb: elbv2.ApplicationLoadBalancer) {
    NagSuppressions.addResourceSuppressions(
      alb,
      [
        {
          // 本番デプロイ環境はセキュリティグループ 0.0.0.0で公開するひつようがある
          id: "AwsSolutions-EC23",
          reason: "prduction allows for 0.0.0.0/0 or ::/0 inbound access."
        }
      ],
      true
    )
  }
}
