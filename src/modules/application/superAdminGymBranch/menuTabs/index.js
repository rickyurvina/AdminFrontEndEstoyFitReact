import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {
  getBranchData,
} from '../../../../@crema/services/applicationServices/gymBranch';

import AdminBranch from '../customComponents/AdminBranch';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

const MenuTabs = (props) => {

  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [data, setData] = useState({});

  useEffect(() => {
    console.log('RESPONSE API =>', props)
    apigGetBranchData();

  }, [props]);

  const apigGetBranchData = async () => {
    const { gymBranch } = props;
    const resp = await getBranchData(gymBranch);
    console.log('RESPONSE API =>', resp)
    setData(resp);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    apigGetBranchData();
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Perfil" {...a11yProps(0)} />
          <Tab label="Galeria" {...a11yProps(1)} />
          <Tab label="Pases" {...a11yProps(2)} />
          <Tab label="Calendario" {...a11yProps(3)} />
          <Tab label="Servicios" {...a11yProps(4)} />
          <Tab label="Comodidades" {...a11yProps(5)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <AdminBranch data={data}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
      <TabPanel value={value} index={4}>
        Item Five
      </TabPanel>
      <TabPanel value={value} index={5}>
        Item Six
      </TabPanel>
    </div>
  );
}

export default MenuTabs;
