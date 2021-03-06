import React from 'react';
import {Box} from '@material-ui/core';
import {grey} from '@material-ui/core/colors';
import makeStyles from '@material-ui/core/styles/makeStyles';

const AppsHeader = (props) => {
  const {children} = props;

  const useStyles = makeStyles((theme) => ({
    appHeader: {
      height: 60,
      display: 'flex',
      alignItems: 'center',
      borderBottom: `1px solid ${grey[300]}`,
      [theme.breakpoints.up('xl')]: {
        height: 77,
      },
    },
    checkboxRoot: {
      marginRight: 8,
    },
    pointer: {
      cursor: 'pointer',
    },
  }));

  const classes = useStyles(props);
  const contentRef = React.createRef();
  return (
    <Box
      px={5}
      py={{xs: 1, xl: 3}}
      className={classes.appHeader}
      ref={contentRef}>
      {children}
    </Box>
  );
};

export default AppsHeader;
AppsHeader.defaultProps = {
  AppsHeader,
};
