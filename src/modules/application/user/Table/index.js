import React from 'react';

// import 'react-image-crop/lib/ReactCrop.scss';
//import {useSelector} from 'react-redux';
//import matchSorter from 'match-sorter';
import ReactTable from 'react-table';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Link from '@material-ui/core/Link';
import CircularIndeterminate from '../customComponents/CircularIndeterminate';
import { getUsers,  deleteUser, getPassesUsers } from '../../../../@crema/services/applicationServices/user';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import VisibilityIcon from '@material-ui/icons/Visibility';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import BlockIcon from '@material-ui/icons/Block';



const useStyles = theme => ({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
 
   
  },
 
  textField: {
    width: 'calc(50% - 50px)',
    padding: '0px 20px 0px 5px'
  },
  textFieldLarge: {
    width: 'calc(100% - 100px)',
    padding: '15px 0px 0px 5px'
  },
  crop: {
    unit: '%',
    width: '100%',
    height: '100%',
  },
  imgContainer: {
    position: 'relative',
    flex: 1,
    padding: 16,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
  icon: {
    color: '#0A8FDC',
  },
 
});




class Table extends React.Component {
  
  constructor(props) {
    super(props);
    // this.actionButton = React.createRef();
    this.state = {
      loading: false,
      loadingTable: false,
      columns: [
        {
          Header: 'Datos',
          columns: [
            {
              Header: 'Nombre',
              accessor: 'name',
              id: 'name',
              filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value) ||
                row[filter.id].endsWith(filter.value),
            },
            {
              Header: 'Apellido',
              accessor: 'last_name',
              id: 'last_name',
              filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value) ||
                row[filter.id].endsWith(filter.value),
            },
            {
              Header: 'Numero',
              accessor: 'mobile',
              id: 'mobile',
              filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value) ||
                row[filter.id].endsWith(filter.value),
            },
            {
              Header: 'Correo',
              accessor: 'email',
              id: 'email',
              filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value) ||
                row[filter.id].endsWith(filter.value),
            },
            {
              Header: 'Ciudad',
              accessor: 'city_name',
              id: 'city_name',
              filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value) ||
                row[filter.id].endsWith(filter.value),
            },
            {
              Header: 'Registrado el:',
              accessor: 'created_at',
              id: 'created_at',
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
                  <a href="#" onClick={(e) => this.handleEdit(e, row.original)}> <VisibilityIcon style={{ fill: "#0A8FDC" }} /> </a>
                  {/*   <a href="#" onClick={(e) => this.confirmDelete(e,row.original)}> <DeleteIcon style={{fill: "#0A8FDC"}} /> </a>*/}
                </div>
              )
            }
          ],
        },
      ],

      columns2: [
        {
          Header: 'Pases Comprados',
          columns: [
            {
              Header: 'Nombre Pase',
              accessor: 'passe_name',
              id: 'passe_name',
              filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value) ||
                row[filter.id].endsWith(filter.value),
            },
            {
              Header: 'Costo',
              accessor: 'amount',
              id: 'amount',
              filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value) ||
                row[filter.id].endsWith(filter.value),
            },
            {
              Header: 'Comprado el',
              accessor: 'created_at',
              id: 'created_at',
              filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value) ||
                row[filter.id].endsWith(filter.value),
            },
            {
              Header: 'Gimnasio',
              accessor: 'gym_name',
              id: 'gym_name',
              filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value) ||
                row[filter.id].endsWith(filter.value),
            },
            {
              Header: 'Utilizado',
              accessor: 'active',
              id: 'active',
              Cell: (row) =>
              row.row.active == '1' ? (
                <label style={{color:'green'}}>Si</label>              
              ) : (
                <label style={{color:'red'}}>Si</label>
              ),
            filterMethod: (filter, row) => row[filter.id] == filter.value,
          
            },
          ],
        },
      ],

      data: [],
      data2:[],
      open: false,
      row: {},
      id: null,
      name: '',
      last_name: '',
      email: '',
      city_name: '',
      mobile: '',
      image_profile: '',
      created_at_user: '',    
      image_profile: '',
      typeBusiness: '',
      errorFields: ''
    };
  }

  componentDidMount() {
    this.getUsers();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.openModal !== this.props.openModal) {
      this.handleClickOpen();
    }
  }

  getUsers = async () => {
    this.setState({ loadingTable: true });
    const resp = await getUsers();
    console.log('RESPONSED ', resp.data)
    this.setState({
      data: resp.data,
      loadingTable: false
    })
  }

  
  getPassesUsers = async (id) => {
    this.setState({ loadingTable: true });
    const resp = await getPassesUsers(id);
    console.log('RESPONSED PASSES USER ', resp.data)
    this.setState({
      data2: resp.data,
      loadingTable: false
    })
  }



  handleChangeField = (event) => {
    const { target: { name, value } } = event
    this.setState({ [name]: value })
  }

  handleEdit = async (e, row) => {
    e.preventDefault();
    console.log('EDITING ', row);

    this.setState({
      isUpdate: true,
      id: row.id,
      name: row.name,
      last_name: row.last_name,
      email: row.email,
      city_name: row.city_name,
      mobile: row.mobile,
      image_profile: row.image_profile,
      created_at:row.created_at
      
    });
    console.log("id usuario",this.state.id)
    this.getPassesUsers(row.id)

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
      isUpdate: false,
      id: null,
      name: '',
      last_name: '',
      email: '',
      city_name: '',
      mobile: '',
      image_profile: '',
      created_at: '',
 
    })
  };
  setLoading = (bool) => {
    this.setState({ loading: bool });
  }

  render() {
    const { data, data2, errorFields, columns,columns2, open, isUpdate, loadingTable, loading, name, last_name, email, city_name, mobile, image_profile, created_at} = this.state;
    const disabled = (isUpdate) ? 'disabled' : '';
    const { classes } = this.props;
    return (
      <>
        {loadingTable === true ?
          <CircularIndeterminate />
          :
          <ReactTable
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
          maxWidth={"md"}
        // className={classes.textField}
        //maxWidth={"xs"}
        >
          <DialogTitle id="form-dialog-title">Ver</DialogTitle>
          <DialogContent>
            <DialogContentText>
              En este espacio puedes ver la información del Usuario
          </DialogContentText>
            <div className="row col">
              <FormControl
                className={classes.textField}
                // variant='outlined'
                // autoFocus
                margin='dense'>

                {image_profile ? <img src={image_profile} alt="" width="100" height="100" /> : ''}

                <FormHelperText>Imagen de Perfil</FormHelperText>
              </FormControl>
              <TextField
                value={name+" "+last_name}
                rows='1'
                variant='outlined'
                autoFocus
                margin="dense"
                name="name"
                label="Nombre"
                type="text"
                // onChange={this.handleChangeField}
                className={classes.textField}

              // fullWidth
              />
            {/*  <TextField
                value={last_name}
                rows='1'
                variant='outlined'
                autoFocus
                margin="dense"
                name="last_name"
                label="Apellido"
                type="text"
                onChange={this.handleChangeField}
                className={classes.textField}
              // fullWidth
            />*/}
              <TextField
                value={mobile}
                rows='1'
                variant='outlined'
                autoFocus
                margin="dense"
                name="mobile"
                label="Celular"
                type="text"
                // onChange={this.handleChangeField}
                className={classes.textField}
              // fullWidth
              />
              <TextField
                value={email}
                rows='1'
                variant='outlined'
                autoFocus
                margin="dense"
                name="last_name"
                label="Correo"
                type="text"
                // onChange={this.handleChangeField}
                className={classes.textField}
              // fullWidth
              />
              <TextField
                value={city_name}
                rows='1'
                variant='outlined'
                autoFocus
                margin="dense"
                name="city_name"
                label="Ciudad"
                type="text"
                // onChange={this.handleChangeField}
                className={classes.textField}
              // fullWidth
           />
              <TextField
                value={created_at}
                rows='1'
                variant='outlined'
                autoFocus
                margin="dense"
                name="created_at"
                label="Registrado el"
                type="text"
                // onChange={this.handleChangeField}
                className={classes.textField}
              // fullWidth
              />
             <ReactTable
              data={data2}
              // style={{color:'black', backgroundColor:'oldlace', border:'solid',borderColor:'black'}}
              filterable
              defaultFilterMethod={(filter, row) =>
                String(row[filter.id]) === filter.value
              }
              columns={columns2}
              defaultPageSize={5}
      />
     
        

              <div> <span style={{ color: 'red' }}>{errorFields}</span> </div>
            </div>
          </DialogContent>
          <DialogActions>
            <div className="p-5">
     {mobile ? <Link href={`https://api.whatsapp.com/send?phone=${mobile}&text=EstoyFit`}  target="_blank">
      <WhatsAppIcon color="primary"></WhatsAppIcon></Link> :''}
            </div>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default withStyles(useStyles)(Table);

// export default Table;
