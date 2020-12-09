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
import {getAmenities, saveAmenity, deleteAmenity} from '../../../../@crema/services/applicationServices/amenity';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';
import Swal from 'sweetalert2';
import { storage } from '../../../../@crema/firebase/firebase';

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
              Header: 'Descripción',
              accessor: 'description',
              id: 'description',
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
                      <a href="#" onClick={(e) => this.handleEdit(e,row.original)}> <EditIcon style={{fill: "#0A8FDC"}} /> </a>
                      <a href="#" onClick={(e) => this.confirmDelete(e,row.original)}> <DeleteIcon style={{fill: "#0A8FDC"}} /> </a>
                  </div>
              )
            }
          ],
        },
      ],
      
      data: [],
      open: false,
      row: {},
      id: null,
      name: '',
      description: '',
      image: '',
      imageUrl: '',
      typeBusiness: '',
      errorFields: ''
    };
  }

  componentDidMount(){
    this.getAmenities();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.openModal !== this.props.openModal) {
      this.handleClickOpen();
    }
  }

  getAmenities = async () => {
    this.setState({loadingTable: true});
    const resp = await getAmenities();
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
      name: row.name,
      description: row.description,
      imageUrl:row.main_image,
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
      name: '',
      description: '',
      image: '',
      imageUrl: '',
    })
  };

  handleDelete = async (row) => {
    this.setLoading(true);

    console.log('DELETING ',row);
    const { id } = this.state;
    const response = await deleteAmenity(id);
    const { data } = response;

    this.setState({data, id: null});
    this.setLoading(true);
  }

  confirmDelete = (e, row) => {
    e.preventDefault();
    this.setState({ id: row.id});
    Swal.fire({
      title: 'Está seguro de que desea eliminar esta categoría?',
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
          `La categoría ${row.name} fue eliminada correctamente.`,
          'success'
        )
      }
    })
  }
  onChangeFile = image => {
    console.log('CROP -> ', image);
    this.setState({ image });
  };
  handleUpload = async () => {

    const { image } = this.state;

    if (!image) {
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
        console.log('PROGRESSS ', progress)
      },
      (error) => {
        // error function ....
        console.log('ERROR ', error);
      },
      () => {
        // complete function ....
        storage.ref('images').child(image.name).getDownloadURL().then(urlFile => {
          callback(urlFile);
        })
      });
  }

  validateFields = async ()  => {
    console.log('validating ');
    const { name, description } = this.state;
    if((name == '' ) || (description == '')){
      
      return false;
    }else{
      return true;
    }
  }

  send = async (urlFile)  => {
    this.setLoading(true);

    const {id, name, description} = this.state;
    const objectSend = { id, name, description, urlFile};
    const response = await saveAmenity(objectSend);
    const { data } = response;
    console.log('RESPONSE IN UPDATE ggg',response.data);
    this.setState({ data, id: null, open: false});

    this.setLoading(false);
  }

  setLoading = (bool) => {
    this.setState({ loading: bool});
  }

  
  render() {
    const {data, errorFields, columns, open, isUpdate, loadingTable, loading, name, description, imageUrl} = this.state;
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
        // className={classes.textField}
        //maxWidth={"xs"}
      >
        <DialogTitle id="form-dialog-title">Editar</DialogTitle>
        <DialogContent>
          <DialogContentText>
            En este espacio puedes editar una comodidad.
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
              value={description}
              rows='1'
              variant='outlined'
              autoFocus
              margin="dense"
              name="description"
              label="Descripción"
              type="text"
              onChange = {this.handleChangeField}
              className={classes.textField}
              // fullWidth
            />
            <FormControl
            className={classes.textFieldShort}
            // variant='outlined'
            // autoFocus
            margin='dense'>
  
            {imageUrl ? <img src={imageUrl} alt="" style={{ width: '100%' }} /> : ''}
  
            <FormHelperText>Imagen comodidad</FormHelperText>
          </FormControl>
            <div> <span style={{ color: 'red' }}>{errorFields}</span> </div>
            <StyledDemo changeFile={this.onChangeFile} urlFile={imageUrl} />
          </div>
        </DialogContent>
        <DialogActions>
            <div className="p-5">
              <CircularIntegration executeFunction={this.handleUpload}
                loadingButton={loading} />
            </div>
          </DialogActions>
      </Dialog>
    </>  
    );
  }
}

export default withStyles(useStyles)(Table);

// export default Table;
