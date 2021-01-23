import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(3),
  },
}));

export default function Page({ children }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>{children}</Paper>
    </div>
  );
}
