import { useCallback, useEffect, useReducer, useState } from "react";
import {
  Test,
  Question,
  TestSession,
  isCorrectAnswer,
  testSessionsStore,
} from "../../core";
import { random } from "lodash-es";

type State = {
  test: Test;
  question: Question;
  session: TestSession;
};

const reducer = (
  state: State,
  action:
    | { type: "check" }
    | { type: "selectQuestion"; questionNumber: number }
    | { type: "selectAnswers"; answers: number[] }
): State => {
  switch (action.type) {
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

export const useTestSessionPageState = (test: Test, session: TestSession) => {
  const [snackBar, setSnackBar] = useState<{
    message: string;
    type: "error";
    key: string;
  } | null>(null);
  const [state, dispatch] = useReducer(reducer, {
    test: test,
    session: session,
    question: test.questions[0],
  });

  useEffect(() => {
    testSessionsStore.save(state.session);
  }, [state.session]);

  return {
    state,
    selectQuestion: useCallback((e: Question) => {
      dispatch({ type: "selectQuestion", questionNumber: e.number });
    }, []),
    nextRandom: () => {
      const notAnswered = test.questions.filter(
        (e) =>
          !["failed", "failed", "undetermined"].includes(
            state.session.answers[e.number]?.state
          )
      );

      if (notAnswered.length === 0) {
        setSnackBar({
          type: "error",
          key: new Date().toISOString(),
          message: "Вопросы закончились(",
        });
        return;
      }

      const randomQuestion =
        notAnswered[random(0, notAnswered.length - 1, false)];

      dispatch({
        type: "selectQuestion",
        questionNumber: randomQuestion.number,
      });
    },
    next: () => {
      const currentQuestionIndex = state.test.questions.indexOf(state.question);
      const newQuestion =
        currentQuestionIndex === state.test.questions.length - 1
          ? state.test.questions[0]
          : state.test.questions[currentQuestionIndex + 1];

      dispatch({ type: "selectQuestion", questionNumber: newQuestion.number });
    },
    previous: () => {
      const currentQuestionIndex = state.test.questions.indexOf(state.question);
      const newQuestion =
        currentQuestionIndex === 0
          ? state.test.questions[state.test.questions.length - 1]
          : state.test.questions[currentQuestionIndex - 1];

      dispatch({ type: "selectQuestion", questionNumber: newQuestion.number });
    },
    check: () => dispatch({ type: "check" }),
    selectAnswers: (answers: number[]) =>
      dispatch({ type: "selectAnswers", answers }),
    snackBar,
    snackBarClose: () => setSnackBar(null),
  };
};
