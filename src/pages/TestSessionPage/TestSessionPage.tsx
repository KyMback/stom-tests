import {
  Alert,
  Box,
  Button,
  Container,
  Slide,
  SlideProps,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import {
  Header,
  QuestionPanel,
  QuestionsAllDrawer,
  QuestionsAnswersFeedback,
  routes,
} from "../../modules";
import {
  Test,
  TestSession,
  isQuestionRelatesToCateogry,
  testSessionsStore,
  testsAll,
} from "../../core";
import { useCallback, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useTestSessionPageState } from "./useTestSessionPageState";

const Content = ({ session, test }: { session: TestSession; test: Test }) => {
  const [isSideMenuOpened, setIsSideMenuOpened] = useState(false);
  const {
    state,
    snackBar,
    snackBarClose,
    next,
    nextRandom,
    previous,
    check,
    selectAnswers,
    selectQuestion: onSelectQuestion,
  } = useTestSessionPageState(test, session);

  const onSideMenuToggle = () => setIsSideMenuOpened((e) => !e);
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
        <Box marginTop="1rem" marginBottom="5rem">
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
          <Stack
            marginTop="2rem"
            justifyContent="space-between"
            spacing={2}
            direction="row"
          >
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
          <Stack marginTop="2rem">
            <Button variant="contained" onClick={nextRandom}>
              Случайный вопрос
            </Button>
          </Stack>
        </Box>
      </Container>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackBar != null}
        autoHideDuration={3000}
        onClose={snackBarClose}
        TransitionComponent={SlideTransition}
        key={snackBar?.key}
      >
        <Alert severity="error">{snackBar?.message}</Alert>
      </Snackbar>
    </>
  );
};

const SlideTransition = (props: SlideProps) => (
  <Slide {...props} direction="down" />
);

export const TestSessionPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();

  const session = testSessionsStore.get(sessionId ?? "");
  const test = testsAll.find((e) => e.id === session?.test.id);

  if (session == null || test == null) {
    return <Navigate to={routes.testSessionsList()} />;
  }

  return <Content session={session} test={test} />;
};
