import React from "react";
import "./App.css";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import { HashRouter, Switch, Route, Link, Redirect } from "react-router-dom";

import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import DynamicFeedIcon from "@material-ui/icons/DynamicFeed";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import Library from "./components/library/Library";
import Reader from "./components/reader/Reader";
import LibraryCatelogue from "./components/library/catelogue/LibraryCatelogue";
import LibraryTools from "./components/library/tools/LibraryTools";

import { tabIndexState } from "./recoil/atoms";

const tabs = [
  { label: "Library", path: "/" },
  { label: "Reader", path: "/reader" },
];

const libraryRoutes = [
  {
    label: "Catelogue",
    icon: <LibraryBooksIcon />,
    path: "/library/catelogue",
    component: LibraryCatelogue,
  },
  {
    label: "Tools",
    icon: <DynamicFeedIcon />,
    path: "/library/tools",
    component: LibraryTools,
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: "48px",
    zIndex: theme.zIndex.drawer + 1,
    position: "sticky",
    top: 0,
  },
}));

function App() {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useRecoilState(tabIndexState);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <HashRouter>
      <Paper className={classes.root}>
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          {tabs.map((tab, index) => {
            return (
              <Tab
                label={tab.label}
                index={index}
                to={tab.path}
                component={Link}
              />
            );
          })}
        </Tabs>
      </Paper>
      <Switch>
        <Route
          path="/library"
          render={(props) => <Library {...props} routes={libraryRoutes} />}
        />
        <Route exact path="/reader" component={Reader} />
        <Redirect path="/" to="/library/catelogue" />
      </Switch>
    </HashRouter>
  );
}

export default App;
