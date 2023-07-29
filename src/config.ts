import dotenv from "dotenv";

dotenv.config();

const { TOKEN, CLIENT_ID, MAIL, PASSWORD, pyPath } = process.env;

if (!TOKEN || !CLIENT_ID || !MAIL || !PASSWORD) {
  throw new Error("Missing environment variables");
}

export const config = {
  TOKEN,
  CLIENT_ID,
  MAIL,
  PASSWORD,
  authGPT: "",
  pyPath
};
