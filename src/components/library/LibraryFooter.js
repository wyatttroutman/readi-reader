import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import { Collapse, Paper, Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";

import Console from "./Console";
import { useRecoilState } from "recoil";
import { libraryConsoleExpandedState } from "../../recoil/atoms";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "auto",
  },
  paper: {
    padding: theme.spacing(1),
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    justifyContent: "flex-end",
  },
  console: {
    height: 200,
    padding: theme.spacing(0, 1),
    overflowY: "scroll",
  },
}));

export default function LibraryFooter() {
  const classes = useStyles();

  const [open, setOpen] = useRecoilState(libraryConsoleExpandedState);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Paper elevation={3} className={classes.paper}>
      <Collapse in={open} collapsedHeight={50}>
        <div className={classes.drawerHeader}>
          <Typography variant="h6">Console</Typography>
          <IconButton onClick={handleDrawerToggle}>
            {open === false ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </IconButton>
        </div>
        <div className={classes.console}>
          <Console />
        </div>
      </Collapse>
    </Paper>
  );
}
