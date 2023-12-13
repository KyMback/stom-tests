import { Button, Container, Stack, Typography } from "@mui/material";
import {
  Header,
  QuestionPanel,
  QuestionsAllDrawer,
  QuestionsAnswersFeedback,
  routes,
} from "../modules";
import {
  Question,
  Test,
  TestSession,
  isCorrectAnswer,
  isQuestionRelatesToCateogry,
  testSessionsStore,
  testsAll,
} from "../core";
import { useCallback, useEffect, useReducer, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

type State = {
  test: Test;
  question: Question;
  session: TestSession;
};

const reducer = (
  state: State,
  action:
    | { type: "next" }
    | { type: "previous" }
    | { type: "check" }
    | { type: "selectQuestion"; questionNumber: number }
    | { type: "selectTest"; id: string }
    | { type: "selectAnswers"; answers: number[] }
): State => {
  const currentQuestionIndex = state.test.questions.indexOf(state.question);

  switch (action.type) {
    case "next": {
      const newQuestion =
        currentQuestionIndex === state.test.questions.length - 1
          ? state.test.questions[0]
          : state.test.questions[currentQuestionIndex + 1];

      return {
        ...state,
        question: newQuestion,
        session: {
          ...state.session,
          answers: {
            ...state.session.answers,
            [newQuestion.number]: state.session.answers[newQuestion.number]
              ? state.session.answers[newQuestion.number]
              : {
                  state: "pending",
                  answers: [],
                },
          },
        },
      };
    }
    case "previous": {
      const newQuestion =
        currentQuestionIndex === 0
          ? state.test.questions[state.test.questions.length - 1]
          : state.test.questions[currentQuestionIndex - 1];

      return {
        ...state,
        question: newQuestion,
        session: {
          ...state.session,
          answers: {
            ...state.session.answers,
            [newQuestion.number]: state.session.answers[newQuestion.number]
              ? state.session.answers[newQuestion.number]
              : {
                  state: "pending",
                  answers: [],
                },
          },
        },
      };
    }

    case "check": {
      const actual = state.session.answers[state.question.number]?.answers;
      const expected = state.test.questions.find(
        (e) => e.number == state.question.number
      )!.correctAnswers;

      return {
        ...state,
        session: {
          ...state.session,
          answers: {
            ...state.session.answers,
            [state.question.number]: {
              state:
                expected.length === 0
                  ? "undetermined"
                  : isCorrectAnswer(actual, expected)
                  ? "successful"
                  : "failed",
              answers:
                state.session.answers[state.question.number]?.answers ?? [],
            },
          },
        },
      };
    }

    case "selectQuestion": {
      if (action.questionNumber === state.question.number) {
        return state;
      }

      const newQuestion = state.test.questions.find(
        (e) => e.number === action.questionNumber
      )!;

      return {
        ...state,
        question: newQuestion,
        session: {
          ...state.session,
          answers: {
            ...state.session.answers,
            [newQuestion.number]: state.session.answers[newQuestion.number]
              ? state.session.answers[newQuestion.number]
              : {
                  state: "pending",
                  answers: [],
                },
          },
        },
      };
    }

    case "selectAnswers":
      return {
        ...state,
        session: {
          ...state.session,
          answers: {
            ...state.session.answers,
            [state.question.number]: {
              state: "pending",
              answers: action.answers,
            },
          },
        },
      };
    default:
      return state;
  }
};

const Content = ({ session, test }: { session: TestSession; test: Test }) => {
  const [state, dispatch] = useReducer(reducer, {
    test: test,
    session: session,
    question: test.questions[0],
  });
  const [isSideMenuOpened, setIsSideMenuOpened] = useState(false);

  useEffect(() => {
    testSessionsStore.save(state.session);
  }, [state.session]);

  const next = () => dispatch({ type: "next" });
  const previous = () => dispatch({ type: "previous" });
  const check = () => dispatch({ type: "check" });
  const selectAnswers = (answers: number[]) =>
    dispatch({ type: "selectAnswers", answers });

  const onSelectQuestion = useCallback((e: Question) => {
    dispatch({ type: "selectQuestion", questionNumber: e.number });
  }, []);

  const onSideMenuToggle = useCallback(
    () => setIsSideMenuOpened((e) => !e),
    []
  );
  const onSideMenuOpen = useCallback(() => setIsSideMenuOpened(true), []);
  const onSideMenuClose = useCallback(() => setIsSideMenuOpened(false), []);

  const { answers, state: answerState } = state.session.answers[
    state.question.number
  ] ?? { answers: [], state: "pending" };
  const category = state.test.categories.find((e) =>
    isQuestionRelatesToCateogry(e, state.question.number)
  );

  return (
    <>
      <Header
        title={
          <>
            <Typography>{state.session.test.name}</Typography>
            <Typography variant="subtitle2">
              {new Date(state.session.createdAt).toLocaleString("ru")}
            </Typography>
          </>
        }
        onSideMenuClick={onSideMenuToggle}
      />
      <Container>
        <QuestionsAllDrawer
          open={isSideMenuOpened}
          onOpen={onSideMenuOpen}
          onClose={onSideMenuClose}
          test={state.test}
          session={state.session}
          onSelectQuestion={onSelectQuestion}
        />
        <QuestionPanel
          category={category?.text}
          onSelectedAsnwersChange={selectAnswers}
          selectedAnswers={answers}
          question={state.question}
        />
        {answerState !== "pending" && (
          <QuestionsAnswersFeedback
            answers={state.question.answers}
            correctAnswers={state.question.correctAnswers}
            selectedAnswers={answers}
          />
        )}
        <Stack justifyContent="space-between" spacing={2} direction="row">
          <Button variant="contained" onClick={previous}>
            Назад
          </Button>
          <Button variant="contained" onClick={check}>
            Проверить
          </Button>
          <Button variant="contained" onClick={next}>
            Далее
          </Button>
        </Stack>
      </Container>
    </>
  );
};

export const MainPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();

  const session = testSessionsStore.get(sessionId ?? "");
  const test = testsAll.find((e) => e.id === session?.test.id);

  if (session == null || test == null) {
    return <Navigate to={routes.testSessionsList()} />;
  }

  return <Content session={session} test={test} />;
};
