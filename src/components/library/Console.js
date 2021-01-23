import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { consoleState } from "../../recoil/atoms";

import { Typography } from "@material-ui/core";

export default function Console() {
  const consoleItems = useRecoilValue(consoleState);

  return (
    <div>
      {consoleItems.map((item) => {
        return (
          <div>
            <Typography variant="caption">{`[${item.date}] ${item.text}`}</Typography>
          </div>
        );
      })}
    </div>
  );
}
