import dotenv from "dotenv";

dotenv.config();

const { TOKEN, CLIENT_ID, MAIL, PASSWORD, GPT_API } = process.env;

if (!TOKEN || !CLIENT_ID || !MAIL || !PASSWORD || !GPT_API) {
  throw new Error("Missing environment variables");
}

export const config = {
  TOKEN,
  CLIENT_ID,
  MAIL,
  PASSWORD,
  GPT_API,
  authGPT: ""
};
