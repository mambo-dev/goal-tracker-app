import sgMail from "@sendgrid/mail";

function getSendGridApiKey(): string {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error("no sendgrid api key");
  }
  return process.env.SENDGRID_API_KEY;
}

sgMail.setApiKey(getSendGridApiKey());

type EmailMsgType = {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
};

export default async function sendEmail(message: EmailMsgType) {
  try {
    await sgMail.send(message);
  } catch (error: any) {
    throw new Error(error.message);
  }
}
