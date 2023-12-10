import { Button, Container, Stack } from "@mui/material";
import test1Questions from "../assets/test1_questions.json";
import test2Questions from "../assets/test2_questions.json";
import {
  Header,
  QuestionPanel,
  QuestionsAllDrawer,
  QuestionsAnswersFeedback,
} from "../modules";
import { orderBy } from "lodash";
import { Question, Test } from "../core";
import { useCallback, useReducer, useState } from "react";

const mapType: Record<string, "multiple" | "single"> = {
  Multiple: "multiple",
  Single: "single",
};

const test1: Test = {
  id: "test1",
  title:
    "Вопросы по общепрофессиональным дисциплинам (дополнительные): стоматологический профиль",
  questions: orderBy(
    test1Questions.map((e) => ({
      ...e,
      type: mapType[e.type],
      correctAnswers: orderBy(e.correctAnswers, (e) => e, "asc"),
    })),
    (e) => e.number,
    "asc"
  ),
};
const test2: Test = {
  id: "test2",
  title: "Врач-стоматолог-терапевт",
  questions: orderBy(
    test2Questions.map((e) => ({
      ...e,
      type: mapType[e.type],
      correctAnswers: orderBy(e.correctAnswers, (e) => e, "asc"),
    })),
    (e) => e.number,
    "asc"
  ),
};

const allTests = [test1, test2];

type State = {
  test: Test;
  question: Question;
  showAnswers: boolean;
  answers: number[];
};

const initState: State = {
  test: allTests[0],
  question: allTests[0].questions[0],
  showAnswers: false,
  answers: [],
};

const reducer = (
  state: State,
  action:
    | { type: "next" }
    | { type: "previos" }
    | { type: "showAnswers" }
    | { type: "selectQuestion"; questionNumber: number }
    | { type: "selectTest"; id: string }
    | { type: "selectAnswers"; answers: number[] }
): State => {
  const currentQuestionIndex = state.test.questions.indexOf(state.question);

  switch (action.type) {
    case "next":
      return {
        ...state,
        showAnswers: false,
        answers: [],
        question:
          currentQuestionIndex === state.test.questions.length - 1
            ? state.test.questions[0]
            : state.test.questions[currentQuestionIndex + 1],
      };
    case "previos":
      return {
        ...state,
        showAnswers: false,
        answers: [],
        question:
          currentQuestionIndex === 0
            ? state.test.questions[state.test.questions.length - 1]
            : state.test.questions[currentQuestionIndex - 1],
      };
    case "showAnswers":
      return { ...state, showAnswers: true };
    case "selectQuestion":
      if (action.questionNumber === state.question.number) {
        return state;
      }

      return {
        ...state,
        question: state.test.questions.find(
          (e) => e.number === action.questionNumber
        )!,
        showAnswers: false,
        answers: [],
      };
    case "selectTest": {
      if (action.id === state.test.id) {
        return state;
      }

      const newTest = allTests.find((test) => test.id === action.id)!;

      return {
        test: newTest,
        question: newTest.questions[0],
        showAnswers: false,
        answers: [],
      };
    }
    case "selectAnswers":
      return {
        ...state,
        answers: action.answers,
      };
    default:
      return state;
  }
};

export const MainPage = () => {
  const [state, dispatch] = useReducer(reducer, initState);
  const [isSideMenuOpened, setIsSideMenuOpened] = useState(false);

  const next = () => dispatch({ type: "next" });
  const previous = () => dispatch({ type: "previos" });
  const showAnswers = () => dispatch({ type: "showAnswers" });
  const selectTest = (id: string) => dispatch({ type: "selectTest", id });
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

  return (
    <>
      <Header
        title={state.test.title}
        onSideMenuClick={onSideMenuToggle}
        onTestSelected={selectTest}
        tests={allTests}
      />
      <Container>
        <QuestionsAllDrawer
          open={isSideMenuOpened}
          onOpen={onSideMenuOpen}
          onClose={onSideMenuClose}
          questions={state.test.questions}
          onSelectQuestion={onSelectQuestion}
        />
        <QuestionPanel
          onSelectedAsnwersChange={selectAnswers}
          selectedAnswers={state.answers}
          question={state.question}
        />
        {state.showAnswers && (
          <QuestionsAnswersFeedback
            answers={state.question.answers}
            correctAnswers={state.question.correctAnswers}
            selectedAnswers={state.answers}
          />
        )}
        <Stack justifyContent="space-between" spacing={2} direction="row">
          <Button variant="contained" onClick={previous}>
            Назад
          </Button>
          <Button variant="contained" onClick={showAnswers}>
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
