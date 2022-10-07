/* eslint @typescript-eslint/no-var-requires: "off" */
import { QuestionBank } from "./domain/QuestionBank";
import { Question } from "./models/Question";
import { Answer } from "./models/Answer";
import { AnswerBank } from "./domain/AnswerBank";
import { getQuestions, getAnswers, getInput } from "./utils/helpers";
import { craqValidation } from "./craq_validation";
import { getLogger } from "./utils/klogger";
import { logLevel, questionFilePath, answerFilePath } from "./utils/config";

// Get env configs
if (!logLevel || logLevel == "") {
  throw new Error("Please set your LOG_LEVEL in a .env file");
}
// get Logger
const logger = getLogger(logLevel);

async function main() {
  // check for questions
  if (!questionFilePath || questionFilePath == "") {
    throw new Error("Please set your QUESTION_FILE in a .env file");
  }
  // Questions
  const questions: QuestionBank = await getQuestions(logger, questionFilePath);
  // validate answers
  let processed_answers: boolean = false;
  if (answerFilePath !== undefined && answerFilePath !== "") {
    const answers: AnswerBank = await getAnswers(logger, answerFilePath);
    await craqValidation(questions, answers.getAllAnswers());
    processed_answers = true;
  }
  if (!processed_answers) {
    // display questions and prompt for answers without answer file
    const question_map: Map<string, Question> = questions.getAllQuestions();
    const cli_answers: Answer[] = [];
    question_map.forEach((value: Question, key: string) => {
      logger.info(key.toUpperCase());
      value.tostring();
      //get user input
      let index: number = -1;
      const readlineSync = require("readline-sync");
      index = parseInt(readlineSync.question("Select answer option index [x] ? "));
      if (index !== -1) {
        const answer = new Answer(key, index);
        logger.info(""); // beautify
        logger.info(answer.question_key + ": " + answer.answer_index);
        cli_answers.push(answer);
      }
    });
    getInput.close();
    await craqValidation(questions, cli_answers);
  }

  process.exit();
}

main().catch(err => logger.error(err.message));
