import React from "react";

import { useHistory } from "react-router-dom";

import LaunchIcon from "@material-ui/icons/Launch";
import { IconButton } from "@material-ui/core";

import { useSetRecoilState } from "recoil";
import { currentBookState } from "../../../recoil/atoms";

export default function ActionPanel({ path }) {
  const history = useHistory();
  const setBook = useSetRecoilState(currentBookState);

  function openBook() {
    setBook(`http://localhost:5050/book/download/${encodeURIComponent(path)}`);
    history.push("/reader");
  }

  return (
    <div>
      <IconButton aria-label="open book" onClick={openBook}>
        <LaunchIcon />
      </IconButton>
    </div>
  );
}
