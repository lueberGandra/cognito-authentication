import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { } from '@aws-sdk/client-cognito-identity-provider';

import { bodyParser } from '@/utils/bodyParser';
import { response } from '@/utils/response';
import { signUp } from '@/libs/cognitoClient';

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const body = bodyParser(event.body ?? '');
    const userExternalId = await signUp({
      firstName:body.firstName,
      lastName:body.lastName,
      Password:body.password,
      Username:body.email
    });
    
    return response(201, { userExternalId });
  } catch (error) {
    throw new Error('Signup failed!');
  }
}
