export class Answer {
  readonly question_key: string;
  readonly answer_index: number;
  constructor(question_key: string, answer_index: number) {
    this.question_key = question_key;
    this.answer_index = answer_index;
  }

  get question(): string {
    return this.question_key;
  }
  get answer(): number {
    return this.answer_index;
  }
}
