import React from "react";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import LibraryFooter from "./LibraryFooter";
import { useSetRecoilState } from "recoil";
import { consoleLogNavigationSelector } from "../../recoil/atoms";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    top: "49px",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  footer: {
    position: "fixed",
    bottom: 0,
    left: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
  },
}));

export default function LibraryContainer({ routes, children }) {
  const classes = useStyles();
  const history = useHistory();
  const consoleLog = useSetRecoilState(consoleLogNavigationSelector);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <List>
          {routes.map((route, index) => (
            <ListItem
              key={index}
              button
              key={route.label}
              onClick={() => {
                consoleLog(route.path);
                history.push(route.path);
              }}
            >
              <ListItemIcon>{route.icon}</ListItemIcon>
              <ListItemText primary={route.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main className={classes.content}>
        <React.Suspense fallback={"Loading"}>{children}</React.Suspense>
      </main>
      <div className={classes.footer}>
        <LibraryFooter />
      </div>
    </div>
  );
}
