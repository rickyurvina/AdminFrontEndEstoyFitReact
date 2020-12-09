import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import ComponentCard from '@crema/core/ComponentCard';
import ComponentHeader from '@crema/core/ComponentHeader';
import GridContainer from '@crema/core/GridContainer';
import Gallery from './Gallery';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
}));

const ReactTable = () => {
  const classes = useStyles();
  return (
    <>
      <ComponentHeader
        title='Admin galería'
        description='En este modulo puedes gestionar la galería de imagenes.'
        refUrl=''
      />

      <GridContainer>
        <Grid item xs={12}>
          {/* <Button variant='contained' color='primary' className={classes.button}>
            Registrar sucursal
          </Button> */}
          <ComponentCard
            title='Galería'
            component={Gallery}
            register={false}
          />
        </Grid>
        {/* <Grid item xs={12}>
          <ComponentCard
            title='Fixed Header Vertical Scroll'
            component={FixedHeaderVerticalScroll}
            source={FixedHeaderVerticalScrollSource}
          />
        </Grid> */}
      </GridContainer>
    </>
  );
};

export default ReactTable;
