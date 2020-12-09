import React, { useEffect, useState, useMemo } from 'react';
import {useSelector} from 'react-redux';
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
import { Button } from '@material-ui/core';
import Swal from 'sweetalert2';
import '../../../../shared/styles/index.css';
import ReactTable from 'react-table';

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


export default function DraggableDialog({ open, create, data, services, slotData, parentHandleClose, save, textLabel, deleteActvity }) {

  const authUser = useSelector(({auth}) => auth.user);
  const [title, setTitle] = useState(null);
  const [inputValue, setInputValue] = React.useState('');
  const [serviceId, setServiceId] = useState(null);
  const [description, setDescription] = useState(null);
  const [startLesson, setStartLesson] = useState();
  const [endLesson, setEndLesson] = useState();
  const [deleteObejct, setDeleteObject] = useState({ 'text': 'Eliminar', 'status': 0 });
  const [loading, setLoading] = useState(null);
  const [errorFields, setErrorFields] = useState(null);
  const classes = useStyles();
  const [data2, setData2]=useState([]);

  

  useEffect(() => {
    const { title, description, service_id: serviceId, start_lesson: startLesson, end_lesson: endLesson } = data;
    const dataTitle = (!create) ? title : '';
    const dataDescription = (!create) ? description : '';
    setTitle(dataTitle);

    const optionSelected = services.find(s => s.id === serviceId );
    setServiceId(optionSelected);

    setInputValue(serviceId)
    setDescription(dataDescription);

    if (!create) {
      setStartLesson(moment(startLesson, 'HH:mm'));
      setEndLesson(moment(endLesson, 'HH:mm'));
      console.log('NOT CVREATE', create)
    }


  }, [data]);

  const handleClose = () => {
    parentHandleClose();
  };

  const send = () => {
    
    const dataB = (!create) ? data : slotData;
    const { id: sId } = serviceId;
    console.log('SERVICE ID TO DB ',sId, serviceId)
    const {branch_id: branchId} = authUser;
    const dataToDb = { create, branchId, sId, dataB, title, description, startLesson, endLesson };
    save(dataToDb);
    setLoading(false);
    parentHandleClose();
  }

  const columns = useMemo(
    () => [
      {
        Header: 'Datos',
        columns: [
          {
            Header: 'Nombre Pase',
            accessor: 'name',
            id: 'name',
            filterMethod: (filter, row) =>
              row[filter.id].startsWith(filter.value) ||
              row[filter.id].endsWith(filter.value),
          },
          {
            Header: 'Nombre Usuario',
            accessor: 'last_name',
            id: 'last_name',
            filterMethod: (filter, row) =>
              row[filter.id].startsWith(filter.value) ||
              row[filter.id].endsWith(filter.value),
          },
          {
            Header: 'Cédula',
            accessor: 'mobile',
            id: 'mobile',
            filterMethod: (filter, row) =>
              row[filter.id].startsWith(filter.value) ||
              row[filter.id].endsWith(filter.value),
          },
          {
            Header: 'Estado',
            accessor: 'email',
            id: 'email',
            filterMethod: (filter, row) =>
              row[filter.id].startsWith(filter.value) ||
              row[filter.id].endsWith(filter.value),
          },
        ],
      },
      {
        Header: 'Información',
        columns: [
          {
            Header: 'Acciones',
            Cell: row => (
              <div>
               {/*} <a href="#" onClick={(e) => this.handleEdit(e, row.original)}> <VisibilityIcon style={{ fill: "#0A8FDC" }} /> </a>*/}
                {/*   <a href="#" onClick={(e) => this.confirmDelete(e,row.original)}> <DeleteIcon style={{fill: "#0A8FDC"}} /> </a>*/}
              </div>
            )
          }
        ],
      },
    ],
    []
  )

  const confirm = (e, row) => {
    setDeleteObject(prevState => ({
      ...prevState,
      text: 'Seguro?',
      status: 1
    }));
  }

  const cancelDelete = () => {
    setDeleteObject(prevState => ({
      ...prevState,
      text: 'Eliminar',
      status: 0
    }));
  }

  const handleDelete = () => {
    const { id } = data;
    console.log('TO DELETE', id)

    setDeleteObject(prevState => ({
      ...prevState,
      text: 'Eliminar',
      status: 0
    }));

    deleteActvity(id);
    parentHandleClose();
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        // fullWidth={true}
        maxWidth={"md"}
      >
        <DialogTitle id="form-dialog-title">{textLabel}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            En este espacio puedes {textLabel} una actividad.
          </DialogContentText>
          <div className="row col">
            <TextField
              value={title}
              rows='1'
              variant='outlined'
              autoFocus
              margin="dense"
              name="title"
              label="Nombre"
              type="text"
              onChange={e => setTitle(e.target.value)}
              className={classes.textField}
              style={{
                width: 'calc(50% - 50px)',
                padding: '0px 20px 0px 5px'
              }}
            />
            
            <TextField
              value={description}
              rows='1'
              variant='outlined'
              autoFocus
              margin="dense"
              name="description"
              label="Descripción"
              onChange={e => setDescription(e.target.value)}
              className={classes.textFieldLarge}
              style={{
                width: 'calc(50% - 50px)',
                padding: '0px 20px 0px 5px'
              }}
            />

            <Autocomplete
              value={serviceId}
              rows='1'
              variant='outlined'
              autoFocus
              margin="dense"
              id="combo-box-demo"
              options={services}
              getOptionLabel={(option) => option.name}
              // style={{ width: 300 }}
              onChange={(event, newValue) => {
                console.log('SERVIDE ID ', newValue)
                setServiceId(newValue);
              }}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => {
                console.log('IMPUT VALUE ', newInputValue)
                setInputValue(newInputValue);
              }}
              renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
              style={{
                width: 'calc(50% - 50px)',
                padding: '0px 20px 0px 5px'
              }}
            />

         
            <TextField
              // value={description}
              rows='1'
              variant='outlined'
              autoFocus
              margin="dense"
              // name="description"
              label="Cupos Iniciales"
              // onChange={e => setDescription(e.target.value)}
              className={classes.textFieldLarge}
              style={{
                width: 'calc(50% - 50px)',
                padding: '0px 20px 0px 5px'
              }}
            />
            <TextField
            // value={description}
            rows='1'
            variant='outlined'
            autoFocus
            margin="dense"
            // name="description"
            label="Cupos Disponibles"
            // onChange={e => setDescription(e.target.value)}
            className={classes.textFieldLarge}
            style={{
              width: 'calc(50% - 50px)',
              padding: '0px 20px 0px 5px'
            }}
          />

            <KeyboardTimePicker
              // defaultValue={moment().format('HH:mm')}
              value={startLesson}
              inputVariant='outlined'
              autoFocus
              margin='dense'
              id='time-picker'
              label='Empieza'
              onChange={(e) => setStartLesson(e)}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
              className={classes.textFieldShort}
              style={{
                width: 'calc(50% - 50px)',
                padding: '0px 20px 0px 5px'
              }}
            />

            <KeyboardTimePicker
              value={endLesson}
              inputVariant='outlined'
              autoFocus
              margin='dense'
              id='time-picker'
              label='Termina'
              onChange={(e) => setEndLesson(e)}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
              className={classes.textFieldShort}
              style={{
                width: 'calc(50% - 50px)',
                padding: '0px 20px 0px 5px'
              }}
            />
            <ReactTable
            data={data2}
            // style={{color:'black', backgroundColor:'oldlace', border:'solid',borderColor:'black'}}
            filterable
            defaultFilterMethod={(filter, row) =>
              String(row[filter.id]) === filter.value
            }
            columns={columns}
            defaultPageSize={5}
    />

            <div> <span style={{ color: 'red' }}>{errorFields}</span> </div>
          </div>
        </DialogContent>
        <DialogActions>
          {!create &&
            <div className="p-5">
              <Button className={classes.btnRoot} color='primary' onClick={(e) => confirm(e, data)}>
                {deleteObejct.text}
              </Button>
              {deleteObejct.status === 1 &&
                <>
                  <Button className={classes.btnRoot} color='primary' onClick={handleDelete} >
                    Si
                </Button>
                  <Button className={classes.btnRoot} color='primary' onClick={cancelDelete} >
                    No
                </Button>
                </>
              }
            </div>
          }

          <div className="p-5">
            <CircularIntegration executeFunction={send} loadingButton={loading} />
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}