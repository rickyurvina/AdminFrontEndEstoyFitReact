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
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import CircularIndeterminate from '../customComponents/CircularIndeterminate';
import CircularIntegration from '../customComponents/InteractiveIntegration';
import StyledDemo from '../customComponents/ImageCrop';
import {getGyms, saveGym, deleteGym} from '../../../../@crema/services/applicationServices/gym';
import { storage } from '../../../../@crema/firebase/firebase';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';
import Swal from 'sweetalert2';

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
              accessor: 'commercial_name',
              id: 'commercial_name',
              filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value) &&
                row[filter.id].endsWith(filter.value),
            },
            {
              Header: 'Resumen',
              accessor: 'resume',
              id: 'resume',
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
              Header: 'Ruc',
              accessor: 'ruc',
              id: 'ruc',
            },
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
      open: false,
      row: {},
      id: null,
      userId: null,
      commercialName: '',
      ruc: '',
      userEmail: '',
      password: '',
      image: '',
      imageUrl:'',
      typeBusiness: '',
      errorFields: ''
    };
  }

  componentDidMount(){
    this.getBranches();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.openModal !== this.props.openModal) {
      this.handleClickOpen();
    }
  }

  getBranches = async () => {
    this.setState({loadingTable: true});
    const resp = await getGyms();
    console.log('RESPONSED ', resp.data)
    this.setState({
      data: resp.data,
      loadingTable: false
    })
  }

  handleChangeField = (event) => {
    const { target: { name, value } } = event
    this.setState({ [name]: value })
  }

  handleEdit = async (e,row) => {
    e.preventDefault();
    console.log('EDITING ',row);

    this.setState({
      isUpdate: true,
      id: row.id,
      userId: row.userId,
      commercialName: row.commercial_name,
      ruc: row.ruc,
      userEmail: row.userEmail,
      // password: row.userPassword,
      imageUrl: row.main_image,
      resume: row.resume,
      typeBusiness: row.type_business
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
      isUpdate: false, 
      id: null,  
      commercialName: '',
      ruc: '',
      userEmail: '',
      password: '',
      resume: '', 
      image: '',
      imageUrl: '',
      typeBusiness: ''
    })
  };

  handleDelete = async (row) => {
    this.setLoading(true);

    console.log('DELETING ',row);
    const { id } = this.state;
    const response = await deleteGym(id);
    const { data } = response;

    this.setState({data, id: null});
    this.setLoading(true);
  }

  confirmDelete = (e, row) => {
    e.preventDefault();
    this.setState({ id: row.id});
    Swal.fire({
      title: 'Está seguro de que desea eliminar este gimnasio?',
      text: "No podrá revertir los cambios!",
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
          `El gimnasio ${row.commercial_name} fue eliminado correctamente.`,
          'success'
        )
      }
    })
  }

  onChangeFile = image => {
    // console.log('CROP -> ',image);
    this.setState({ image });
  };

  validateFields = async ()  => {
    console.log('validating ');
    const { commercialName, ruc, userEmail, resume, typeBusiness } = this.state;
    if((commercialName == '' ) || (ruc == '') || (userEmail == '') || (resume== '') || (typeBusiness== '')){
      
      return false;
    }else{
      return true;
    }
  }

  handleUpload = async () => {
    this.setState({ errorFields: ''});
    const { image } = this.state;
    const validate = await this.validateFields();

    if(validate === false){
      this.setState({ errorFields: 'Error, debe llenar todos los campos'});
      return;
    }

    if(!image){
      const { imageUrl } = this.state;
      this.send(imageUrl);
      return;
    }
    
    let random = Math.random().toString(36).substr(2, 9);
    let fileName = `${random}_${image.name}`;
    image.name = fileName;

    const callback = this.send;
    const uploadFile = storage.ref(`images/${fileName}`).put(image);
    uploadFile.on('state_changed', 
    (snapshot) => {
      // progrss function ....
      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      // this.setState({progress});
      console.log('PROGRESSS ',progress)
    }, 
    (error) => {
         // error function ....
      console.log('ERROR ',error);
    }, 
    () => {
      // complete function ....
      storage.ref('images').child(image.name).getDownloadURL().then(urlFile => {
        callback(urlFile);
      })
    });
  }

  send = async (urlFile)  => {
    this.setLoading(true);

    const {id, commercialName, ruc, userEmail, userId, password, resume, typeBusiness} = this.state;
    const objectSend = { id, commercialName, ruc, userEmail, userId, password, urlFile, resume, typeBusiness };
    const response = await saveGym(objectSend);
    const { data } = response;
    console.log('RESPONSE IN UPDATE ggg',response.data);
    this.setState({ data, id: null, open: false});

    this.setLoading(false);
  }

  setLoading = (bool) => {
    this.setState({ loading: bool});
  }

  
  render() {
    const {data, errorFields, columns, open, isUpdate, loadingTable, loading, commercialName, ruc, userEmail, password, resume, imageUrl, typeBusiness} = this.state;
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
            En este espacio puedes editar un gimnasio.
          </DialogContentText>
          <div className="row col">
            <TextField
              value={commercialName}
              rows='1'
              variant='outlined'
              autoFocus
              margin="dense"
              name="commercialName"
              label="Nombre comercial"
              type="text"
              onChange = {this.handleChangeField}
              className={classes.textField}
              
              // fullWidth
            />
            <TextField
              value={ruc}
              rows='1'
              variant='outlined'
              autoFocus
              margin="dense"
              name="ruc"
              label="Ruc"
              type="text"
              onChange = {this.handleChangeField}
              className={classes.textField}
              // fullWidth
            />
            <TextField
              value={userEmail}
              rows='1'
              variant='outlined'
              autoFocus
              margin="dense"
              name="userEmail"
              label="User email"
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
              // fullWidth
            />

            <FormControl className={classes.textField}>
              <InputLabel htmlFor='age-helper'>Tipo</InputLabel>
                <Select
                  className={classes.textField}
                  value={typeBusiness}
                  onChange={this.handleChangeField}
                  inputProps={{
                    name: 'typeBusiness',
                    id: 'typeBusiness',
                  }}>
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  {/* {branchs.map((v) => { 
                    return <MenuItem value={v.id}>{v.commercial_name}</MenuItem>
                  })} */}
                  <MenuItem value={1}>Gimnasio</MenuItem>
                  <MenuItem value={2}>Entrenador</MenuItem>
                </Select>
               {/* <FormHelperText>Some important helper text</FormHelperText>  */}
            </FormControl>

            <TextField
              value={resume}
              rows='1'
              variant='outlined'
              autoFocus
              margin="dense"
              name="resume"
              label="Resumen"
              type="text"
              onChange = {this.handleChangeField}
              className={classes.textFieldLarge}
              // fullWidth
            />
            <div> <span style={{color:'red'}}>{errorFields}</span> </div>
            

            <StyledDemo changeFile={this.onChangeFile} urlFile={imageUrl} />
            {/* <ReactCrop 
              // className={classes.crop}
              src={"https://image.shutterstock.com/image-photo/dolomity-val-di-fassa-periphery-260nw-1379017655.jpg"} 
              crop={crop} 
              onChange={newCrop => this.onChangeCrope(newCrop)} 
            /> */}
          </div>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={this.handleClose} color="primary">
            Cancelar
          </Button> */}
          {/* <Button onClick={this.send} color="primary">
            Guardar
          </Button> */}
          <div className="p-5">
            <CircularIntegration executeFunction={this.handleUpload} loadingButton={loading} />
          </div>
        </DialogActions>
      </Dialog>
    </>  
    );
  }
}

export default withStyles(useStyles)(CustomFiltering);

// export default CustomFiltering;
