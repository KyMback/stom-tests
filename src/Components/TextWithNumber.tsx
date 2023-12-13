import { Box, Typography } from "@mui/material";

export const TextWithNumber = ({
  text,
  number,
}: {
  text: string;
  number: number;
}) => {
  return (
    <Box>
      <Typography component="span">{number}. </Typography>
      <Typography component="span">{text}</Typography>
    </Box>
  );
};
