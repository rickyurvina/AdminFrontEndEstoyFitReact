import React, { useContext, useEffect, useState } from 'react';
import { useAuthUser } from '@crema/utility/AppHooks';
import { Card, makeStyles } from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CodeIcon from '@material-ui/icons/Code';
import Highlight, { defaultProps } from 'prism-react-renderer';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Scrollbar from '../Scrollbar';
import clsx from 'clsx';
import { highlightTheme } from './highlightTheme';
import Box from '@material-ui/core/Box';
import { Fonts } from '../../../shared/constants/AppEnums';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  getAllGymBranchs,
} from '../../../@crema/services/applicationServices/gymBranch';

const useStyles = makeStyles((theme) => {
  return {
    root: {
      borderRadius: 8,
      padding: 16,
      backgroundColor: theme.palette.background.default,
    },
    cardHeader: {
      paddingLeft: 32,
      paddingRight: 32,
      '& .MuiTypography-h5': {
        fontSize: 20,
        fontFamily: Fonts.MEDIUM,
      },
    },
    cardContent: {
      paddingLeft: 32,
      paddingRight: 32,
      paddingTop: 0,
    },
    preTag: {
      borderRadius: 8,
      padding: 12,
    },
    button: {
      margin: theme.spacing(1),
    },
    input: {
      display: 'none',
    },
  };
});
const top100Films = [
  { id: 1, name: 'Lift gym' },
  { id: 7, name: 'Gym 2' },
  { id: 15, name: 'Gym 3' },
  { id: 17, name: 'Gym 4' },
  { id: 26, name: 'Gym 5' },
];


const ComponentCard = ({
  title,
  maxHeight,
  description,
  component: Component,
  register,
  selectGym,
  source,
}) => {
  const [viewSource, setToggleViewSource] = useState(false);
  const [animation, setAnimation] = useState(false);
  const [openRegisterModal, setOpen] = useState(false);
  const [gymBranchs, setGymBranchs] = useState(null);
  const [gymBranch, setGymBranch] = useState(null);
  const user = useAuthUser();
  const classes = useStyles();

  useEffect(() => {
    apiGetAllGymBranchs();

  }, []);

  const apiGetAllGymBranchs = async () => {
    const resp = await getAllGymBranchs();
    console.log('RESPONSE API GYMBRANCHS LIST =>', resp)
    const { data } = resp;
    setGymBranchs(data);
  };

  return (
    <Card>
      <CardHeader
        className={classes.cardHeader}
        title={title}
        subheader={description}
        root={{
          subheader: {
            fontSize: 14,
          },
        }}
        action={
          source ? (
            <Box mt={2}>
              <IconButton
                aria-label='view code'
                onClick={() => {
                  if (animation) {
                    setAnimation(!animation);
                    setTimeout(() => setToggleViewSource(!viewSource), 400);
                  } else {
                    setAnimation(!animation);
                    setToggleViewSource(!viewSource);
                  }
                }}>
                <CodeIcon />
              </IconButton>
            </Box>
          ) : null
        }
      />
      {register &&
        <Button
          variant='contained'
          color='primary'
          className={classes.button}
          onClick={() => setOpen(!openRegisterModal)}
        >
          Registrar
        </Button>
      }

      {selectGym &&
        <Autocomplete
          id="combo-box-demo"
          options={gymBranchs}
          getOptionLabel={(option) => option.name}
          style={{ paddingLeft:50 , width: 300 }}
          renderInput={(params) => <TextField {...params} label="Gimnasio" variant="outlined" />}
          onChange={(event, newValue) => {
            setGymBranch(newValue.id);
          }}
        />
      }

      <CardContent className={classes.cardContent}>
        <Collapse in={animation}>
          {viewSource ? (
            <Scrollbar
              style={{
                borderRadius: 8,
                background: '#333333',
              }}>
              <Highlight
                {...defaultProps}
                code={source}
                language='jsx'
                theme={highlightTheme}>
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre
                    className={clsx(className, classes.preTag)}
                    style={{ ...style, maxHeight: 500 }}>
                    {tokens.map((line, i) => (
                      <Box {...getLineProps({ line, key: i })}>
                        {line.map((token, key) => (
                          <span {...getTokenProps({ token, key })} />
                        ))}
                      </Box>
                    ))}
                  </pre>
                )}
              </Highlight>
            </Scrollbar>
          ) : null}
        </Collapse>
        <Scrollbar className={classes.root} style={{ maxHeight: maxHeight }}>
          <Box
            width='100%'
            display='flex'
            alignItems='center'
            justifyContent='center'>
            <Component openModal={openRegisterModal} user={user} gymBranch={gymBranch} />
          </Box>
        </Scrollbar>
      </CardContent>
    </Card>
  );
};

export default ComponentCard;

ComponentCard.defaultProps = {
  description: '',
  maxHeight: 500,
};

ComponentCard.propTypes = {
  component: PropTypes.any.isRequired,
  source: PropTypes.node,
  title: PropTypes.node.isRequired,
  description: PropTypes.node,
};
