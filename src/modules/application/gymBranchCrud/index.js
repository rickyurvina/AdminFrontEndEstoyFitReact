import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import ComponentCard from '@crema/core/ComponentCard';
import ComponentHeader from '@crema/core/ComponentHeader';
import GridContainer from '@crema/core/GridContainer';
import AdminBranch from './AdminBranch';
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
        title='Admin sucursal'
        description='En este modulo puedes gestionar los datos de tu sucursal.'
        refUrl=''
      />

      <GridContainer>
        <Grid item xs={12}>
          <ComponentCard
            title='Mi sucursal'
            component={AdminBranch}
            register={false}
          />
        </Grid>
      </GridContainer>
    </>
  );
};

export default ReactTable;
