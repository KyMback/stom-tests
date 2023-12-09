import { SwipeableDrawer, Box, ButtonGroup, Button } from "@mui/material";
import { chunk } from "lodash";
import { Question } from "../../core";
import { memo, useMemo } from "react";

interface Props {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  questions: Question[];
  onSelectQuestion: (question: Question) => void;
}

export const QuestionsAllDrawer = ({
  onClose,
  onOpen,
  open,
  questions,
  onSelectQuestion,
}: Props) => {
  return (
    <SwipeableDrawer
      anchor="left"
      open={open}
      onOpen={onOpen}
      onClose={onClose}
    >
      <Box width={300}>
        <Questions questions={questions} onSelectQuestion={onSelectQuestion} />
      </Box>
    </SwipeableDrawer>
  );
};

const Questions = memo(
  ({
    onSelectQuestion,
    questions,
  }: Pick<Props, "questions" | "onSelectQuestion">) => {
    const chunks = useMemo(() => chunk(questions, 5), [questions]);

    return (
      <Box width={300}>
        {chunks.map((c, index) => (
          <Group
            key={index}
            questions={c}
            onSelectQuestion={onSelectQuestion}
          />
        ))}
      </Box>
    );
  }
);

const Group = memo(
  ({
    questions,
    onSelectQuestion,
  }: Pick<Props, "onSelectQuestion" | "questions">) => {
    return (
      <ButtonGroup size="small" fullWidth variant="outlined">
        {questions.map((question) => (
          <Button
            onClick={() => onSelectQuestion(question)}
            // variant={
            //   selectedQuestion.number === e.number ? "contained" : undefined
            // }
            key={question.number}
            value={question.number}
          >
            {question.number}
          </Button>
        ))}
      </ButtonGroup>
    );
  }
);
