import React, {useContext} from 'react';
import {Box} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import AppContext from '../../../@crema/utility/AppContext';
import {ThemeMode} from '../../constants/AppEnums';

const AppLogo = () => {
  const {themeMode} = useContext(AppContext);
  const useStyles = makeStyles(() => ({
    logoRoot: {
      display: 'flex',
      flexDirection: 'row',
      cursor: 'pointer',
      alignItems: 'center',
      float:'right',
    },
    logo: {
      height: 50,
      marginRight: 10,
    },
  }));
  const classes = useStyles();
  return (
    <Box className={classes.logoRoot}>
      <img
        className={classes.logo}
        src={
          themeMode === ThemeMode.DARK
            ? require('assets/images/estoyfit_logo.png')
            : require('assets/images/estoyfit_logo.png')
        }
        alt='crema-logox'
      />
    </Box>
  );
};

export default AppLogo;
