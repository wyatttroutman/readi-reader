import React from "react";

import { useHistory } from "react-router-dom";

import LaunchIcon from "@material-ui/icons/Launch";
import DeleteIcon from "@material-ui/icons/Delete";
import { IconButton } from "@material-ui/core";

import { useRecoilState, useRecoilCallback } from "recoil";
import { useInvalidateCache, currentBookState } from "../../../recoil/atoms";
import { useSnackbar } from "notistack";

export default function ActionPanel({ book }) {
  const history = useHistory();
  const [currentBook, setCurrentBook] = useRecoilState(currentBookState);
  const { enqueueSnackbar } = useSnackbar();
  const invalidateCache = useInvalidateCache();

  function openBook() {
    setCurrentBook(book);
    history.push("/reader");
  }

  const deleteBookCallback = useRecoilCallback(() => async () => {
    await fetch(`http://localhost:5050/book/${book.id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        const { error } = response;
        if (error) {
          enqueueSnackbar("Failed to delete book.", {
            variant: "error",
          });
          throw error;
        }

        if (currentBook.id === book.id) {
          setCurrentBook(null);
        }
        enqueueSnackbar(`Deleted book: ${book.title}`, {
          variant: "success",
        });
        invalidateCache();
      });
  });

  function deleteBook() {
    deleteBookCallback();
  }

  return (
    <div>
      <IconButton aria-label="open book" onClick={openBook}>
        <LaunchIcon />
      </IconButton>
      <IconButton aria-label="delete book" onClick={deleteBook}>
        <DeleteIcon />
      </IconButton>
    </div>
  );
}
