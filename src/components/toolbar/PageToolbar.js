import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import useToolbarStyles from "./useToolbarStyles";

export const PageToolbar = (props) => {
  const classes = useToolbarStyles();
  const { title, variant } = props;

  return (
    <Toolbar>
      <Typography
        className={classes.title}
        variant={variant}
        id="tableTitle"
        component="div"
      >
        {title}
      </Typography>
    </Toolbar>
  );
};
