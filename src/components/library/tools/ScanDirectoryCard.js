import React from "react";

import { Typography } from "@material-ui/core";

import Page from "../../Page";
import OpenDirectoryButton from "../../native/OpenDirectoryButton";
import PageHeaderToolbar from "../../toolbar/PageHeaderToolbar";
import SimplePageToolbar from "../../toolbar/SimplePageToolbar";

export default function ScanDirectoryCard({ bodyClass }) {
  return (
    <Page>
      <SimplePageToolbar title="Scan Directory" variant="h6" />
      <div className={bodyClass}>
        <Typography variant="body1">
          Scan local folders for .epub files to import them into your library
          catelogue.
        </Typography>
        <br />
        <OpenDirectoryButton />
      </div>
    </Page>
  );
}
