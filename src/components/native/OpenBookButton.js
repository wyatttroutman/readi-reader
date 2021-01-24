import React from "react";
import OpenFileButton from "./OpenFileButton";
import { useSetRecoilState, useRecoilCallback } from "recoil";
import {
  useInvalidateCache,
  currentBookState,
  consoleLogBookSelector,
} from "../../recoil/atoms";
import { useSnackbar } from "notistack";

export default function OpenDirectoryButton() {
  const logBook = useSetRecoilState(consoleLogBookSelector);
  const setBook = useSetRecoilState(currentBookState);
  const { enqueueSnackbar } = useSnackbar();
  const invalidateCache = useInvalidateCache();

  const importBookCallback = useRecoilCallback(() => async (path) => {
    await fetch(`http://localhost:5050/book/path/${encodeURIComponent(path)}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        const { error, data } = response;
        if (error) {
          enqueueSnackbar("Failed to imported book.", {
            variant: "error",
          });
          throw error;
        }

        logBook(data);
        setBook(data);
        enqueueSnackbar(`Imported book: ${data.title}`, {
          variant: "success",
        });
        invalidateCache();
      });
  });

  function openFileCallback(result) {
    result &&
      result.filePaths &&
      result.filePaths[0] &&
      importBookCallback(encodeURIComponent(result.filePaths[0]));
  }

  return (
    <OpenFileButton
      callback={openFileCallback}
      filters={[{ name: "Books", extensions: ["epub"] }]}
    />
  );
}
