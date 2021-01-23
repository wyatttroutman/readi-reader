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

const storage = global.localStorage || null;

export default function Reader(props) {
  const DEMO_NAME =
    "Fundamental-Accessibility-Tests-Basic-Functionality-v1.0.0.epub";

  const [location, setLocation] = useState(0);
  const book = useRecoilValue(currentBookState);

  function onLocationChanged(location) {
    console.log(location);
    setLocation(location);
  }

  return (
    <ReaderContainer>
      <ReactReader
        url={book}
        title={DEMO_NAME}
        location={location}
        locationChanged={(location) => onLocationChanged(location)}
      />
    </ReaderContainer>
  );
}
