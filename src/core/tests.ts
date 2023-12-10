import { orderBy } from "lodash-es";
import { Question } from ".";
import test1Questions from "../assets/test1_questions.json";
import test2Questions from "../assets/test2_questions.json";

export type Test = {
  id: string;
  title: string;
  questions: Question[];
};

const mapType: Record<string, "multiple" | "single"> = {
  Multiple: "multiple",
  Single: "single",
};

const test1: Test = {
  id: "test1",
  title:
    "Вопросы по общепрофессиональным дисциплинам (дополнительные): стоматологический профиль",
  questions: orderBy(
    test1Questions.map((e) => ({
      ...e,
      type: mapType[e.type],
      correctAnswers: orderBy(e.correctAnswers, (e) => e, "asc"),
    })),
    (e) => e.number,
    "asc"
  ),
};
const test2: Test = {
  id: "test2",
  title: "Врач-стоматолог-терапевт",
  questions: orderBy(
    test2Questions.map((e) => ({
      ...e,
      type: mapType[e.type],
      correctAnswers: orderBy(e.correctAnswers, (e) => e, "asc"),
    })),
    (e) => e.number,
    "asc"
  ),
};

export const testsAll = [test1, test2];
