## 初回実行
```
$ nvm use #scout-infra/cdkディレクトリで
$ npm install -g yarn
$ yarn install
```

## テスト
### スナップショットテスト
設定内容が変わると、スナップショットテストが失敗します。
意図した設定変更の場合は、スナップショットを更新してください。
```
yarn test -- -u <test.tsファイル>
```

## cdk-nagについて
セキュリティ的に危険な設定は、[cdk-nag](https://github.com/cdklabs/cdk-nag)にて検知されエラーを返します。
エラーメッセージに従って、cdkを修正してください。

cdk-nagの抑制が必要なものは、[抑制ルール](https://github.com/cdklabs/cdk-nag#suppressing-a-rule)を作成してください。
よく使われる抑制ルールは`cdk-nag/`配下に用意しています。

```
# 使用例
const service = new ecs.FargateService(...
new FargateCommonSuppresions(service)
```

## デプロイ
GitHub Actionsで自動で行われます。

### ステージング環境へのデプロイ
- mainブランチに向けてPRを作成
    - CodeBuild で `cdk diff "*"` が実行されます。([deploy-stg.yml](../.github/workflows/deploy-stg-infra.yml))
    - Succeeded GitHub Actions と出ている場合は job から差異を確認してください。
    - Failed GitHub Actions と出ている場合は job からエラー内容を確認してください。
- 問題なければmainブランチにマージ
    - CodeBuildで `cdk deploy "*"` が実行されます。([deploy-stg.yml](../.github/workflows/deploy-stg-infra.yml))
    - Succeeded GitHub Actions と出ていればステージング環境に変更内容が反映されます。
    - Failed GitHub Actions と出ている場合は job からエラー内容を確認してください。

### 本番環境へのデプロイ
- mainブランチに向けてPRを作成(もしくはワークフロー手動実行)
    - CodeBuildで `cdk diff "*"` が実行されます。([deploy-prd.yml](../.github/workflows/deploy-prd-infra.yml))
    - 差異とエラーの確認方法は、ステージング環境と同様です。

- リリースタグを切る
    - CodeBuildで `cdk deploy "*"` が実行されます。([deploy-prd.yml](../.github/workflows/deploy-prd-infra.yml)
    - エラーの確認方法は、ステージング環境と同様です。

## 手動デプロイ
GitHub Actionsが動かない、ステージングへの変更でGitHub Actions経由でデプロイするのが面倒な場合などは下記の手順で手動デプロイしてください。(手動で行う場合でも変更内容をGitHubに反映するのを忘れずに)

1. AWS environment variablesをコピー＆ペースト
```
export AWS_ACCESS_KEY_ID=""
export AWS_SECRET_ACCESS_KEY=""
export AWS_SESSION_TOKEN=""
```
2. `npm run cdk:stg ls` でスタック一覧を確認できます。([package.json](package.json) に scripts を登録してあります)
3. `npm run cdk:stg diff "スタック名"` で指定されたスタックに加えた変更を確認できます。
4. `npm run cdk:stg deploy "スタック名"` で指定されたスタックに加えた変更をデプロイできます。

## 備考
**[CDKのコマンド](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/cli.html)**
以下のコマンドは、yarnで環境名を渡して実行してください。
例) yarn cdk:stg ls # cdk lsの場合

- `cdk ls` 
    - アプリ内のスタックを一覧表示
- `cdk synth`
    - 指定されたスタックのCloudFormationテンプレートを合成して表示
- `cdk deploy`
    - 指定されたスタックをデプロイ
- `cdk destroy`
    - 指定されたスタックを削除
- `cdk diff`
    - 指定したスタックをデプロイ済みスタック、またはローカルのCloudFormationテンプレートと比較