export enum Errors {
  donot_answer = "was answered even though a previous response indicated that the questions were complete",
  unanswered = "was not answered",
  noanswers = "no answers were provided",
}

export enum Invalid {
  "wrong answer",
  "no answer",
  after_terminal = "answered after getting terminal question right",
  outofindex_question = "out of index question",
  outofindex_answer = "has an answer that is not on the list of valid answers",
  excess_answers = "has more answers than questions",
  skiped_previous = "the previous question was not answered",
}

export enum Valid {
  right = "valid answer",
}

export type MessageState = Valid | Invalid | Errors;

// enum fucntion -> question number as param
