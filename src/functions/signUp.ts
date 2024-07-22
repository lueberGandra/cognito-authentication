import { bodyParser } from '@/utils/bodyParser';
import { response } from '@/utils/response';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

export async function handler(event:APIGatewayProxyEventV2) {
  const body = bodyParser(event.body??'');
  return response(200, { hello: 'world!' });
}
