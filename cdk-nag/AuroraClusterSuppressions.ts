import { Stack } from "aws-cdk-lib"
import * as rds from "aws-cdk-lib/aws-rds"
import { NagSuppressions } from "cdk-nag"

export class AuroraClusterSuppressions {
  constructor(stack: Stack, cluster: rds.IDatabaseCluster) {
    NagSuppressions.addResourceSuppressions(
      cluster,
      [
        // シークレットのローテーションは行わない
        {
          id: "AwsSolutions-SMG4",
          reason: "secret no rotation"
        },
        // serveless clusterのルール　warnになってしまう
        {
          id: "AwsSolutions-RDS6",
          reason: "iam database authentication enabled"
        },
        // mysqlデフォルトポートを使用する
        {
          id: "AwsSolutions-RDS11",
          reason: "use default mysql port."
        },
        {
          id: "AwsSolutions-RDS16",
          reason: "servelress cluster rule"
        }
      ],
      true
    )
    NagSuppressions.addStackSuppressions(stack, [
      // logsへのエクスポートの際に作られるIAMロールにManagedRuleとワイルドカードが含まれている
      {
        id: "AwsSolutions-IAM4",
        reason: "logs role auto create"
      },
      {
        id: "AwsSolutions-IAM5",
        reason: "logs role auto create"
      }
    ])
  }
}
