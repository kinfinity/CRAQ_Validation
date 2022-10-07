import { MessageState, Errors, Invalid, Valid } from "./utils/statusEnums";
import { Question } from "./models/Question";
import { QuestionBank } from "./domain/QuestionBank";
import { Answer } from "./models/Answer";
import { qa_lenth_valid } from "./utils/helpers";
import { getLogger } from "./utils/klogger";
import { Logger } from "winston";

// get Logger
let logger: Logger;
if (process.env.TEST === "true") {
  logger = getLogger("error");
} // logged only errors while running tests
else {
  logger = getLogger("info");
}

export function craqValidation(questionBank: QuestionBank, answers?: Array<Answer>): Map<string, MessageState> {
  // case answer {}
  if (answers == undefined || answers.length == 0) {
    const results = new Map<string, MessageState>();
    const questions = questionBank.getAllQuestions();
    questions.forEach((value: Question, key: string) => {
      results.set(key, Errors.unanswered);
      logger.info(key + " " + Errors.unanswered);
    });
    results.set("status", Errors.noanswers);
    logger.info(Errors.noanswers);
    return results;
  }
  // check answers.size < questions.size
  if (!qa_lenth_valid(answers, questionBank.getAllQuestions())) {
    logger.info(Invalid.excess_answers);
    return new Map<string, MessageState>().set("status", Invalid.excess_answers);
  }

  // check options
  const results = new Map<string, MessageState>();
  let return_set: boolean = false;
  const questions = questionBank.getAllQuestions();
  let terminal_state: boolean = false;

  answers.forEach((answer: Answer) => {
    // make sure answer is within options
    if (answer.answer_index >= questionBank.getQuestion(answer.question_key)._option_count) {
      return_set = true;
      logger.info(Invalid.outofindex_answer);
      return results.set("status", Invalid.outofindex_answer);
    }
    // check if previous question was skipped
    const previous_answer_index = parseInt(answer.question_key[1]) - 1;
    if (
      previous_answer_index >= 0 &&
      answers.filter(answer => {
        return answer.question_key === "q" + previous_answer_index;
      })[0] == undefined
    ) {
      return_set = true;
      logger.info(Invalid.skiped_previous + " " + "q" + previous_answer_index);
      return results.set("status", Invalid.skiped_previous);
    }
    // check terminal option
    if (!terminal_state && answer.answer_index == questionBank.getQuestion(answer.question_key)._terminal_index) {
      terminal_state = true;
      if (
        answers.filter(answer => {
          return answer.question_key === "q" + previous_answer_index + 2;
        })[0] == undefined
      ) {
        return_set = true;
        logger.info(answer.question_key + " " + Valid.right);
        return results.set("status", Valid.right);
      }
    }
    //check if did not answer after missed terminal
    // else if(
    //   !terminal_state && answer.answer_index != questionBank.getQuestion(answer.question_key)._terminal_index  &&
    //   answers.filter((answer) => { return answer.question_key === 'q'+previous_answer_index + 2 })[0] == undefined // next answer index
    //   ){
    //   return_set = true
    //   logger.info("HERE")
    //   return results.set("status", Errors.unanswered)
    // }

    //check if answered after terminal
    if (terminal_state && answer.answer_index !== undefined) {
      return_set = true;
      logger.info(answer.question_key + " " + Errors.donot_answer);
      return results.set("status", Errors.donot_answer);
    }
    logger.info(answer.question_key + " " + Valid.right);
    results.set(answer.question_key, Valid.right);
  });

  // check if questions not answered at the end when there's no terminal
  if (!terminal_state && questions.has("q" + (parseInt(answers[answers.length - 1].question_key[1]) + 1))) {
    logger.info("q" + (parseInt(answers[answers.length - 1].question_key[1]) + 1) + " " + Valid.right);
    return results.set("status", Errors.unanswered);
  }

  if (return_set) {
    return results;
  } // double return

  results.set("status", Valid.right);
  return results;
}
