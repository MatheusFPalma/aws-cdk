import { Stack, StackProps, RemovalPolicy, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class FleetManagementStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Definindo a tabela DynamoDB com um nome único
    const fleetTable = new dynamodb.Table(this, 'FleetTable', {
      partitionKey: { name: 'vehicleId', type: dynamodb.AttributeType.STRING },
      tableName: `FleetTable-${this.stackName}`, // Nome exclusivo
      removalPolicy: RemovalPolicy.DESTROY // Apenas para fins de desenvolvimento
    });

    // Função Lambda para registrar veículos
    const registerVehicleLambda = new lambda.Function(this, 'RegisterVehicleHandler', {
      runtime: lambda.Runtime.NODEJS_18_X, // Use uma versão suportada mais recente, como nodejs18.x
      handler: 'register.handler',
      code: lambda.Code.fromAsset('lambda')
    });

    // Permissão para a Lambda acessar a tabela DynamoDB
    fleetTable.grantWriteData(registerVehicleLambda);

    // API Gateway para expor a Lambda
    const api = new apigateway.RestApi(this, 'FleetServiceApi', {
      restApiName: 'Fleet Service',
      description: 'Este serviço gerencia informações da frota.'
    });

    const registerVehicleIntegration = new apigateway.LambdaIntegration(registerVehicleLambda);
    const vehicle = api.root.addResource('vehicle');
    vehicle.addMethod('POST', registerVehicleIntegration);

    // Saída do endpoint da API
    new CfnOutput(this, 'ApiGatewayEndpoint', {
      value: api.url ?? 'Something went wrong with the deploy'
    });
  }
}
