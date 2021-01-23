import React from "react";
import Button from "@material-ui/core/Button";

const electron = window.require("electron");
const remote = electron.remote;
const { dialog } = remote;

export default function OpenFileSystemButton({
  title,
  message,
  properties,
  filters,
  callback,
  text,
}) {
  filters = filters ? filters : {};
  properties = properties ? properties : {};

  return (
    <Button
      onClick={() => {
        dialog
          .showOpenDialog({
            title: title,
            message: message,
            properties: properties,
            filters: filters,
          })
          .then((result) => {
            callback(result);
          });
      }}
    >
      {text}
    </Button>
  );
}
