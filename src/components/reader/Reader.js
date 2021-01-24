import React, { useState } from "react";
import { ReactReader } from "react-reader";
import { useRecoilValue } from "recoil";

import styled from "styled-components";
import { currentBookState } from "../../recoil/atoms";

const ReaderContainer = styled.div`
  font-size: 16px;
  position: absolute;
  top: 49px;
  left: 0rem;
  right: 0rem;
  bottom: 0rem;
  transition: all 0.6s ease;
`;

export default function Reader() {
  const [location, setLocation] = useState(0);
  const book = useRecoilValue(currentBookState);

  if (!book) return <></>;

  console.log(book);

  function onLocationChanged(location) {
    console.log(location);
    setLocation(location);
  }

  return (
    <ReaderContainer>
      <ReactReader
        url={`http://localhost:5050/book/download/${encodeURIComponent(
          book.path
        )}`}
        title={book.title}
        location={location}
        locationChanged={(location) => onLocationChanged(location)}
      />
    </ReaderContainer>
  );
}
