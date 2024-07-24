import { response } from '@/utils/response';
import { CognitoIdentityProviderClient, SignUpCommand, UsernameExistsException } from '@aws-sdk/client-cognito-identity-provider';

type ISignUp = {
  Password: string, Username: string, firstName: string, lastName: string
}
export const signUp = async ({ Password, Username, firstName, lastName }: ISignUp): Promise<any> => {
  try {
    const cognitoClient = new CognitoIdentityProviderClient({});
    const command = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
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


