import { Question } from ".";

export type Test = {
  id: string;
  title: string;
  questions: Question[];
};
