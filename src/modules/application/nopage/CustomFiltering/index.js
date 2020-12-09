import React from 'react';
import ReactTable from 'react-table';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularIndeterminate from '../customComponents/CircularIndeterminate';
import CircularIntegration from '../customComponents/InteractiveIntegration';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {getGymUsers, saveGymUser, deleteGymUser} from '../../../../@crema/services/applicationServices/gymUser';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Swal from 'sweetalert2';

import { withStyles } from '@material-ui/core/styles';

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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
});


class CustomFiltering extends React.Component {
  constructor(props) {
    super(props);
    // this.actionButton = React.createRef();
    this.state = {
      loading: false,
      loadingTable: false, 
      columns: [
        {
          Header: 'Nombre',
          columns: [
            {
              Header: 'Nombre',
              accessor: 'name',
              id: 'name',
              filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value) &&
                row[filter.id].endsWith(filter.value),
            },
            {
              Header: 'Email',
              accessor: 'email',
              id: 'email',
              filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value) &&
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
                      <a href="#" onClick={(e) => this.handleEdit(e,row.original)}> <EditIcon style={{fill: "#0A8FDC"}} /> </a>
                      <a href="#" onClick={(e) => this.confirmDelete(e,row.original)}> <DeleteIcon style={{fill: "#0A8FDC"}} /> </a>
                  </div>
              )
            }
            // {
            //   Header: 'Over 21',
            //   accessor: 'age',
            //   id: 'over',
            //   Cell: ({value}) => (value >= 21 ? 'Yes' : 'No'),
            //   filterMethod: (filter, row) => {
            //     if (filter.value === 'all') {
            //       return true;
            //     }
            //     if (filter.value === 'true') {
            //       return row[filter.id] >= 21;
            //     }
            //     return row[filter.id] < 21;
            //   },
            //   Filter: ({filter, onChange}) => (
            //     <select
            //       onChange={(event) => onChange(event.target.value)}
            //       style={{width: '100%'}}
            //       value={filter ? filter.value : 'all'}>
            //       <option value='all'>Show All</option>
            //       <option value='true'>Can Drink</option>
            //       <option value='false'>Can't Drink</option>
            //     </select>
            //   ),
            // },
          ],
        },
      ],
      data: [],
      branchs: [],
      open: false,
      isUpdate: false,
      typeUser: '2',
      row: {},
      id: null,
      name: '',
      ruc: '',
      email: '',
      password: '',
      branchId: '0'
    };
  }

  componentDidMount(){
    console.log('USER DATA IN REACT TABLE ',this.props.user)
    this.getGymUsers();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.openModal !== this.props.openModal) {
      this.handleClickOpen();
    }
  }

  getGymUsers = async () => {
    this.setState({loadingTable: true});
    const resp = await getGymUsers();
    this.setState({
      data: resp.data,
      branchs: resp.branchs, 
      loadingTable: false
    })
  }

  handleChangeField = (event) => {
    const { target: { name, value } } = event
    this.setState({ [name]: value });
  }

  handleChangeType = (event) => {
    const { target: { value } } = event;
    const { branchId } = this.state;
    const bId =  (value === 2) ? '0' : branchId;
    this.setState({ typeUser: value, branchId: bId });
  }

  handleEdit = async (e,row) => {
    e.preventDefault();
    console.log('EDITING ',row);

    this.setState({
      isUpdate: true,
      id: row.id,  
      typeUser: row.role_id, 
      name: row.name,
      ruc: row.ruc,
      email: row.email,
      // password: row.password,
      branchId: row.branch_id
    });

    this.handleClickOpen();
  }

  handleClickOpen = () => {
    this.setState({
      open: true
    })
  };

  handleClose = () => {
    this.setState({
      open: false,
      typeUser: '2',
      id: null,  
      name: '',
      ruc: '',
      email: '',
      password: '',
      branchId: '0'
    })
  };

  handleDelete = async () => {
    // e.preventDefault();
    this.setLoading(true);
    const { id } = this.state;
    const response = await deleteGymUser(id);
    const { data } = response;

    this.setState({data, confirm: false, id: null});

    this.setLoading(true);
  }

  confirmDelete = (e,row) => {
    e.preventDefault();
    this.setState({ id: row.id, confirm: true});
    Swal.fire({
      title: 'Está seguro de que desea eliminar este usuario?',
      text: "No podra revertir los cambios!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0A8FDC',
      cancelButtonColor: '#F04F47',
      confirmButtonText: 'Si, eliminalo!'
    }).then((result) => {
      if (result.value) {
        this.handleDelete();
        Swal.fire(
          'Eliminado!',
          `El usuario ${row.name} fue eliminado correctamente.`,
          'success'
        )
      }
    })
  }

  send = async ()  => {
    this.setLoading(true);

    const {id, typeUser, branchId, name, ruc, email, password} = this.state;
    const objectSend = { id, typeUser,  branchId, name, ruc, email, password };
    console.log('OBJKECT TO SENDD ggg ',objectSend)
    const response = await saveGymUser(objectSend);
    const { data } = response;
    console.log('RESPONSE IN UPDATE ggg',response.data);
    this.setState({ data, id: null, open: false});
    this.cleanState();

    this.setLoading(false);
  }

  cleanState = () => {
    this.setState({
      open: false,
      typeUser: '2',
      id: null,  
      branchId: '0',
      name: '',
      ruc: '',
      email: '',
      password: ''
    })
  }

  setLoading = (bool) => {
    this.setState({ loading: bool});
  }

  
  render() {
    const {data, branchs, columns, open, isUpdate, typeUser, loadingTable, loading, name, email, password, branchId } = this.state;
    const disabled = (isUpdate) ? 'disabled' : '';
    const { classes } = this.props;
    return (
    <>
    {loadingTable === true ? 
      <CircularIndeterminate />
    : 
      <ReactTable
        // loading={loadingTable}
        // LoadingComponent={CircularIndeterminate}
        data={data}
        filterable
        defaultFilterMethod={(filter, row) =>
          String(row[filter.id]) === filter.value
        }
        columns={columns}
        defaultPageSize={10}
        className='-striped -highlight'
      />
    }
      
      <Dialog 
        open={open} 
        onClose={this.handleClose} 
        aria-labelledby="form-dialog-title"
        fullWidth={true}
        // className={classes.textField}
        //maxWidth={"xs"}
      >
        <DialogTitle id="form-dialog-title">Editar</DialogTitle>
        <DialogContent>
          <DialogContentText>
            En este espacio puedes editar los usuarios de tu gimnasio.
          </DialogContentText>
          <div className="row col">
            <TextField
              value={name}
              rows='1'
              variant='outlined'
              autoFocus
              margin="dense"
              name="name"
              label="Nombre"
              type="text"
              onChange = {this.handleChangeField}
              className={classes.textField}
              
              // fullWidth
            />
            <TextField
              value={email}
              rows='1'
              variant='outlined'
              autoFocus
              margin="dense"
              name="email"
              label="Email"
              type="text"
              onChange = {this.handleChangeField}
              className={classes.textField}
              // fullWidth
            />
            <TextField
              value={password}
              rows='1'
              variant='outlined'
              autoFocus
              margin="dense"
              name="password"
              label="Contraseña"
              type="password"
              onChange = {this.handleChangeField}
              className={classes.textField}
              disabled={disabled}
            />
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor='age-helper'>Tipo</InputLabel>
                <Select
                  value={typeUser}
                  onChange={this.handleChangeType}
                  inputProps={{
                    name: 'typeUser',
                    id: 'typeUser',
                  }}>
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  {/* {branchs.map((v) => { 
                    return <MenuItem value={v.id}>{v.commercial_name}</MenuItem>
                  })} */}
                  <MenuItem value={2}>Gimnasio</MenuItem>
                  <MenuItem value={3}>Sucursal</MenuItem>
                </Select>
               {/* <FormHelperText>Some important helper text</FormHelperText>  */}
            </FormControl>

            { typeUser === 3 && <FormControl className={classes.formControl}>
              <InputLabel htmlFor='age-helper'>Sucursal</InputLabel>
                <Select
                  value={branchId}
                  onChange={this.handleChangeField}
                  inputProps={{
                    name: 'branchId',
                    id: 'branchId',
                  }}>
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  {branchs.map((v) => { 
                    return <MenuItem value={v.id}>{v.commercial_name}</MenuItem>
                  })}
                </Select>
               {/* <FormHelperText>Some important helper text</FormHelperText>  */}
                </FormControl> }
          </div>
        </DialogContent>
        <DialogActions>
          <div className="p-5">
            <CircularIntegration executeFunction={this.send} loadingButton={loading} />
          </div>
        </DialogActions>
      </Dialog>
    </>  
    );
  }
}

export default withStyles(useStyles)(CustomFiltering);

// export default CustomFiltering;
