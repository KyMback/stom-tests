import { orderBy } from "lodash-es";
import { Question } from ".";
import test1 from "../assets/test1.json";
import test2 from "../assets/test2.json";

export type Test = {
  id: string;
  title: string;
  categories: QuestionsCategory[];
  questions: Question[];
};

export type QuestionsCategory = {
  number: number;
  text: string;
  questions: {
    from: number;
    to: number;
  };
};

const mapType: Record<string, "multiple" | "single"> = {
  Multiple: "multiple",
  Single: "single",
};

export const testsAll: Test[] = [
  {
    ...test1,
    questions: orderBy(
      test1.questions.map((e) => ({
        ...e,
        type: mapType[e.type],
        correctAnswers: orderBy(e.correctAnswers, (e) => e, "asc"),
      })),
      (e) => e.number,
      "asc"
    ),
  },
  {
    ...test2,
    questions: orderBy(
      test2.questions.map((e) => ({
        ...e,
        type: mapType[e.type],
        correctAnswers: orderBy(e.correctAnswers, (e) => e, "asc"),
      })),
      (e) => e.number,
      "asc"
    ),
  },
];
