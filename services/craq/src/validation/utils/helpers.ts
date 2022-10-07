import { Question } from "../models/Question";
import { AnswerBank } from "../domain/AnswerBank";
import { QuestionBank } from "../domain/QuestionBank";
import { Answer } from "../models/Answer";
import { Logger } from "winston";
import { createInterface } from "readline";

export const getQuestions = async (logger: Logger, questionFile: string) => {
  return new QuestionBank(logger, questionFile);
};

export const getAnswers = async (logger: Logger, answerFile: string) => {
  return new AnswerBank(logger, answerFile);
};

export function qa_lenth_valid(answers: Array<Answer>, questions: Map<string, Question>): boolean {
  if (answers.length <= questions.size) return true;
  return false;
}

export const getInput = createInterface({
  input: process.stdin,
  output: process.stdout,
});
