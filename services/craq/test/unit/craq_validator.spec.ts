import { resolve } from "path";
import { expect } from "chai";
import { QuestionBank } from "../../src/validation/domain/QuestionBank";
import { Answer } from "../../src/validation/models/Answer";
import { craqValidation } from "../../src/validation/craq_validation";
import { Errors, Invalid, Valid } from "../../src/validation/utils/statusEnums";
import { createLogger, format, transports } from "winston";

const logger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({ filename: "logs/info.log", level: "info" }),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
    new transports.Console({ level: "error" }),
  ],
  exceptionHandlers: [new transports.File({ filename: "logs/exceptions.log" })],
  rejectionHandlers: [new transports.File({ filename: "logs/rejections.log" })],
});

describe("No - Nil Answers", function () {
  // @Test1
  it("it is invalid with no answers", function () {
    // create QuestionBank Object
    const questionBank = new QuestionBank(
      logger,
      resolve(__dirname, "../../src/validation/database/test/questionbank12.json"),
    );
    // create Answer Object
    const answers: Array<Answer> = new Array<Answer>(); // {}
    // assert with answer
    expect(craqValidation(questionBank, answers).get("status")).to.equal(Errors.noanswers);
  });
  // @Test2
  it("it is invalid with nil answers", function () {
    // create QuestionBank Object
    const questionBank = new QuestionBank(
      logger,
      resolve(__dirname, "../../src/validation/database/test/questionbank12.json"),
    );
    // assert with answer
    expect(craqValidation(questionBank).get("status")).to.equal(Errors.noanswers);
  });
  // @Test3
  it("errors are added for all questions", function () {
    // create QuestionBank Object
    const questionBank = new QuestionBank(
      logger,
      resolve(__dirname, "../../src/validation/database/test/questionbank3.json"),
    );
    // assert with answer
    expect(craqValidation(questionBank).get("status")).to.equal(Errors.noanswers);
  });
});

describe("Is valid", function () {
  // @Test4
  it("it is valid when an answer is given", function () {
    // create QuestionBank Object
    const questionBank = new QuestionBank(
      logger,
      resolve(__dirname, "../../src/validation/database/test/questionbank4.json"),
    );
    // create Answer Object
    const answer: Answer = new Answer("q0", 0);
    const answers: Array<Answer> = new Array<Answer>();
    answers.push(answer);
    // assert with answer
    expect(craqValidation(questionBank, answers).get("status")).to.equal(Valid.right);
  });
  // @Test5
  it("it is valid when there are multiple options and the last option is chosen", function () {
    // create QuestionBank Object
    const questionBank = new QuestionBank(
      logger,
      resolve(__dirname, "../../src/validation/database/test/questionbank5.json"),
    );
    // create Answer Object
    const answer: Answer = new Answer("q0", 2);
    // assert with answer
    const answers: Array<Answer> = new Array<Answer>();
    answers.push(answer);
    expect(craqValidation(questionBank, answers).get("status")).to.equal(Valid.right);
  });
  // @Test8
  it("it is valid when all the questions are answered", function () {
    // create QuestionBank Object
    const questionBank = new QuestionBank(
      logger,
      resolve(__dirname, "../../src/validation/database/test/questionbank78.json"),
    );
    // create Answer Object
    const answer1: Answer = new Answer("q0", 0);
    const answer2: Answer = new Answer("q1", 0);
    // assert with answer
    const answers: Array<Answer> = new Array<Answer>();
    answers.push(answer1, answer2);
    expect(craqValidation(questionBank, answers).get("status")).to.equal(Valid.right);
  });
  // @Test9
  it("it is valid when questions after complete_if_selected are not answered", function () {
    // create QuestionBank Object
    const questionBank = new QuestionBank(
      logger,
      resolve(__dirname, "../../src/validation/database/test/questionbank91112.json"),
    );
    // create Answer Object
    const answer1: Answer = new Answer("q0", 1);
    // assert with answer
    const answers: Array<Answer> = new Array<Answer>();
    answers.push(answer1);
    expect(craqValidation(questionBank, answers).get("status")).to.equal(Valid.right);
  });
  // @Test11
  it("it is valid if complete_if is not a terminal answer and further questions are answered", function () {
    // create QuestionBank Object
    const questionBank = new QuestionBank(
      logger,
      resolve(__dirname, "../../src/validation/database/test/questionbank91112.json"),
    );
    // create Answer Object
    const answer1: Answer = new Answer("q0", 0);
    const answer2: Answer = new Answer("q1", 1);
    // assert with answer
    const answers: Array<Answer> = new Array<Answer>();
    answers.push(answer1, answer2);
    expect(craqValidation(questionBank, answers).get("status")).to.equal(Valid.right);
  });
});

describe("Is invalid", function () {
  // @Test6
  it("it is invalid when an answer is not one of the valid answers", function () {
    // create QuestionBank Object
    const questionBank = new QuestionBank(
      logger,
      resolve(__dirname, "../../src/validation/database/test/questionbank6.json"),
    );
    // create Answer Object
    const answer: Answer = new Answer("q0", 2);
    const answers: Array<Answer> = new Array<Answer>();
    answers.push(answer);
    // assert with answer
    expect(craqValidation(questionBank, answers).get("status")).to.equal(Invalid.outofindex_answer);
  });
  // @Test7
  it("it is invalid when not all the questions are answered", function () {
    // create QuestionBank Object
    const questionBank = new QuestionBank(
      logger,
      resolve(__dirname, "../../src/validation/database/test/questionbank78.json"),
    );
    // create Answer Object
    const answer: Answer = new Answer("q0", 0);
    // assert with answer List
    const answers: Array<Answer> = new Array<Answer>();
    answers.push(answer);
    expect(craqValidation(questionBank, answers).get("status")).to.equal(Errors.unanswered);
    // error cos q1 not answered
  });
  // @Test10
  it("it is invalid if questions after complete_if are answered", function () {
    // create QuestionBank Object
    const questionBank = new QuestionBank(
      logger,
      resolve(__dirname, "../../src/validation/database/test/questionbank10.json"),
    );
    // create Answer Object
    const answer1: Answer = new Answer("q0", 1);
    const answer2: Answer = new Answer("q1", 0);
    // assert with answer List
    const answers: Array<Answer> = new Array<Answer>();
    answers.push(answer1, answer2);
    expect(craqValidation(questionBank, answers).get("status")).to.equal(Errors.donot_answer);
  });
  // @Test12
  it("it is invalid if complete_if is not a terminal answer and further questions are not answered", function () {
    // create QuestionBank Object
    const questionBank = new QuestionBank(
      logger,
      resolve(__dirname, "../../src/validation/database/test/questionbank91112.json"),
    );
    // create Answer Object
    const answer: Answer = new Answer("q0", 0);
    const answers: Array<Answer> = new Array<Answer>();
    answers.push(answer);
    // assert with answer List
    expect(craqValidation(questionBank, answers).get("status")).to.equal(Errors.unanswered);
    // error cos q1 not answered
  });
});
