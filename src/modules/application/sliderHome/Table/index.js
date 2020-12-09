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
import {getSlidersHome, saveSliderHome, deleteSliderHome} from '../../../../@crema/services/applicationServices/sliderHome';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';
import Swal from 'sweetalert2';
import { storage } from '../../../../@crema/firebase/firebase';
import AntSelectImage from '../customComponents/antSelectImage';

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
              Header: 'Titulo',
              accessor: 'title',
              id: 'title',
              filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value) ||
                row[filter.id].endsWith(filter.value),
            },
            {
              Header: 'SubTitulo',
              accessor: 'subtitle',
              id: 'subtitle',
              filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value) ||
                row[filter.id].endsWith(filter.value),
            },
            // {
            //   Header: 'Imagen',
            //   accessor: 'url',
            //   id: 'url',
            //   filterMethod: (filter, row) =>
            //     row[filter.id].startsWith(filter.value) ||
            //     row[filter.id].endsWith(filter.value),
            // },
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
      title: '',
      subtitle:'',
      image: '',
 
      url:'',
      typeBusiness: '',
      errorFields: '',
      image: '',
      bannerImage: '',
      imageUrl: '',
      bannerImageUrl: '',
      
    };
  }

  componentDidMount(){
    this.getSlidersHome();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.openModal !== this.props.openModal) {
      this.handleClickOpen();
    }
  }

  getSlidersHome = async () => {
    this.setState({loadingTable: true});
    const resp = await getSlidersHome();
    console.log('RESPONSED ', resp.data)
    this.setState({
      data: resp.data,
      // imageUrl: main_image,
      // bannerImageUrl: banner_image,
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
      url:row.url,
    
      title: row.title,
      subtitle:row.subtitle,
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
      url:'',
   
      title: '',
      subtitle:'',
      image: '',
      imageUrl: '',
    })
  };

  handleDelete = async (row) => {
    this.setLoading(true);

    console.log('DELETING ',row);
    const { id } = this.state;
    const response = await deleteSliderHome(id);
    const { data } = response;

    this.setState({data, id: null});
    this.setLoading(true);
  }

  confirmDelete = (e, row) => {
    e.preventDefault();
    this.setState({ id: row.id});
    Swal.fire({
      title: 'Está seguro de que desea eliminar esta slider?',
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
          `La categoría ${row.title} fue eliminada correctamente.`,
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
    const {  title, subtitle } = this.state;
    if( (title == '')||(subtitle=='')){
      
      return false;
    }else{
      return true;
    }
  }

  send = async (urlFile, bannerImageUrl)  => {
    this.setLoading(true);

    const {id, title, subtitle} = this.state;
    const objectSend = { id, title, subtitle, urlFile, bannerImageUrl,};
    const response = await saveSliderHome(objectSend);
    const { data } = response;
    console.log('RESPONSE IN UPDATE ggg',response.data);
    this.setState({ data, id: null, open: false});

    this.setLoading(false);
  }

  setLoading = (bool) => {
    this.setState({ loading: bool});
  }
  handleIsImage = (e)=>{
    console.log("mensaje desde hanldeisimage");
    console.log(e)
    // this.setState({
    //   is_image: 1
    // })
  }
  
  handleChangeCrop = (imageUrl, blobFile, name, blobName) => {
    console.log('NAMESSSSSSSSSS => ', name, blobName);
    console.log("validacion de datos...", blobFile, "+", imageUrl)
    // console.log('estado is_image antes de...', is_image)
    this.setState({
      [name]: imageUrl,
      [blobName]: blobFile,
      // is_image:is_image
    });

  };
  saveInCloudStorage = async (image) => {
    console.log('SAVE CLOUD IN STORAGE =? ', image)
    // image.name = fileName;
    const file = image;
    const blob = file.slice(0, file.size, image.type);
    let random = Math.random().toString(36).substr(2, 9);
    let fileName = `${random}_${image.name}`;
    const newFile = new File([blob], fileName, { type: image.type });

    const callback = this.send;
    const uploadFile = storage.ref(`images/${fileName}`).put(newFile);
    const urlReturned = await new Promise((resolve, reject) => {
      uploadFile.on(
        'state_changed',
        (snapshot) => {
          // progrss function ....
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );
          // this.setState({progress});
          console.log('PROGRESSS ', progress);
        },
        (error) => {
          // error function ....
          console.log('ERROR ', error);
        },
        () => {
          // complete function ....
          storage
            .ref('images')
            .child(newFile.name)
            .getDownloadURL()
            .then((urlFile) => {
              // console.log('URL IMAGE FROM STORAGE CLOUD', urlFile);
              resolve(urlFile);
              // callback(urlFile);
            });
        },
      );
    });

    return urlReturned;
  };
  handleUpload = async () => {
    this.setState({ errorFields: '' });
    const { image, bannerImage } = this.state;
    let { imageUrl, bannerImageUrl } = this.state;
    const validate = await this.validateFields();

    if (validate === false) {
      this.setState({ errorFields: 'Error, debe llenar todos los campos' });
      return;
    }

    if (!image && !bannerImage) {
      this.send(imageUrl, bannerImageUrl);
      return;
    }

    if (image) {
      imageUrl = await this.saveInCloudStorage(image);
    }

    if (bannerImage) {
      bannerImageUrl = await this.saveInCloudStorage(bannerImage);
    }

    this.send(imageUrl, bannerImageUrl);
  };


  
  render() {
    const {data, errorFields, columns, open, isUpdate, loadingTable, bannerImageUrl, loading,  title, subtitle, imageUrl, url} = this.state;
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
            En este espacio puedes editar el slider home.
          </DialogContentText>
          <div className="row col">
         
            <TextField
              value={title}
              rows='1'
              variant='outlined'
              autoFocus
              margin="dense"
              name="title"
              label="Titulo"
              type="text"
              onChange = {this.handleChangeField}
              className={classes.textField}
              // fullWidth
            />
            <TextField
            value={subtitle}
            rows='1'
            variant='outlined'
            autoFocus
            margin="dense"
            name="subtitle"
            label="SubTitulo"
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

            <AntSelectImage
              name='bannerImageUrl'
              //  is_image='is_image'
              // handleIsImage={this.handleIsImage}
              blobName='bannerImage'
              changeImage={this.handleChangeCrop}
              imageUrl={bannerImageUrl}
            />
            {url ? <img src={url} alt="" style={{ width: '100%' }} /> : ''}
            <FormHelperText>Imagen panoramica</FormHelperText>
          </FormControl>
         {/* <FormControl
          className={classes.textFieldShort}
          // variant='outlined'
          // autoFocus
          margin='dense'>

          {url ? <img src={url} alt="" style={{ width: '100%' }} /> : ''}

          <FormHelperText>Imagen panoramica</FormHelperText>
         </FormControl>*/}
      
            <div> <span style={{ color: 'red' }}>{errorFields}</span> </div>
           {/* <StyledDemo changeFile={this.onChangeFile} urlFile={imageUrl} />*/}
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
