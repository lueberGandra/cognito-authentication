import { response } from '@/utils/response';
import { CognitoIdentityProviderClient, ConfirmSignUpCommand, SignUpCommand, UsernameExistsException } from '@aws-sdk/client-cognito-identity-provider';

type ISignUp = {
  Password: string, Username: string, firstName: string, lastName: string
}

const ClientId = process.env.COGNITO_CLIENT_ID;
export const signUp = async ({ Password, Username, firstName, lastName }: ISignUp): Promise<any> => {
  try {
    const cognitoClient = new CognitoIdentityProviderClient({});
    const command = new SignUpCommand({
      ClientId,
      Password, Username,
      UserAttributes: [{
        Name: 'given_name', Value: firstName
      },
      {
        Name: 'family_name', Value: lastName
      }
      ]
    });
    const { UserSub } = await cognitoClient.send(command);
    return response(201, { userExternalId: UserSub });
  } catch (error) {
    if (error instanceof UsernameExistsException) {
      return response(409, { error: 'This email is already in use.' });
    }
    return response(500, { error: 'Internal server error.' });
  }
};

type IAccountConfirmation = {
  ConfirmationCode: string, Username: string
}

export const accountConfirmation = async ({ ConfirmationCode, Username }: IAccountConfirmation): Promise<any> => {
  try {
    const cognitoClient = new CognitoIdentityProviderClient({});
    const command = new ConfirmSignUpCommand({
      ClientId, Username, ConfirmationCode
    });
    await cognitoClient.send(command);
    return response(204);
  } catch (error) {
    return response(500, { error: 'Internal server error.' });
  }
};
