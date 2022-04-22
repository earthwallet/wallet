import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";



const useStylesBootstrap = makeStyles((theme) => ({
  arrow: {
    color: theme.palette.common.black
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
    fontFamily: 'Poppins, sans-serif',
    borderRadius: 5,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10
  }
}));

export default function ArrowToolTip(props: any) {
  const classes = useStylesBootstrap();
  return <Tooltip arrow classes={classes} {...props} />;
}
