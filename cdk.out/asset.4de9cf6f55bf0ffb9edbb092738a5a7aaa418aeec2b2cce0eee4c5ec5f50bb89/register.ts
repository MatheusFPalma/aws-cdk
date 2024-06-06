import { APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  // Verificar se event.body não é null
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Body da requisição não pode ser vazio' }),
    };
  }

  let requestBody;
  try {
    requestBody = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Body da requisição inválido, não pôde ser parseado' }),
    };
  }

  const vehicleId = requestBody.vehicleId;
  const vehicleData = requestBody.data;

  const params = {
    TableName: 'FleetTable',
    Item: {
      vehicleId: vehicleId,
      data: vehicleData,
    },
  };

  try {
    await docClient.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Veículo registrado com sucesso!' }),
    };
  } catch (error) {
    let errorMessage = 'Erro ao registrar o veículo';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ message: errorMessage }),
    };
  }
};
