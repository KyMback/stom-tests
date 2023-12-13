import {
  SwipeableDrawer,
  Box,
  ButtonGroup,
  Button,
  Typography,
} from "@mui/material";
import { chunk, orderBy, without } from "lodash-es";
import {
  Question,
  Test,
  TestSession,
  isQuestionRelatesToCateogry,
} from "../../core";
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
  const { categories, withoutCategory } = useCategories({ test });

  return (
    <SwipeableDrawer
      anchor="left"
      open={open}
      onOpen={onOpen}
      onClose={onClose}
    >
      <Box width={300} padding="0.5rem">
        {categories.map((c) => (
          <Box marginBottom="0.5rem" key={c.number}>
            <Typography fontWeight="bold">{c.text}</Typography>
            <Questions
              questions={c.questions}
              session={session}
              onSelectQuestion={onSelectQuestion}
            />
          </Box>
        ))}
        {withoutCategory.length != 0 && (
          <Questions
            questions={withoutCategory}
            session={session}
            onSelectQuestion={onSelectQuestion}
          />
        )}
      </Box>
    </SwipeableDrawer>
  );
};

interface Category {
  number: number;
  text: string;
  questions: Question[];
}

const useCategories = ({ test }: Pick<Props, "test">) => {
  return useMemo(() => {
    const categories: Category[] = test.categories.map((c) => ({
      ...c,
      questions: test.questions.filter((q) =>
        isQuestionRelatesToCateogry(c, q.number)
      ),
    }));

    return {
      categories,
      withoutCategory: orderBy(
        without(test.questions, ...categories.flatMap((e) => e.questions)),
        (e) => e.number,
        "asc"
      ),
    };
  }, [test]);
};

const Questions = ({
  onSelectQuestion,
  questions,
  session,
}: Pick<Props, "session" | "onSelectQuestion"> & { questions: Question[] }) => {
  const chunks = useMemo(() => chunk(questions, 5), [questions]);

  return (
    <>
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
    </>
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
