import React from "react";

import { PageToolbar } from "./PageToolbar";

export default function SimplePageToolbar({ title, variant }) {
  return (
    <PageToolbar
      numSelected={0}
      title={title}
      showTooltip={false}
      variant={variant}
    />
  );
}
