export interface Question {
  text: string;
  number: number;
  type: "single" | "multiple";
  answers: Answer[];
  correctAnswers: number[];
}

export interface Answer {
  number: number;
  text: string;
}
