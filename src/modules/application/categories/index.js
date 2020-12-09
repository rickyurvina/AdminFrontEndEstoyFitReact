import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import ComponentCard from '@crema/core/ComponentCard';
import ComponentHeader from '@crema/core/ComponentHeader';
import GridContainer from '@crema/core/GridContainer';
import Table from './Table';
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
        title='Categorías'
        description='En este modulo puedes gestionar las categorías de tu negocio.'
        refUrl=''
      />

      <GridContainer>
        <Grid item xs={12}>
          <ComponentCard
            title='Categorías'
            component={Table}
            register={true}
          />
        </Grid>
      </GridContainer>
    </>
  );
};

export default ReactTable;
