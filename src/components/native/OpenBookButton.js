import React from "react";
import OpenFileButton from "./OpenFileButton";
import { useSetRecoilState, useRecoilCallback } from "recoil";
import {
  useInvalidateCache,
  consoleLogFilepathSelector,
  currentBookState,
  consoleLogBookSelector,
} from "../../recoil/atoms";

export default function OpenDirectoryButton() {
  const logPath = useSetRecoilState(consoleLogFilepathSelector);
  const logBook = useSetRecoilState(consoleLogBookSelector);
  const setBook = useSetRecoilState(currentBookState);
  const invalidateCache = useInvalidateCache();

  const addBookCallback = useRecoilCallback(() => async (path) => {
    const response = await fetch(
      `http://localhost:5050/book/path/${encodeURIComponent(path)}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    invalidateCache();
  });

  function openFileCallback(result) {
    const path = result.filePaths[0];
    logPath(path);
    setBook(`http://localhost:5050/book/download/${encodeURIComponent(path)}`);
    addBookCallback(encodeURIComponent(path));
  }

  return (
    <OpenFileButton
      callback={openFileCallback}
      filters={[{ name: "Books", extensions: ["epub"] }]}
    />
  );
}
