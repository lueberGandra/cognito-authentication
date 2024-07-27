import { response } from "@/utils/response";
import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";

export async function handler(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
  try {
    const userId = event.requestContext.authorizer.jwt.claims.sub;
    return response(200, { profile: userId });
  } catch (error) {
    return response(500, { error: "Internal server error." });
  }
}
