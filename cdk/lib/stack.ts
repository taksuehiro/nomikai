import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class NomikaiOptimizerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda関数
    const optimizeFunction = new lambda.Function(this, 'OptimizeFunction', {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'lambda_function.lambda_handler',
      code: lambda.Code.fromAsset('../lambda'),
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
    });

    // Bedrockへのアクセス権限を付与
    optimizeFunction.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'bedrock:InvokeModel',
        ],
        resources: [
          `arn:aws:bedrock:${this.region}::inference-profile/us.anthropic.claude-3-5-sonnet-20241022-v2`,
        ],
      })
    );

    // API Gateway
    const api = new apigateway.RestApi(this, 'NomikaiOptimizerApi', {
      restApiName: '飲み会席順オプティマイザー API',
      description: '飲み会の席順を最適化するAPI',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
      },
    });

    // Lambda統合
    const optimizeIntegration = new apigateway.LambdaIntegration(optimizeFunction, {
      requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
    });

    // /optimize エンドポイント
    api.root.addResource('optimize').addMethod('POST', optimizeIntegration);

    // スタック出力
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: api.url,
      description: 'API Gateway エンドポイント URL',
    });
  }
}
