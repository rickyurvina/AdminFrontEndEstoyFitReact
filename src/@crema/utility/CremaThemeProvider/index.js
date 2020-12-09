import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import MomentUtils from '@date-io/moment';
// import moment from 'moment';
import {ThemeProvider} from '@material-ui/core/styles';
import {createMuiTheme} from '@material-ui/core/styles';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';

import AppContext from '../AppContext';
import AppLocale from '../../../shared/localization';
import {responsiveFontSizes} from '@material-ui/core';

const CremaThemeProvider = (props) => {
  const {theme, isRTL, locale} = useContext(AppContext);
  const {muiLocale} = AppLocale[locale.locale];
  if (isRTL) {
    document.body.setAttribute('dir', 'rtl');
  } else {
    document.body.setAttribute('dir', 'ltr');
  }

  // require('moment/min/locales.min');
  // moment.locale(locale.locale);

  return (
    <ThemeProvider
      theme={responsiveFontSizes(createMuiTheme(theme, muiLocale))}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        {props.children}
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
};

export default React.memo(CremaThemeProvider);

CremaThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
