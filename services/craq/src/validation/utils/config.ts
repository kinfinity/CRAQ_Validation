import { resolve } from "path";
import { config as dotenvConfig } from "dotenv";

dotenvConfig({ path: resolve(__dirname, "../../../.env.test") });
const questionFilePath: string | undefined = process.env.QUESTION_FILE;
const answerFilePath: string | undefined = process.env.ANSWER_FILE;
const logLevel: string | undefined = process.env.LOG_LEVEL;

export { questionFilePath, answerFilePath, logLevel };
