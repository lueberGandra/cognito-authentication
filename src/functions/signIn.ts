import type { APIGatewayProxyEventV2 } from 'aws-lambda';

import { bodyParser } from '@/utils/bodyParser';
import { signIn } from '@/libs/cognitoClient';

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const { password, email } = bodyParser(event.body ?? '');
    return await signIn({
      PASSWORD: password,
      USERNAME: email
    });

  } catch (error) {
    throw new Error('Signin failed!');
  }
}
