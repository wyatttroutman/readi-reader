import React from "react";

import { Typography } from "@material-ui/core";

import Page from "../../Page";
import OpenBookButton from "../../native/OpenBookButton";
import SimplePageToolbar from "../../toolbar/SimplePageToolbar";

export default function ScanDirectoryCard({ bodyClass }) {
  return (
    <Page>
      <SimplePageToolbar title="Import Book" variant="h6" />
      <div className={bodyClass}>
        <Typography variant="body1">
          Open a specific .epub file to import into your library catelogue.
        </Typography>
        <br />
        <OpenBookButton />
      </div>
    </Page>
  );
}
