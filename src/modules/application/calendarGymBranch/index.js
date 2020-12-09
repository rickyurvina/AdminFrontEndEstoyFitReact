import React from 'react';
import Grid from '@material-ui/core/Grid';

import ComponentCard from '@crema/core/ComponentCard';
import ComponentHeader from '@crema/core/ComponentHeader';
import GridContainer from '@crema/core/GridContainer';

import CalendarActivities from './Components/CalendarActivities';
// eslint-disable-next-line import/no-webpack-loader-syntax

const PopupCalendar = () => {
  return (
    <>
      <ComponentHeader
        title='Calendario de actividades de tu gimnasio'
      />

      <GridContainer>
        <Grid item xs={12}>
          <ComponentCard
            title='Calendario'
            component={CalendarActivities}
          />
        </Grid>
      </GridContainer>
    </>
  );
};

export default PopupCalendar;
