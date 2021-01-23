import React from "react";
import OpenFileSystemButton from "./OpenFileSystemButton";
import { useSetRecoilState } from "recoil";
import { consoleLogFilepathSelector } from "../../recoil/atoms";

export default function OpenFileButton({ filters, callback }) {
  return (
    <OpenFileSystemButton
      title="Open File"
      message="Select an e-reader file."
      text="Select File"
      properties={["openFile"]}
      callback={callback}
      filters={filters}
    />
  );
}
