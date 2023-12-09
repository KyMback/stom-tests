import { Alert, Typography } from "@mui/material";
import { isEmpty, xor } from "lodash";
import { Answer } from "../../core";
import { textWithNumber } from "../../utils";

interface Props {
  answers: Answer[];
  correctAnswers: number[];
  selectedAnswers: number[];
}

export const QuestionsAnswersFeedback = ({
  answers,
  correctAnswers,
  selectedAnswers,
}: Props) => {
  const hasError = !isEmpty(xor(correctAnswers, selectedAnswers));

  if (correctAnswers.length === 0) {
    return <Alert severity="warning">Правильные ответы неизвестны</Alert>;
  }

  return (
    <Alert severity={hasError ? "error" : "success"}>
      Правильные ответы:
      {correctAnswers.map((answerNumber) => {
        const answer = answers.find((e) => e.number === answerNumber);

        return (
          <Typography key={answerNumber}>
            {answer
              ? textWithNumber(answer.text, answerNumber)
              : `Can't find asnwer with number ${answerNumber}`}
          </Typography>
        );
      })}
    </Alert>
  );
};
