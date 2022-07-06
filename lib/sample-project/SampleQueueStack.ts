import { StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import * as sqs from "aws-cdk-lib/aws-sqs"
import { BaseStack } from "../../core/BaseStack"
import { NagSuppressions } from "cdk-nag"

export class SampleQueueStack extends BaseStack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const dq = new sqs.Queue(this, "DeadletterQueue", {
      encryption: sqs.QueueEncryption.KMS_MANAGED
    })
    new sqs.Queue(this, "Queue", {
      encryption: sqs.QueueEncryption.KMS_MANAGED,
      deadLetterQueue: {
        maxReceiveCount: 10,
        queue: dq
      }
    })

    NagSuppressions.addResourceSuppressions(
      dq,
      [
        {
          id: "AwsSolutions-SQS3",
          reason: "deadletter queue"
        }
      ],
      true
    )
  }
}
