import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import Page from "../../Page";
import ScanDirectoryCard from "./ScanDirectoryCard";
import ImportBookCard from "./ImportBookCard";
import PageHeaderToolbar from "../../toolbar/PageHeaderToolbar";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
}));

export default function LibraryTools() {
  const classes = useStyles();
  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Page>
          <PageHeaderToolbar title="Tools" />
          <div className={classes.control}>
            <Typography variant="body1">
              Various library tools are available to manage, import, export, and
              otherwise administrate your library.
            </Typography>
          </div>
        </Page>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <ScanDirectoryCard bodyClass={classes.control} />
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <ImportBookCard bodyClass={classes.control} />
      </Grid>
    </Grid>
  );
}
