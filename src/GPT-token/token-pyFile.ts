import { PythonShell } from "python-shell";
import { config } from "../config";

const options = {
  pythonPath: config.pyPath, // Optional: Specify the path to your Conda environment's Python executable if needed
  pythonOptions: ["-u"], // get print results in real-time
  scriptPath: "src/GPT-token/", // Optional: Specify the path to the directory containing your Python script
  args: [config.MAIL, config.PASSWORD]
};

export function getToken() {
    PythonShell.run("OpenAIAuth.py", options).then((message: string[]) => {
        // results is an array of messages printed by the Python script
        console.log("GPT token received");
        config.authGPT = message[0];
    });
}