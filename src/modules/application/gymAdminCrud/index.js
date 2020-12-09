import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import ComponentCard from '@crema/core/ComponentCard';
import ComponentHeader from '@crema/core/ComponentHeader';
import GridContainer from '@crema/core/GridContainer';
import AdminGym from './AdminGym';
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
        title='Admin gimnasio'
        description='En este modulo puedes gestionar los datos de tu gimnasio.'
        refUrl=''
      />

      <GridContainer>
        <Grid item xs={12}>
          {/* <Button variant='contained' color='primary' className={classes.button}>
            Registrar sucursal
          </Button> */}
          <ComponentCard
            title='Mi gimnasio'
            component={AdminGym}
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
