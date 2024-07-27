import type { APIGatewayProxyEventV2 } from "aws-lambda";

import { bodyParser } from "@/utils/bodyParser";
import { resetPassword } from "@/libs/cognitoClient";

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const { code, email, newPassword } = bodyParser(event.body ?? "");
    return await resetPassword({
      ConfirmationCode: code,
      Username: email,
      Password: newPassword,
    });
  } catch (error) {
    throw new Error("Confirmation failed!");
  }
}
