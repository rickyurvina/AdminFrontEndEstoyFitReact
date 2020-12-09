import React from 'react';
import Grid from '@material-ui/core/Grid';
// import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import ComponentCard from '@crema/core/ComponentCard';
import ComponentHeader from '@crema/core/ComponentHeader';
import GridContainer from '@crema/core/GridContainer';
// import ControlledTable from './ControlledTable';
// // eslint-disable-next-line import/no-webpack-loader-syntax
// import ControlledTableSource from '!raw-loader!./ControlledTable';
// import CustomColumnWidths from './CustomColumnWidths';
// // eslint-disable-next-line import/no-webpack-loader-syntax
// import CustomColumnWidthsSource from '!raw-loader!./CustomColumnWidths';
// import CustomExpanderPosition from './CustomExpanderPosition';
// // eslint-disable-next-line import/no-webpack-loader-syntax
// import CustomExpanderPositionSource from '!raw-loader!./CustomExpanderPosition';
// eslint-disable-next-line import/no-webpack-loader-syntax
import CustomFiltering from './CustomFiltering';
// eslint-disable-next-line import/no-webpack-loader-syntax
// import CustomFilteringSource from '!raw-loader!./CustomFiltering';
// import FixedHeaderVerticalScroll from './FixedHeaderVerticalScroll';
// // eslint-disable-next-line import/no-webpack-loader-syntax
// import FixedHeaderVerticalScrollSource from '!raw-loader!./FixedHeaderVerticalScroll';
// import TableFooter from './TableFooters';
// // eslint-disable-next-line import/no-webpack-loader-syntax
// import TableFooterSource from '!raw-loader!./TableFooters';
// import SimpleTable from './SimpleTable';
// // eslint-disable-next-line import/no-webpack-loader-syntax
// import SimpleTableSource from '!raw-loader!./SimpleTable';
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
        title='Pases'
        description='En este modulo puedes gestionar los pases de tu sucursal.'
        refUrl=''
      />

      <GridContainer>
        {/* <Grid item xs={12}> */}
          {/* <Button variant='contained' color='primary' className={classes.button}>
            Registrar sucursal
          </Button> */}
          {/* <ComponentCard
            title='Usuarios'
            component={CustomFiltering} 
             source={CustomFilteringSource}
         />*/}
        {/* </Grid> */}
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
