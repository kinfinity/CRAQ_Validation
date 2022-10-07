import { readFileSync } from "fs";
import { jsonBank } from "./IBank";
import { Logger } from "winston";
import { Question } from "../models/Question";

export class QuestionBank implements jsonBank {
  readonly _logger: Logger;
  readonly _questionfile: string;
  private questions: Map<string, Question>;
  constructor(logger: Logger, questionFile: string) {
    this._logger = logger;
    this._questionfile = questionFile;
    this.questions = new Map<string, Question>();
    this.deserialize(this._questionfile);
  }

  serialize() {
    //
  }

  deserialize(file: string) {
    const buffer = readFileSync(file);
    const QuestionsData = JSON.parse(buffer.toString());
    QuestionsData.forEach((data: any) => {
      const question = new Question(this._logger, data["question"], data["options"]);
      this.questions.set(data["question"], question);
    });
  }

  public getAllQuestions(): Map<string, Question> {
    return this.questions;
  }
  public getQuestion(key: string): any {
    return this.questions.get(key);
  }
  public size(): number {
    return this.questions.size;
  }
  public getNextKey(): string {
    return this.questions.keys().next().value;
  }
}
