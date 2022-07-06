// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConfigProps {
  // primaryDomainName: string
  // secondaryDomainName?: string
  // ssmParamaterStore: {
  //   primaryCertArn: string
  //   secondaryCertArn?: string
  // }
  // defaultFargate: {
  //   cpu: number
  //   memoryMiB: number
  //   desiredCount: number
  // }
  // // LBをインターネットに公開するか
  // // trueにすると、0.0.0.0のSGがつく
  // defaultOpenListener: boolean
  // albLogBucketName: string
  datadog?: {
    secretName: string
  }
  datadogEnable: boolean
}
