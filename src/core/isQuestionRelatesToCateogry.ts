import { QuestionsCategory } from ".";

export const isQuestionRelatesToCateogry = (
  category: QuestionsCategory,
  questionNumber: number
) => {
  return (
    questionNumber >= category.questions.from &&
    questionNumber <= category.questions.to
  );
};
