import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { textWithNumber } from "../../utils";
import { Answer, Question } from "../../core";

interface Props {
  question: Question;
  category?: string;
  selectedAnswers: number[];
  onSelectedAsnwersChange: (value: number[]) => void;
}

export const QuestionPanel = ({
  question,
  category,
  selectedAnswers,
  onSelectedAsnwersChange,
}: Props) => {
  const { number, text, type, answers } = question;

  return (
    <Stack>
      {category && (
        <Typography marginBottom="1rem" variant="h5" fontWeight="bold">
          {category}
        </Typography>
      )}
      <Typography marginBottom="1rem" variant="h6" align="left">
        {textWithNumber(text, number)}
      </Typography>
      {type === "multiple" ? (
        <MultipleAnswers
          answers={answers}
          value={selectedAnswers}
          onChange={onSelectedAsnwersChange}
        />
      ) : (
        <SingleAnswer
          answers={answers}
          value={selectedAnswers}
          onChange={onSelectedAsnwersChange}
        />
      )}
    </Stack>
  );
};

type AnswerProps = {
  answers: Answer[];
  onChange: (selected: number[]) => void;
  value: number[];
};

const MultipleAnswers = ({ answers, onChange, value }: AnswerProps) => {
  return (
    <FormControl error>
      <FormGroup>
        {answers.map((answer) => (
          <Box key={answer.number} marginBottom="0.3em">
            <FormControlLabel
              control={<Checkbox />}
              checked={value.includes(answer.number)}
              onChange={(_, checked) =>
                onChange(
                  checked
                    ? [...value, answer.number]
                    : value.filter((e) => e !== answer.number)
                )
              }
              label={textWithNumber(answer.text, answer.number)}
            />
          </Box>
        ))}
      </FormGroup>
    </FormControl>
  );
};

const SingleAnswer = ({ answers, onChange, value }: AnswerProps) => {
  return (
    <FormControl>
      <RadioGroup>
        {answers.map((answer) => (
          <Box key={answer.number} marginBottom="0.3rem">
            <FormControlLabel
              control={<Radio />}
              checked={value.includes(answer.number)}
              onChange={() => onChange([answer.number])}
              label={textWithNumber(answer.text, answer.number)}
            />
          </Box>
        ))}
      </RadioGroup>
    </FormControl>
  );
};
