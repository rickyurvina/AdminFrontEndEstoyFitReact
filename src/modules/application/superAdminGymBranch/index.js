import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import ComponentCard from '@crema/core/ComponentCard';
import ComponentHeader from '@crema/core/ComponentHeader';
import GridContainer from '@crema/core/GridContainer';
import MenuTabs from './menuTabs';
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
}));

const Index = () => {
  const classes = useStyles();
  return (
    <>
      <ComponentHeader
        title='Administrador de sucursales'
        description='En este modulo puedes gestionar las sucursales de tu negocio.'
        refUrl=''
      />

      <GridContainer>
        <Grid item xs={12}>
          <ComponentCard
            title='Sucursales'
            component={MenuTabs}
            register={false}
            selectGym={true}
          />
        </Grid>
      </GridContainer>
    </>
  );
};

export default Index;
