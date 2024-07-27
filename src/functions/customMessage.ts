import { CustomMessageTriggerEvent } from "aws-lambda";

export async function handler(event: CustomMessageTriggerEvent) {
  const name = event.request?.userAttributes?.given_name;
  const code = event.request?.codeParameter;
  if (event.triggerSource === "CustomMessage_SignUp") {
    event.response.emailSubject = `Bem vindo(a) ${name}!`;
    event.response.emailMessage = `<h1>Seja muito bem vindo ${name}!</h1><br/>Use este código para confirmar a sua conta: ${code}`;
  }

  if (event.triggerSource === "CustomMessage_ForgotPassword") {
    event.response.emailSubject = "Recuperação de conta.";
    event.response.emailMessage = `Use este código para confirmar a sua conta: ${code}`;
  }

  return event;
}
