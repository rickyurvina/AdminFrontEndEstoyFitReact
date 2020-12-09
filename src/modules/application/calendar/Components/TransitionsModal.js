import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { KeyboardTimePicker } from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import CircularIntegration from '../Components/InteractiveIntegration';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = theme => ({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
  },
  textField: {
    width: 'calc(60% - 60px)',
    padding: '0px 20px 0px 5px'
  },
  textFieldLarge: {
    width: 'calc(100% - 100px)',
    padding: '0px 20px 0px 5px'
  },
  icon: {
    color: '#0A8FDC',
  },
});


export default function DraggableDialog({ open, create, data, services, slotData, parentHandleClose, save, textLabel }) {

  
  const [show, setShow] = useState(0);
  const [loading, setLoading] = useState(null);
  const [errorFields, setErrorFields] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    const { show_in_front } = data;
    setShow(show_in_front);

  }, [data]);

  const handleClose = () => {
    parentHandleClose();
  };

  const send = () => {
    console.log('TITLE AND DESCRIPTION ', show)
    const { id } = data;
    save(id, show);
    setLoading(false);
    parentHandleClose();
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth={true}
      >
        <DialogTitle id="form-dialog-title">Gestionar</DialogTitle>
        <DialogContent>
          <DialogContentText>
            En este espacio puedes gestionar el estado de una clase para ser mostrado en la pagina principal del website.
          </DialogContentText>
          <div className="row col">
            <FormControl variant='outlined' className={classes.wFull} style={{
                  width: 'calc(100% - 100px)',
                  padding: '0px 20px 0px 5px'
                }}>
              <InputLabel htmlFor='outlined-rt'>Mostrar en website</InputLabel>
              <Select
                className={classes.selectBox}
                value={show}
                // labelWidth={500}
                onChange={(e) => setShow(e.target.value)}
                inputProps={{
                  name: 'rt',
                  id: 'outlined-rt',
                }}
                style={{
                  width: 'calc(60% - 60px)',
                  padding: '0px 20px 0px 5px'
                }}
                >
                <MenuItem value={1}>Si</MenuItem>
                <MenuItem value={0}>No</MenuItem>
              </Select>
            </FormControl>

            <div> <span style={{ color: 'red' }}>{errorFields}</span> </div>
          </div>
        </DialogContent>
        <DialogActions>
          <div className="p-5">
            <CircularIntegration executeFunction={send} loadingButton={loading} />
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}