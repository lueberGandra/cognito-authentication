import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { } from '@aws-sdk/client-cognito-identity-provider';

import { bodyParser } from '@/utils/bodyParser';
import { accountConfirmation } from '@/libs/cognitoClient';

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const { code, email } = bodyParser(event.body ?? '');
    return await accountConfirmation({
      ConfirmationCode: code, Username: email
    });

  } catch (error) {
    throw new Error('Confirmation failed!');
  }
}
