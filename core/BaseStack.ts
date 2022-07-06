import { Stack, StackProps, Tags } from "aws-cdk-lib"
import { Construct } from "constructs"
import { ConfigProps } from "./ConfigProps"
import { getConfig } from "./GetConfig"
import { commonConfig } from "../env/common"
import * as ec2 from "aws-cdk-lib/aws-ec2"
import * as ssm from "aws-cdk-lib/aws-ssm"

export class BaseStack extends Stack {
  envName: string
  config: ConfigProps
  commonConfig = commonConfig
  vpc: ec2.IVpc

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)
    // test時にenvNameをtryGetContextで取れないため
    this.envName = process.env.TEST ? "ins" : scope.node.tryGetContext("config")
    this.config = getConfig(this.envName)
    this.vpc = this.getVpc()
  }
  generatePrefix(serviceName: string) {
    // SampleAをsample-aにする
    return serviceName
      .split(/(?=[A-Z])/)
      .join("-")
      .toLowerCase()
  }
  private getVpc() {
    const vpcId = ssm.StringParameter.valueFromLookup(this, "/cdk/vpc/vpcId")
    const subnets = this.setSubnets()
    const vpc = ec2.Vpc.fromVpcAttributes(this, "Vpc", {
      availabilityZones: [
        "ap-northeast-1a",
        "ap-northeast-1c",
        "ap-northeast-1d"
      ],
      vpcId,
      vpcCidrBlock: "192.168.0.0/16",
      privateSubnetIds: subnets.privateSubnetIds,
      privateSubnetRouteTableIds: subnets.privateSubnetRouteTableIds,
      publicSubnetIds: subnets.publicSubnetIds,
      publicSubnetRouteTableIds: subnets.publicSubnetRouteTableIds
    })
    return vpc
  }
  private setSubnets() {
    const ssmParamPrefix = "/cdk/vpc/subnet/main"
    const azIds = ["a", "c", "d"]

    const privateSubnetIds = azIds.map((azId) => {
      return this.getSsmValue(`${ssmParamPrefix}/private/${azId}/subnetId`)
    })
    const privateSubnetRouteTableIds = azIds.map((azId) => {
      return this.getSsmValue(`${ssmParamPrefix}/private/${azId}/routeTableId`)
    })
    const publicSubnetIds = azIds.map((azId) => {
      return this.getSsmValue(`${ssmParamPrefix}/public/${azId}/subnetId`)
    })
    const publicSubnetRouteTableIds = azIds.map((azId) => {
      return this.getSsmValue(`${ssmParamPrefix}/public/${azId}/routeTableId`)
    })
    return {
      privateSubnetIds,
      privateSubnetRouteTableIds,
      publicSubnetIds,
      publicSubnetRouteTableIds
    }
  }
  private setTags() {
    Tags.of(this).add("CDK", "true")
    Tags.of(this).add("Env", this.envName)
    // リポジトリ名を指定
    Tags.of(this).add("Repository", "")
    // Service名を指定　ex) ltd,ltp...
    Tags.of(this).add("Service", "")
    if (this.config.datadogEnable) {
      Tags.of(this).add("Datadog", "monitored")
    }
  }
  public getSsmValue(parameterName: string) {
    return ssm.StringParameter.valueFromLookup(this, parameterName)
  }
}
