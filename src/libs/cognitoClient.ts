import { response } from '@/utils/response';
import { CognitoIdentityProviderClient, ConfirmSignUpCommand, InitiateAuthCommand, SignUpCommand, UsernameExistsException, UserNotConfirmedException, UserNotFoundException } from '@aws-sdk/client-cognito-identity-provider';

const ClientId = process.env.COGNITO_CLIENT_ID;

type ISignUp = {
  Password: string, Username: string, firstName: string, lastName: string
}

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

type ISignIn = {
  Password: string, Username: string
}

export const signIn = async ({ Password, Username }: ISignIn): Promise<any> => {
  try {
    const cognitoClient = new CognitoIdentityProviderClient({});
    const command = new InitiateAuthCommand({
      ClientId,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        Username, Password
      }
    });
    const { AuthenticationResult } = await cognitoClient.send(command);

    if (!AuthenticationResult) {
      return response(401, { response: 'Invalid credentials.' });
    }
    return response(201, { response: AuthenticationResult });
  } catch (error) {
    if (error instanceof UserNotFoundException) {
      return response(401, { response: 'Invalid credentials.' });
    }

    if (error instanceof UserNotConfirmedException) {
      return response(401, { response: 'You need to confirm your account before signin.' });
    }

    return response(500, { error: 'Internal server error.' });
  }
};
