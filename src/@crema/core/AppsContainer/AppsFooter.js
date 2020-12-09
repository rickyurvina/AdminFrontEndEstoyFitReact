import React from 'react';
import Box from '@material-ui/core/Box';
import {makeStyles} from '@material-ui/core/styles';
import {grey} from '@material-ui/core/colors';

const AppsFooter = (props) => {
  const {children, ...rest} = props;
  const useStyles = makeStyles((theme) => ({
    paginationRoot: {
      paddingLeft: 8,
      paddingRight: 8,
      borderTop: '1px solid',
      borderColor: grey[300],
    },
    paddingY: {
      paddingTop: 0,
      paddingBottom: 0,
    },
  }));

  const classes = useStyles(props);
  return (
    <Box className={classes.paginationRoot} {...rest}>
      {children}
    </Box>
  );
};

export default AppsFooter;
