import { readFileSync } from "fs";
import { jsonBank } from "./IBank";
import { Logger } from "winston";
import { Answer } from "../models/Answer";

export class AnswerBank implements jsonBank {
  readonly _logger: Logger;
  readonly _answerFile: string;
  private answers: Array<Answer>;
  constructor(logger: Logger, answerFile: string) {
    this._logger = logger;
    this._answerFile = answerFile;
    this.answers = new Array<Answer>();
    this.deserialize(this._answerFile);
  }

  serialize() {
    //
  }

  deserialize(file: string) {
    const buffer = readFileSync(file);
    const AnswerData = JSON.parse(buffer.toString());
    for (const key in AnswerData) {
      this._logger.info(key + ": " + AnswerData[key]);
      const answer: Answer = new Answer(key, AnswerData[key]);
      this.answers.push(answer);
    }
  }

  public getAllAnswers(): Array<Answer> {
    return this.answers;
  }
  public size(): number {
    return this.answers.length;
  }
  public getNextKey(): string {
    return this.answers.keys().next().value;
  }
}
