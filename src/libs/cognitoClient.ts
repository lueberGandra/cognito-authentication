import { CognitoIdentityProviderClient, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';

type ISignUp = {
    Password: string, Username: string, firstName: string, lastName: string
}
export const signUp = async ({ Password, Username, firstName, lastName }: ISignUp):Promise<string|undefined> => {
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
    const {UserSub} = await cognitoClient.send(command);
    return UserSub;
  } catch (error) {
    throw new Error('Cognito signup failed!');
  }
};


