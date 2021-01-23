import React from "react";

import { Route } from "react-router-dom";

import LibraryContainer from "./LibraryContainer";

export default function Library({ routes }) {
  return (
    <LibraryContainer routes={routes}>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} component={route.component} />
      ))}
    </LibraryContainer>
  );
}
