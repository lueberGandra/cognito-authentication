import { getUser } from "@/libs/cognitoClient";
import { response } from "@/utils/response";
import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";

export async function handler(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
  try {
    const userId = event.requestContext.authorizer.jwt.claims.sub as string;
    return getUser({ Username: userId });
  } catch (error) {
    return response(500, { error: "Internal server error." });
  }
}
