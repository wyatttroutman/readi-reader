import {
  atom,
  atomFamily,
  selector,
  selectorFamily,
  useRecoilCallback,
  useSetRecoilState,
} from "recoil";
import { ThemeConsumer } from "styled-components";

function createConsoleEntry(text) {
  return { date: new Date().toLocaleString(), text: text };
}

export const tabIndexState = atom({
  key: "tabIndexState", // unique ID (with respect to other atoms/selectors)
  default: 0, // default value (aka initial value)
});

export const catelogueBookState = atom({
  key: "catelogueBookState", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});

export const invalidateCacheState = atom({
  key: "invalidateCacheState",
  default: 0,
});

export const catelogueStateSelector = selector({
  key: "catelogueStateSelector",
  get: async ({ get }) => {
    get(invalidateCacheState);
    const response = await fetch("http://localhost:5050/book");
    if (response.error) {
      throw response.error;
    }
    return response.json();
  },
});

export function useInvalidateCache() {
  const setInvalidateCacheState = useSetRecoilState(invalidateCacheState);
  return () => {
    setInvalidateCacheState((key) => key + 1);
  };
}

export const catelogueBookFirstEntrySelector = selector({
  key: "catelogueBookFirstEntrySelector",
  get: ({ get }) => [get(catelogueBookState)],
  set: ({ get, set }, book) =>
    set(catelogueBookState, [book, ...get(catelogueBookState)]),
});

export const currentBookState = atom({
  key: "currentBookState",
  default:
    "http://epubtest.org/books/Fundamental-Accessibility-Tests-Basic-Functionality-v1.0.0.epub",
});
export const libraryConsoleExpandedState = atom({
  key: "libraryConsoleExpandedState", // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});

export const consoleState = atom({
  key: "consoleState",
  default: [createConsoleEntry("Initializing console...")],
});
export const consoleCountStateSelector = selector({
  key: "consoleCountStateSelector",
  get: ({ get }) => {
    const console = get(consoleState);

    return console.length;
  },
});

export const consoleFirstEntrySelector = selector({
  key: "consoleFirstEntrySelector",
  get: ({ get }) => [get(consoleState)],
  set: ({ get, set }, text) =>
    set(consoleState, [createConsoleEntry(text), ...get(consoleState)]),
});

export const consoleLogSelector = selector({
  key: "consoleLogSelector",
  set: ({ get, set }, text) =>
    set(consoleState, [createConsoleEntry(text), ...get(consoleState)]),
});

export const consoleLogNavigationSelector = selector({
  key: "consoleLogNavigationSelector",
  set: ({ get, set }, text) =>
    set(consoleState, [
      createConsoleEntry(`Navigating to new route: ${text}.`),
      ...get(consoleState),
    ]),
});

export const consoleLogFilepathSelector = selector({
  key: "consoleLogFilepathSelector",
  set: ({ get, set }, path) =>
    set(consoleState, [
      createConsoleEntry(`Found filepath: ${path}.`),
      ...get(consoleState),
    ]),
});

export const consoleLogBookSelector = selector({
  key: "consoleLogBookSelector",
  set: ({ get, set }, book) =>
    set(consoleState, [
      createConsoleEntry(`Importing book: ${book.title}.`),
      ...get(consoleState),
    ]),
});
