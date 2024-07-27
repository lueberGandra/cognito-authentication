import type { APIGatewayProxyEventV2 } from 'aws-lambda';

import { bodyParser } from '@/utils/bodyParser';
import { refreshToken } from '@/libs/cognitoClient';

export async function handle(event: APIGatewayProxyEventV2) {
  try {
    const { refreshToken: REFRESH_TOKEN } = bodyParser(event.body ?? '');
    return await refreshToken({
      REFRESH_TOKEN
    });

  } catch (error) {
    throw new Error('Signin failed!');
  }
}
