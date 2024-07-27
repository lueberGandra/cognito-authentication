import { response } from "@/utils/response";
import {
  AdminGetUserCommand,
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  InitiateAuthCommand,
  NotAuthorizedException,
  SignUpCommand,
  UsernameExistsException,
  UserNotConfirmedException,
  UserNotFoundException,
} from "@aws-sdk/client-cognito-identity-provider";

const ClientId = process.env.COGNITO_CLIENT_ID;
const UserPoolId = process.env.COGNITO_POOL_ID;

type IAccountConfirmation = {
  ConfirmationCode: string;
  Username: string;
};

export const accountConfirmation = async ({
  ConfirmationCode,
  Username,
}: IAccountConfirmation): Promise<any> => {
  try {
    const cognitoClient = new CognitoIdentityProviderClient({});
    const command = new ConfirmSignUpCommand({
      ClientId,
      Username,
      ConfirmationCode,
    });
    await cognitoClient.send(command);
    return response(204);
  } catch (error) {
    return response(500, { error: "Internal server error." });
  }
};

type ISignIn = {
  PASSWORD: string;
  USERNAME: string;
};

export const signIn = async ({ PASSWORD, USERNAME }: ISignIn): Promise<any> => {
  try {
    const cognitoClient = new CognitoIdentityProviderClient({});
    const command = new InitiateAuthCommand({
      ClientId,
      AuthFlow: "USER_PASSWORD_AUTH",
      AuthParameters: {
        PASSWORD,
        USERNAME,
      },
    });
    const { AuthenticationResult } = await cognitoClient.send(command);

    if (!AuthenticationResult) {
      return response(401, { response: "Invalid credentials." });
    }
    return response(200, { response: AuthenticationResult });
  } catch (error) {
    if (error instanceof UserNotFoundException) {
      return response(401, { response: "Invalid credentials." });
    }

    if (error instanceof NotAuthorizedException) {
      return response(401, { response: "Invalid credentials." });
    }

    if (error instanceof UserNotConfirmedException) {
      return response(401, {
        response: "You need to confirm your account before signin.",
      });
    }

    return response(500, { error: "Internal server error." });
  }
};

type ISignUp = {
  Password: string;
  Username: string;
  firstName: string;
  lastName: string;
};

export const signUp = async ({
  Password,
  Username,
  firstName,
  lastName,
}: ISignUp): Promise<any> => {
  try {
    const cognitoClient = new CognitoIdentityProviderClient({});
    const command = new SignUpCommand({
      ClientId,
      Password,
      Username,
      UserAttributes: [
        {
          Name: "given_name",
          Value: firstName,
        },
        {
          Name: "family_name",
          Value: lastName,
        },
      ],
    });
    const { UserSub } = await cognitoClient.send(command);
    return response(201, { userExternalId: UserSub });
  } catch (error) {
    if (error instanceof UsernameExistsException) {
      return response(409, { error: "This email is already in use." });
    }
    return response(500, { error: "Internal server error." });
  }
};

type IRefreshToken = {
  REFRESH_TOKEN: string;
};

export const refreshToken = async ({
  REFRESH_TOKEN,
}: IRefreshToken): Promise<any> => {
  try {
    const cognitoClient = new CognitoIdentityProviderClient({});
    const command = new InitiateAuthCommand({
      ClientId,
      AuthFlow: "REFRESH_TOKEN",
      AuthParameters: { REFRESH_TOKEN },
    });
    const { AuthenticationResult } = await cognitoClient.send(command);

    if (!AuthenticationResult) {
      return response(401, { response: "Invalid credentials." });
    }
    return response(200, { response: AuthenticationResult });
  } catch (error) {
    return response(500, { error: "Internal server error." });
  }
};

type IGetUser = {
  Username: string;
};

export const getUser = async ({ Username }: IGetUser) => {
  try {
    const cognitoClient = new CognitoIdentityProviderClient({});
    const command = new AdminGetUserCommand({
      Username,
      UserPoolId,
    });
    const { UserAttributes } = await cognitoClient.send(command);
    return response(200, { profile: UserAttributes });
  } catch (error) {
    return response(500, { error: "Internal server error." });
  }
};

type IForgotPassword = {
  Username: string;
};
export const forgotPassword = async ({ Username }: IForgotPassword) => {
  try {
    const cognitoClient = new CognitoIdentityProviderClient({});
    const command = new ForgotPasswordCommand({
      ClientId,
      Username,
    });
    await cognitoClient.send(command);
    return response(204);
  } catch (error) {
    return response(500, { error: "Internal server error." });
  }
};

type IResetPassword = {
  ConfirmationCode: string;
  Username: string;
  Password: string;
};
export const resetPassword = async ({
  Username,
  ConfirmationCode,
  Password,
}: IResetPassword) => {
  try {
    const cognitoClient = new CognitoIdentityProviderClient({});
    const command = new ConfirmForgotPasswordCommand({
      ClientId,
      Username,
      ConfirmationCode,
      Password,
    });
    await cognitoClient.send(command);
    return response(204);
  } catch (error) {
    return response(500, { error: "Internal server error." });
  }
};
