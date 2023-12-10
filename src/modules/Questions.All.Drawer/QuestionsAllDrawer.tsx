import { SwipeableDrawer, Box, ButtonGroup, Button } from "@mui/material";
import { chunk } from "lodash-es";
import { Question, Test, TestSession } from "../../core";
import { memo, useMemo } from "react";

interface Props {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  session: TestSession;
  test: Test;
  onSelectQuestion: (question: Question) => void;
}

export const QuestionsAllDrawer = ({
  onClose,
  onOpen,
  open,
  test,
  session,
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
        <Questions
          test={test}
          session={session}
          onSelectQuestion={onSelectQuestion}
        />
      </Box>
    </SwipeableDrawer>
  );
};

const Questions = ({
  onSelectQuestion,
  test,
  session,
}: Pick<Props, "test" | "session" | "onSelectQuestion">) => {
  const chunks = useMemo(() => chunk(test.questions, 5), [test.questions]);

  return (
    <Box width={300}>
      {chunks.map((c, index) => (
        <ButtonGroup key={index} size="small" fullWidth variant="outlined">
          {c.map((question) => (
            <QuestionButton
              key={question.number}
              onSelectQuestion={onSelectQuestion}
              question={question}
              answer={session.answers[question.number]}
            />
          ))}
        </ButtonGroup>
      ))}
    </Box>
  );
};

const QuestionButton = memo(
  ({
    question,
    answer,
    onSelectQuestion,
  }: {
    question: Question;
    answer?: TestSession["answers"][number];
    onSelectQuestion: (question: Question) => void;
  }) => {
    const color =
      answer?.state === "successful"
        ? "success"
        : answer?.state === "failed"
        ? "error"
        : undefined;

    return (
      <Button
        onClick={() => onSelectQuestion(question)}
        key={question.number}
        value={question.number}
        color={color}
        variant={color ? "contained" : undefined}
      >
        {question.number}
      </Button>
    );
  }
);
