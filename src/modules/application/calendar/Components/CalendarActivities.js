import React, { useContext, useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import events from '../events';
import moment from 'moment';
import useStyles from '../calandar.style';
import Box from '@material-ui/core/Box';
import {
  getCalendarActivities,
  setShowCalendarActivity,
  deleteCalendarActivity
} from '../../../../@crema/services/applicationServices/calendarService';
import TransitionsModal from './TransitionsModal';

const localizer = momentLocalizer(moment);

const CalendarActivities = (props) => {
  const classes = useStyles(props);
  const [data, setData] = useState([]);
  const [services, setServices] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [create, setCreate] = useState(true);
  const [selectedData, setSelectedData] = useState({});
  const [selectedSlot, setSelectedSlot] = useState({});

  useEffect(() => {
    getApiCalendarActivities();

  }, []);
  

  const getApiCalendarActivities = async () => {
    const response = await getCalendarActivities();
    const { data, services } = response;
    setData(data);
    setServices(services);
    
  };

  const setApiShowCalendarActivities = async (id, show) => {
    console.log('SHOWWW', id, show)
    const response = await setShowCalendarActivity(id, show);
    const { data } = response;
    console.log('RESPONSE API =>', data)
    setData(data);
  };

  const deleteApiCalendarActivity = async (id) => {

    const response = await deleteCalendarActivity(id);
    const { data } = response;
    console.log('RESPONSE API DELETED=>', data)
    setData(data);
  };

  const handleSelectEvent = (event, target) => {
    console.log(event)
    setSelectedData(event);
    setOpenModal(true);
    setCreate(false);
  }

  const handleSelectSlot = ({ start, end}) => {
    console.log("Start", moment(start));
    console.log("End", moment(end));
    start = moment(start, 'yyyy/MM/dd HH:mm');  
    end = moment(end, 'yyyy/MM/dd HH:mm');
    
    setSelectedSlot({start, end});
    setOpenModal(true);
    setCreate(true);
  }

  const closeModal = () => {
    setOpenModal(false);
    setSelectedData({});
  }


  return (
    <Box className='app-calendar app-cul-calendar'>
      <Box component='h3' fontSize={{ xs: 18, xl: 22 }} mb={3}>
        Aquí puedes gestionar el calendario para asignación de actividades de todos los gimnasios a visualizar en el website.
      </Box>
      <Calendar
        selectable
        className={classes.root}
        //popup
        localizer={localizer}
        events={data}
        defaultDate={new Date(2020, 9, 1)}
        onSelectEvent={handleSelectEvent}
        // onSelectSlot={handleSelectSlot}
      />
      <TransitionsModal 
        open={openModal} 
        create={create} 
        data={selectedData} 
        services={services}
        slotData={selectedSlot} 
        parentHandleClose={closeModal} 
        save={setApiShowCalendarActivities}
        deleteActivity={deleteApiCalendarActivity}
        textLabel={'gestionar el estado de'} 
      />
    </Box>
  );
};

export default CalendarActivities;
