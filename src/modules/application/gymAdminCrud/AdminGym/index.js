import React from 'react';

// import 'react-image-crop/lib/ReactCrop.scss';
//import {useSelector} from 'react-redux';
//import matchSorter from 'match-sorter';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ReactTable from 'react-table';
import Button from '@material-ui/core/Button';
import GridContainer from '@crema/core/GridContainer';
import Grid from '@material-ui/core/Grid';
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
import CropComponent from '../customComponents/ImageCrop';
import {
  getGymData,
  saveGymData,
} from '../../../../@crema/services/applicationServices/gym';
import {storage} from '../../../../@crema/firebase/firebase';
import EditIcon from '@material-ui/icons/Edit';
import HomeIcon from '@material-ui/icons/Home';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import {withStyles} from '@material-ui/core/styles';
import Swal from 'sweetalert2';

const useStyles = (theme) => ({
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
    width: 'calc(50% - 50px)',
    padding: '0px 20px 0px 5px',
  },
  textFieldLarge: {
    width: 'calc(100% - 100px)',
    padding: '0px 20px 0px 5px',
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
  iconSize: {
    width: '30px',
    height: '30px',
  },
});

class AdminGym extends React.Component {
  constructor(props) {
    super(props);
    // this.actionButton = React.createRef();
    this.state = {
      loading: false,
      loadingTable: false,
      data: [],
      open: false,
      row: {},
      id: null,
      active: '',
      commercialName: '',
      description: '',
      email: '',
      mobile: '',
      phone: '',
      ruc: '',
      image: '',
      imageUrl: '',
      typeBusiness: '',
      usersAdmin: [],
      errorFields: '',
      selected: '',
    };
  }

  componentDidMount() {
    this.getGymData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.openModal !== this.props.openModal) {
      this.handleClickOpen();
    }
  }

  getGymData = async () => {
    this.setState({loadingTable: true});
    const {user} = this.props;
    if(!user.gym_id){
      return;
    }
    const {gym_id} = user;
    const resp = await getGymData(gym_id);
    const selected = resp.users[0].id;
    const {
      id,
      active,
      commercial_name,
      ruc,
      description,
      email,
      main_image,
      mobile,
      phone,
      type_business,
    } = resp.data;
    this.setState({
      id,
      active,
      commercialName: commercial_name,
      ruc,
      description,
      email,
      mobile,
      phone,
      imageUrl: main_image,
      typeBusiness: type_business,
      usersAdmin: resp.users,
      selected,
      loadingTable: false,
    });
  };

  handleChangeField = (event) => {
    const {
      target: {name, value},
    } = event;
    this.setState({[name]: value});
  };

  handleChangeCheck = (event) => {
    const active = event.target.checked ? 1 : 0;
    this.setState({active});
  };

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
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
      description: '',
      image: '',
      imageUrl: '',
      typeBusiness: '',
    });
  };

  onChangeFile = (image) => {
    this.setState({image});
  };

  validateFields = async () => {
    console.log('validating ');
    const {
      commercialName,
      ruc,
      phone,
      mobile,
      email,
      description,
      typeBusiness,
    } = this.state;
    if (
      commercialName == '' ||
      ruc == '' ||
      phone == '' ||
      mobile == '' ||
      email == '' ||
      description == '' ||
      typeBusiness == ''
    ) {
      console.log('DIO  falseesss ');
      return false;
    } else {
      return true;
    }
  };

  handleUpload = async () => {
    this.setState({errorFields: ''});
    const {image} = this.state;
    const validate = await this.validateFields();
    console.log('IMAGE ', image);

    if (validate === false) {
      console.log('FALSESSSS ');
      this.setState({errorFields: 'Error, debe llenar todos los campos'});
      return;
    }

    if (!image) {
      const {imageUrl} = this.state;
      this.send(imageUrl);
      return;
    }

    let random = Math.random().toString(36).substr(2, 9);
    let fileName = `${random}_${image.name}`;
    image.name = fileName;

    const callback = this.send;
    const uploadFile = storage.ref(`images/${fileName}`).put(image);
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
          .child(image.name)
          .getDownloadURL()
          .then((urlFile) => {
            callback(urlFile);
          });
      },
    );
  };

  send = async (urlFile) => {
    this.setLoading(true);

    const {
      id,
      active,
      commercialName,
      ruc,
      description,
      email,
      mobile,
      phone,
      typeBusiness,
    } = this.state;
    const objectSend = {
      id,
      active,
      commercialName,
      ruc,
      description,
      email,
      mobile,
      phone,
      urlFile,
      typeBusiness,
    };
    const response = await saveGymData(objectSend);
    const {data} = response;
    console.log('RESPONSE IN UPDATE ggg', response.data);
    this.setState({data, open: false});

    this.setLoading(false);
  };

  setLoading = (bool) => {
    this.setState({loading: bool});
  };

  render() {
    const {
      errorFields,
      isUpdate,
      loading,
      active,
      commercialName,
      ruc,
      description,
      email,
      mobile,
      phone,
      imageUrl,
      typeBusiness,
      usersAdmin,
      selected,
    } = this.state;
    const {classes} = this.props;
    return (
      <>
        <div className=''>
          <FormControlLabel
            className={classes.textField}
            control={
              <Checkbox
                icon={<HomeOutlinedIcon />}
                checkedIcon={<HomeIcon />}
                name='checkedH'
                checked={active}
                onChange={this.handleChangeCheck}
              />
            }
            label='Active'
          />
          <FormControl className={classes.textField}>
            <InputLabel htmlFor='age-helper'>Tipo de negocio</InputLabel>
            <Select
              // className={classes.textField}
              value={typeBusiness}
              onChange={this.handleChangeField}
              inputProps={{
                name: 'typeBusiness',
                id: 'typeBusiness',
              }}>
              <MenuItem value={1}> Gimnasio </MenuItem>;
              <MenuItem value={2}> Entrenador </MenuItem>;
            </Select>
            {/* <FormHelperText>Some important helper text</FormHelperText>  */}
          </FormControl>
          <FormControl className={classes.textField}>
            <InputLabel htmlFor='age-helper'>Administradores</InputLabel>
            <Select
              // className={classes.textField}
              // value={selected}
              onChange={this.handleChangeField}
              inputProps={{
                name: 'userAdmin',
                id: 'userAdmin',
              }}>
              {usersAdmin.map((v) => {
                return <MenuItem value={v.id}>{v.name}</MenuItem>;
              })}
            </Select>
            {/* <FormHelperText>Some important helper text</FormHelperText>  */}
          </FormControl>

          <TextField
            value={commercialName}
            rows='1'
            variant='outlined'
            autoFocus
            margin='dense'
            name='commercialName'
            label='Nombre comercial'
            type='text'
            onChange={this.handleChangeField}
            className={classes.textField}
            // fullWidth
          />
          <TextField
            value={ruc}
            rows='1'
            variant='outlined'
            autoFocus
            margin='dense'
            name='ruc'
            label='Ruc'
            type='text'
            onChange={this.handleChangeField}
            className={classes.textField}
            // fullWidth
          />
          <TextField
            value={email}
            rows='1'
            variant='outlined'
            autoFocus
            margin='dense'
            name='email'
            label='Email'
            type='text'
            onChange={this.handleChangeField}
            className={classes.textField}
            // fullWidth
          />
          <TextField
            value={phone}
            rows='1'
            variant='outlined'
            autoFocus
            margin='dense'
            name='phone'
            label='Teléfono'
            type='text'
            onChange={this.handleChangeField}
            className={classes.textField}
            //disabled={disabled}
            // fullWidth
          />
          <TextField
            value={mobile}
            rows='1'
            variant='outlined'
            autoFocus
            margin='dense'
            name='mobile'
            label='Celular'
            type='text'
            onChange={this.handleChangeField}
            className={classes.textField}
            //disabled={disabled}
            // fullWidth
          />
          <TextField
            value={description}
            rows='1'
            variant='outlined'
            autoFocus
            margin='dense'
            name='description'
            label='Descripción'
            placeholder='Escribe aquí un breve Descripción de tu gimnasio'
            multiline
            rows={2}
            rowsMax={4}
            type='text'
            onChange={this.handleChangeField}
            className={classes.textFieldLarge}
            // fullWidth
          />
          <div>
            {' '}
            <div className='p-5'>
              <CircularIntegration
                executeFunction={this.handleUpload}
                loadingButton={loading}
              />
            </div>
            <span style={{color: 'red'}}>{errorFields}</span>{' '}
          </div>
          {/* <div className={classes.iconSize}> */}
          <CropComponent changeFile={this.onChangeFile} urlFile={imageUrl} />
          {/* </div> */}

          {/* <ReactCrop 
              // className={classes.crop}
              src={"https://image.shutterstock.com/image-photo/dolomity-val-di-fassa-periphery-260nw-1379017655.jpg"} 
              crop={crop} 
              onChange={newCrop => this.onChangeCrope(newCrop)} 
            /> */}
        </div>
      </>
    );
  }
}

export default withStyles(useStyles)(AdminGym);
