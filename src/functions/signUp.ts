import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { } from '@aws-sdk/client-cognito-identity-provider';

import { bodyParser } from '@/utils/bodyParser';
import { signUp } from '@/libs/cognitoClient';

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const { firstName, lastName, password, email } = bodyParser(event.body ?? '');
    return await signUp({
      firstName: firstName,
      lastName: lastName,
      Password: password,
      Username: email
    });

  } catch (error) {
    throw new Error('Signup failed!');
  }
}
