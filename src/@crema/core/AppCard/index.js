import React from 'react';
import Card from '@material-ui/core/Card';
import PropTypes from 'prop-types';
import {Box, makeStyles} from '@material-ui/core';
import {Fonts} from '../../../shared/constants/AppEnums';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
  link: {
    fontSize: 16,
    [theme.breakpoints.up('xl')]: {
      fontSize: 18,
    },
  },
}));

const AppCard = ({
  title,
  titleStyle,
  action,
  actionStyle,
  footer,
  footerPosition,
  footerStyle,
  children,
  ...rest
}) => {
  const classes = useStyles();
  return (
    <Box py={{xs: 5, sm: 5, xl: 5}} px={{xs: 6, sm: 6, xl: 6}} {...rest} clone>
      <Card>
        <Box>
          {title || action ? (
            <Box
              display='flex'
              flexDirection={{xs: 'column', sm: 'row'}}
              alignItems={{xs: 'center'}}
              justifyContent={{sm: 'space-between'}}
              mb={3}>
              {typeof title === 'object' ? (
                title
              ) : (
                <Box
                  component='h3'
                  color='text.primary'
                  fontFamily={Fonts.LIGHT}
                  fontSize={{xs: 18, sm: 20, xl: 22}}
                  {...titleStyle}>
                  {title}
                </Box>
              )}

              {typeof action === 'object' ? (
                action
              ) : (
                <Box component='span' ml='auto' {...actionStyle}>
                  <Link
                    href='#'
                    color='secondary'
                    component='button'
                    underline='none'
                    className={classes.link}>
                    <Box component='span'>{action}</Box>
                  </Link>
                </Box>
              )}
            </Box>
          ) : null}

          {children}
        </Box>
        {footer ? (
          <Box pt={2} {...footerStyle}>
            {typeof footer === 'object' ? (
              footer
            ) : (
              <Box
                component='span'
                ml={footerPosition === 'right' ? 'auto' : 0}>
                <Link
                  color='secondary'
                  component='button'
                  underline='none'
                  className={classes.link}>
                  {footer}
                </Link>
              </Box>
            )}
          </Box>
        ) : null}
      </Card>
    </Box>
  );
};

export default AppCard;

AppCard.prototype = {
  action: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

AppCard.defaultProps = {
  footerPosition: 'left',
};
