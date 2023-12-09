import {
  AppBar,
  Button,
  Container,
  IconButton,
  Stack,
  Toolbar,
} from "@mui/material";
import questionsJson from "../assets/questions.json";
import {
  QuestionPanel,
  QuestionsAllDrawer,
  QuestionsAnswersFeedback,
} from "../modules";
import { orderBy } from "lodash";
import { Question } from "../core";
import { useCallback, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";

const mapType: Record<string, "multiple" | "single"> = {
  Multiple: "multiple",
  Single: "single",
};

const questions: Question[] = orderBy(
  questionsJson.map((e) => ({
    ...e,
    type: mapType[e.type],
    correctAnswers: e.correctAnswers,
  })),
  (e) => e.number,
  "asc"
);

export const MainPage = () => {
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question>(
    questions[0]
  );
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showAnswers, setShowAnswers] = useState(false);

  const next = () => {
    setSelectedAnswers([]);
    setShowAnswers(false);
    setSelectedQuestion((current) => {
      const index = questions.indexOf(current);
      if (index === questions.length - 1) {
        return questions[0];
      }
      return questions[index + 1];
    });
  };

  const previous = () => {
    setSelectedAnswers([]);
    setShowAnswers(false);
    setSelectedQuestion((current) => {
      const index = questions.indexOf(current);
      if (index === 0) {
        return questions[questions.length - 1];
      }
      return questions[index - 1];
    });
  };

  const onSelectQuestion = useCallback((e: Question) => {
    setSelectedAnswers([]);
    setShowAnswers(false);
    setSelectedQuestion(e);
  }, []);

  const onMenuOpen = useCallback(() => setIsMenuOpened(true), []);
  const onMenuClose = useCallback(() => setIsMenuOpened(false), []);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={() => setIsMenuOpened(!isMenuOpened)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xs">
        <QuestionsAllDrawer
          open={isMenuOpened}
          onOpen={onMenuOpen}
          onClose={onMenuClose}
          questions={questions}
          onSelectQuestion={onSelectQuestion}
        />
        <QuestionPanel
          onSelectedAsnwersChange={setSelectedAnswers}
          selectedAnswers={selectedAnswers}
          question={selectedQuestion}
        />
        {showAnswers && (
          <QuestionsAnswersFeedback
            answers={selectedQuestion.answers}
            correctAnswers={selectedQuestion.correctAnswers}
            selectedAnswers={selectedAnswers}
          />
        )}
        <Stack justifyContent="space-between" spacing={2} direction="row">
          <Button variant="contained" onClick={previous}>
            Назад
          </Button>
          <Button variant="contained" onClick={() => setShowAnswers(true)}>
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
