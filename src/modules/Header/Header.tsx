import { AccountCircle } from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";

interface Props {
  onSideMenuClick: () => void;
  title: string;
  tests: { id: string; title: string }[];
  onTestSelected: (testId: string) => void;
}

export const Header = ({
  onSideMenuClick,
  title,
  tests,
  onTestSelected,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          onClick={onSideMenuClick}
        >
          <MenuIcon />
        </IconButton>
        <Typography width="100%">{title}</Typography>
        <Box>
          <IconButton size="large" onClick={handleMenu} color="inherit">
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={anchorEl != null}
            onClose={handleClose}
          >
            {tests.map((e) => (
              <MenuItem
                key={e.id}
                onClick={() => {
                  handleClose();
                  onTestSelected(e.id);
                }}
              >
                <Typography noWrap>{e.title}</Typography>
              </MenuItem>
            ))}
            {/* <MenuItem onClick={handleClose}>Выбрать тест</MenuItem> */}
            {/* <MenuItem onClick={handleClose}>Мои сессии</MenuItem>
            <MenuItem onClick={handleClose}>Новая сессия</MenuItem> */}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
