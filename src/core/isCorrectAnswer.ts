import { isEmpty, xor } from "lodash-es";

export const isCorrectAnswer = (actual: number[], expected: number[]) => {
  return isEmpty(xor(actual, expected));
};
