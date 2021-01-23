import React from "react";
import OpenFileSystemButton from "./OpenFileSystemButton";
import { useSetRecoilState } from "recoil";
import { consoleLogFilepathSelector } from "../../recoil/atoms";

export default function OpenDirectoryButton({ filters }) {
  const log = useSetRecoilState(consoleLogFilepathSelector);
  const properties = ["openDirectory"];

  function openDirectoryCallback(result) {
    result.filePaths && log(result.filePaths[0]);
  }

  return (
    <OpenFileSystemButton
      title="File Directory"
      message="Select a folder containing e-reader files."
      text="Select Folder"
      properties={properties}
      callback={openDirectoryCallback}
      filters={filters}
    />
  );
}
