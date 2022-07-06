#!/usr/bin/env node
import "source-map-support/register"
import * as cdk from "aws-cdk-lib"
import { AwsSolutionsChecks } from "cdk-nag"
import { SampleQueueStack } from "../lib/sample-project/SampleQueueStack"

const app = new cdk.App()
const envName = app.node.tryGetContext("config")
const context = app.node.tryGetContext(envName)
const env = { account: context.env.account, region: context.env.region }

const stackPrefix = `${envName}Sample`
// new SampleQueueStack(app, `${stackPrefix}SampleQueueStack`, { env })

cdk.Aspects.of(app).add(new AwsSolutionsChecks())

app.synth()
