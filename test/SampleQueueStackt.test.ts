process.env.TEST = "true"
import * as cdk from "aws-cdk-lib"
import { Template } from "aws-cdk-lib/assertions"
import { SampleQueueStack } from "../lib/sample-project/SampleQueueStack"

test("snapshot test", () => {
  // const app = new cdk.App()
  // const env = { account: "1111111111", region: "ap-northeast-1" }
  // const stack = new SampleQueueStack(app, "SampleQueue", {
  //   env
  // })
  // // 生成したテンプレートとスナップショットが同じか検証
  // expect(Template.fromStack(stack)).toMatchSnapshot()
})
