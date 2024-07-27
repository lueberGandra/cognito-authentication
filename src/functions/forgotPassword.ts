import type { APIGatewayProxyEventV2 } from "aws-lambda";

import { bodyParser } from "@/utils/bodyParser";
import { forgotPassword } from "@/libs/cognitoClient";

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const { email } = bodyParser(event.body ?? "");
    return await forgotPassword({ Username: email });
  } catch (error) {
    throw new Error("Confirmation failed!");
  }
}
