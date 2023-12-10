import {
  AppBar,
  Button,
  Container,
  Dialog,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useSyncExternalStore } from "react";
import { testSessionsStore, testsAll } from "../core";
import { useNavigate } from "react-router-dom";
import { routes } from "../modules";
import { orderBy } from "lodash-es";

export const TestSessionsListPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const addNewSession = () => setOpen(true);
  const deleteSession = (id: string) => testSessionsStore.delete(id);
  const goToSession = (id: string) => navigate(routes.testSession(id));
  const onTestSelected = (testId: string) => {
    const createdAt = new Date().toISOString();
    const id = createdAt;

    testSessionsStore.save({
      id: createdAt,
      createdAt: createdAt,
      test: {
        id: testId,
        name: testsAll.find((e) => e.id === testId)!.title,
      },
      answers: {},
    });

    goToSession(id);
  };

  const allSessions = useSyncExternalStore(
    testSessionsStore.subscribe,
    testSessionsStore.list
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar></Toolbar>
      </AppBar>
      <Container>
        <Grid container>
          <Grid item xs={12} lg={6}>
            <Typography variant="h5">Ваши сессии:</Typography>
            <List>
              {orderBy(allSessions, (e) => e.createdAt, "desc").map((e) => (
                <ListItem
                  key={e.id}
                  disableGutters
                  secondaryAction={
                    <IconButton edge="end" onClick={() => deleteSession(e.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemButton onClick={() => goToSession(e.id)}>
                    <ListItemText
                      primary={e.test.name}
                      secondary={new Date(e.createdAt).toLocaleString("ru")}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
        <Button variant="contained" onClick={addNewSession}>
          Добавить новую сессию
        </Button>
      </Container>
      <Dialog onClose={() => setOpen(false)} open={open}>
        <DialogTitle>Выберите тест</DialogTitle>
        <List>
          {testsAll.map((e) => (
            <ListItem key={e.id} disableGutters>
              <ListItemButton
                onClick={() => {
                  setOpen(false);
                  onTestSelected(e.id);
                }}
              >
                <Typography>{e.title}</Typography>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Dialog>
    </>
  );
};
