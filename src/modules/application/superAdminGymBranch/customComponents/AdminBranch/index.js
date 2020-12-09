import React from 'react';
import moment from 'moment';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import CircularIntegration from './customComponents/InteractiveIntegration';
import AntImageCrop from './customComponents/antCropImage';
import AntSelectImage from './customComponents/antSelectImage';
import AntSelectVideo from './customComponents/antSelectVideo';
import {
  saveBranchData,
} from '../../../../../@crema/services/applicationServices/gymBranch';
import { storage } from '../../../../../@crema/firebase/firebase';
import EditIcon from '@material-ui/icons/Edit';
import HomeIcon from '@material-ui/icons/Home';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import { withStyles } from '@material-ui/core/styles';
import { KeyboardTimePicker } from '@material-ui/pickers';
import { StepConnector } from '@material-ui/core';


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
  textFieldShort: {
    width: 'calc(25% - 25px)',
    padding: '0px 20px 0px 5px',
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

class AdminBranch extends React.Component {
  constructor(props) {
    super(props);
    // this.actionButton = React.createRef();
    this.state = {
      loading: false,
      loadingImage: false,
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
      city: '',
      province: '',
      canton: '',
      sector: '',
      ruc: '',
      image: '',
      bannerImage: '',
      imageUrl: '',
      bannerImageUrl: '',
      is_image: '',
      amenities: [],
      servicesSelected: [],
      services: [],
      amenitiesSelected: [],
      parking: '',
      mainStreet: '',
      intersection: '',
      numeration: '',
      reference: '',
      website: '',
      facebook: '',
      instagram: '',
      youtube: '',
      usersAdmin: [],
      cities: [],
      provinces: [],
      cantones: [],
      errorFields: '',
      selected: '',
      week: { start: null, end: null, startAfternoon: null, endAfternoon: null },
      saturday: {
        start: null,
        end: null,
        startAfternoon: null,
        endAfternoon: null,
      },
      freeday: {
        start: null,
        end: null,
        startAfternoon: null,
        endAfternoon: null,
      },
    };
  }

  componentDidMount() {
    // this.getBranchData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.openModal !== this.props.openModal) {
      this.handleClickOpen();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      if(nextProps.data.data){ 
        this.getBranchData(nextProps.data)
      }  
    }
  }

  getBranchData = async (data) => {
    console.log('THIS PROPS IN COMPONENT ', this.props)
    const selected = (data.users[0]) ? data.users[0].id : null;
    
    const {
      id,
      active,
      commercial_name,
      ruc,
      description,
      email,
      main_image,
      banner_image,
      is_image,
      mobile,
      phone,
      city,
      province,
      canton,
      sector,
      main_street,
      intersection,
      numeration,
      reference,
      website,
      facebook,
      instagram,
      youtube,
      amenities,
      services_selected,
      parking,
      week_from,
      week_to,
      week_from_afternoon,
      week_to_afternoon,
      saturday_from,
      saturday_to,
      saturday_from_afternoon,
      saturday_to_afternoon,
      freeday_from,
      freeday_to,
      freeday_from_afternoon,
      freeday_to_afternoon,
    } = data.data;

    this.setState({
      id,
      active,
      commercialName: commercial_name,
      ruc,
      description,
      email,
      mobile,
      phone,
      city,
      province,
      canton,
      sector,
      mainStreet: main_street,
      intersection,
      numeration,
      reference,
      website,
      facebook,
      instagram,
      youtube,
      amenities: JSON.parse(amenities),
      servicesSelected: JSON.parse(services_selected),
      week: {
        start: moment(week_from, 'hhmm'),
        end: moment(week_to, 'hhmm'),
        startAfternoon: moment(week_from_afternoon, 'hhmm'),
        endAfternoon: moment(week_to_afternoon, 'hhmm'),
      },
      saturday: {
        start: moment(saturday_from, 'hhmm'),
        end: moment(saturday_to, 'hhmm'),
        startAfternoon: moment(saturday_from_afternoon, 'hhmm'),
        endAfternoon: moment(saturday_to_afternoon, 'hhmm'),
      },
      freeday: {
        start: moment(freeday_from, 'hhmm'),
        end: moment(freeday_to, 'hhmm'),
        startAfternoon: moment(freeday_from_afternoon, 'hhmm'),
        endAfternoon: moment(freeday_to_afternoon, 'hhmm'),
      },
      imageUrl: main_image,
      bannerImageUrl: banner_image,
      is_image,
      usersAdmin: data.users,
      cities: data.cities,
      provinces: data.provinces,
      cantones: data.cantones,
      services: data.services,
      amenitiesSelected: data.amenities,
      parking,
      selected,
      loadingTable: false,
    });
  };

  handleDateChange = (date, parentKey, key) => {
    console.log(' DATESS ', parentKey, key, date);

    switch (parentKey) {
      case 'week':
        this.setState((prevState) => ({
          week: {
            ...prevState.week,
            [key]: date,
          },
        }));
        break;
      case 'saturday':
        this.setState((prevState) => ({
          saturday: {
            ...prevState.saturday,
            [key]: date,
          },
        }));
        break;
      case 'freeday':
        this.setState((prevState) => ({
          freeday: {
            ...prevState.freeday,
            [key]: date,
          },
        }));
        break;
    }
  };

  handleChangeField = (event) => {
    const {
      target: { name, value },
    } = event;
    this.setState({ [name]: value });
  };

  handleChangeAmenities = (event) => {
    let {
      target: { name, value },
    } = event;
    this.setState({ amenities: value });
  };

  handleChangeServices = (event) => {

    let {
      target: { name, value },
    } = event;
    console.log('SELECTED =? ', value)
    this.setState({ servicesSelected: value });
  };

  handleChangeCheck = (event) => {
    const active = event.target.checked ? 1 : 0;
    this.setState({ active });
  };

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  onChangeFile = (image) => {
    this.setState({ image });
  };

  validateFields = async () => {
    console.log('validating ');
    const { commercialName, ruc, phone, mobile, email, description } = this.state;
    if (
      commercialName == '' ||
      ruc == '' ||
      phone == '' ||
      mobile == '' ||
      email == '' ||
      description == ''
    ) {
      console.log('DIO  falseesss ');
      return false;
    } else {
      return true;
    }
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
              resolve(urlFile);
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
  handleChangeCheck = (event) => {
    const {
      target: { name, checked },
    } = event;
    const value = checked ? 1 : 0;
    this.setState({ [name]: value });
  };

  send = async (urlFile, bannerImageUrl) => {
    console.log('TO SERVERSSS!!! => ', urlFile, bannerImageUrl);

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
      city,
      province,
      canton,
      sector,
      mainStreet,
      intersection,
      numeration,
      reference,
      website,
      facebook,
      instagram,
      youtube,
      amenities,
      servicesSelected,
      parking,
      week,
      saturday,
      freeday,
      is_image,
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
      city,
      province,
      canton,
      sector,
      mainStreet,
      intersection,
      numeration,
      reference,
      website,
      facebook,
      instagram,
      youtube,
      amenities,
      servicesSelected,
      parking,
      week,
      saturday,
      freeday,
      urlFile,
      bannerImageUrl,
      is_image,
    };
    const response = await saveBranchData(objectSend);
    const { data } = response;
    console.log('RESPONSE IN UPDATE ggg');
    this.setState({ data, open: false });
    this.setLoading(false);
  };

  setLoading = (bool) => {
    this.setState({ loading: bool });
  };
  handleIsImage = (e) => {
    console.log("mensaje desde hanldeisimage");
    console.log(e)
    this.setState({
      is_image: 1
    })
  }
  handleIsVideo = (e) => {
    console.log("mensaje desde hanldeisVideo");
    console.log(e)
    this.setState({
      is_image: 0
    })
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
      city,
      province,
      canton,

      sector,
      mainStreet,
      intersection,
      numeration,
      reference,
      website,
      facebook,
      instagram,
      youtube,
      amenities,
      servicesSelected,
      amenitiesSelected,
      imageUrl,
      bannerImageUrl,
      is_image,
      usersAdmin,
      cities,
      provinces,
      cantones,
      services,
      parking,
      selected,
      week,
      saturday,
      freeday,
    } = this.state;
    const { classes } = this.props;
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
          <FormControl
            className={classes.textField}
            variant='outlined'
            autoFocus
            margin='dense'>
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

          <FormControl
            className={classes.textField}
            variant='outlined'
            autoFocus
            margin='dense'>
            <InputLabel htmlFor='age-helper'>Ciudad</InputLabel>
            <Select
              // className={classes.textField}
              value={city}
              onChange={this.handleChangeField}
              inputProps={{
                name: 'city',
                id: 'city',
              }}>
              {cities.map((v) => {
                return <MenuItem value={v.id}>{v.name}</MenuItem>;
              })}
            </Select>
            {/* <FormHelperText>Some important helper text</FormHelperText>  */}
          </FormControl>
          <FormControl
            className={classes.textField}
            variant='outlined'
            autoFocus
            margin='dense'>
            <InputLabel htmlFor='age-helper'>Provincia</InputLabel>
            <Select
              // className={classes.textField}
              value={province}
              onChange={this.handleChangeField}
              inputProps={{
                name: 'province',
                id: 'province',
              }}>
              {provinces.map((v) => {
                return <MenuItem value={v.id}>{v.name}</MenuItem>;
              })}
            </Select>
            {/* <FormHelperText>Some important helper text</FormHelperText>  */}
          </FormControl>
          <FormControl
            className={classes.textField}
            variant='outlined'
            autoFocus
            margin='dense'>
            <InputLabel htmlFor='age-helper'>Canton</InputLabel>
            <Select
              // className={classes.textField}
              value={canton}
              onChange={this.handleChangeField}
              inputProps={{
                name: 'canton',
                id: 'canton',
              }}>
              {cantones.map((v) => {
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
            value={sector}
            rows='1'
            variant='outlined'
            autoFocus
            margin='dense'
            name='sector'
            label='Sector'
            type='text'
            onChange={this.handleChangeField}
            className={classes.textField}
          //disabled={disabled}
          // fullWidth
          />
          <TextField
            value={mainStreet}
            rows='1'
            variant='outlined'
            autoFocus
            margin='dense'
            name='mainStreet'
            label='Calle principal'
            type='text'
            onChange={this.handleChangeField}
            className={classes.textField}
          //disabled={disabled}
          // fullWidth
          />
          <TextField
            value={intersection}
            rows='1'
            variant='outlined'
            autoFocus
            margin='dense'
            name='intersection'
            label='Intersección'
            type='text'
            onChange={this.handleChangeField}
            className={classes.textField}
          //disabled={disabled}
          // fullWidth
          />
          <TextField
            value={numeration}
            rows='1'
            variant='outlined'
            autoFocus
            margin='dense'
            name='numeration'
            label='Numeración'
            type='text'
            onChange={this.handleChangeField}
            className={classes.textField}
          //disabled={disabled}
          // fullWidth
          />
          <TextField
            value={reference}
            rows='1'
            variant='outlined'
            autoFocus
            margin='dense'
            name='reference'
            label='Referencia'
            type='text'
            onChange={this.handleChangeField}
            className={classes.textField}
          //disabled={disabled}
          // fullWidth
          />
          <TextField
            value={website}
            rows='1'
            variant='outlined'
            autoFocus
            margin='dense'
            name='website'
            label='Sitio web'
            type='text'
            onChange={this.handleChangeField}
            className={classes.textField}
          //disabled={disabled}
          // fullWidth
          />
          <TextField
            value={facebook}
            rows='1'
            variant='outlined'
            autoFocus
            margin='dense'
            name='facebook'
            label='Facebook'
            type='text'
            onChange={this.handleChangeField}
            className={classes.textField}
          //disabled={disabled}
          // fullWidth
          />
          <TextField
            value={instagram}
            rows='1'
            variant='outlined'
            autoFocus
            margin='dense'
            name='instagram'
            label='Instagram'
            type='text'
            onChange={this.handleChangeField}
            className={classes.textField}
          //disabled={disabled}
          // fullWidth
          />
          <TextField
            value={youtube}
            rows='1'
            variant='outlined'
            autoFocus
            margin='dense'
            name='youtube'
            label='ID video youtube'
            type='text'
            onChange={this.handleChangeField}
            className={classes.textField}
          //disabled={disabled}
          // fullWidth
          />
          <FormControl
            className={classes.textField}
            variant='outlined'
            autoFocus
            margin='dense'>
            <InputLabel htmlFor='age-helper'>Comodidades</InputLabel>
            <Select
              // className={classes.textField}
              multiple
              value={amenities}
              onChange={this.handleChangeAmenities}
              inputProps={{
                name: 'amenitiesSelected',
                id: 'amenitiesSelected',
              }}>
              {amenitiesSelected.map((v) => {
                return <MenuItem value={v.id}>{v.name}</MenuItem>;
              })}
              {/* {cities.map((v) => {
                return <MenuItem value={v.id}>{v.name}</MenuItem>;
              })} */}
              {/*   <MenuItem value={1}>Acceso app</MenuItem>
              <MenuItem value={2}>Accesorios para bicicletas</MenuItem>
              <MenuItem value={3}>Aire acondicionado</MenuItem>
              <MenuItem value={4}>Alquiler de bicicletas</MenuItem>
              <MenuItem value={5}>Alquiler de cascos</MenuItem>
              <MenuItem value={6}>Alquiler de equipamento</MenuItem>
            <MenuItem value={7}>Alquiler de pista de bicicletas</MenuItem>*/}
            </Select>
            {/* <FormHelperText>Some important helper text</FormHelperText>  */}
          </FormControl>
          <FormControl
            className={classes.textField}
            variant='outlined'
            autoFocus
            margin='dense'>
            <InputLabel htmlFor='age-helper'>Servicios</InputLabel>
            <Select
              // className={classes.textField}
              multiple
              value={servicesSelected}
              onChange={this.handleChangeServices}
              inputProps={{
                name: 'servicesSelected',
                id: 'servicesSelected',
              }}>
              {services.map((v) => {
                return <MenuItem value={v.id}>{v.name}</MenuItem>;
              })}
            </Select>
            {/* <FormHelperText>Some important helper text</FormHelperText>  */}
          </FormControl>
          <FormControlLabel
            className={classes.textFieldShort}
            control={
              <Checkbox
                name='parking'
                checked={parking}
                onChange={this.handleChangeCheck}
              />
            }
            label='Parqueadero'
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

          <KeyboardTimePicker
            value={week.start}
            inputVariant='outlined'
            autoFocus
            margin='dense'
            id='time-picker'
            label='Lun a vie Mañana: Desde'
            onChange={(e) => this.handleDateChange(e, 'week', 'start')}
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
            className={classes.textFieldShort}
          />
          <KeyboardTimePicker
            value={week.end}
            inputVariant='outlined'
            autoFocus
            margin='dense'
            id='time-picker'
            label='Lun a vie Mañana: Hasta'
            onChange={(e) => this.handleDateChange(e, 'week', 'end')}
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
            className={classes.textFieldShort}
          />
          <KeyboardTimePicker
            value={week.startAfternoon}
            inputVariant='outlined'
            autoFocus
            margin='dense'
            id='time-picker'
            label='Lun a vie Tarde: Desde'
            onChange={(e) => this.handleDateChange(e, 'week', 'startAfternoon')}
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
            className={classes.textFieldShort}
          />
          <KeyboardTimePicker
            value={week.endAfternoon}
            inputVariant='outlined'
            autoFocus
            margin='dense'
            id='time-picker'
            label='Lun a vie Tarde: Hasta'
            onChange={(e) => this.handleDateChange(e, 'week', 'endAfternoon')}
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
            className={classes.textFieldShort}
          />

          <KeyboardTimePicker
            value={saturday.start}
            inputVariant='outlined'
            autoFocus
            margin='dense'
            id='time-picker'
            label='Sabados Mañana: Desde'
            onChange={(e) => this.handleDateChange(e, 'saturday', 'start')}
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
            className={classes.textFieldShort}
          />
          <KeyboardTimePicker
            value={saturday.end}
            inputVariant='outlined'
            autoFocus
            margin='dense'
            id='time-picker'
            label='Sabados Mañana: Hasta'
            onChange={(e) => this.handleDateChange(e, 'saturday', 'end')}
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
            className={classes.textFieldShort}
          />
          <KeyboardTimePicker
            value={saturday.startAfternoon}
            inputVariant='outlined'
            autoFocus
            margin='dense'
            id='time-picker'
            label='Sabados Tarde: Desde'
            onChange={(e) =>
              this.handleDateChange(e, 'saturday', 'startAfternoon')
            }
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
            className={classes.textFieldShort}
          />
          <KeyboardTimePicker
            value={saturday.endAfternoon}
            inputVariant='outlined'
            autoFocus
            margin='dense'
            id='time-picker'
            label='Sabados Tarde: Hasta'
            onChange={(e) =>
              this.handleDateChange(e, 'saturday', 'endAfternoon')
            }
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
            className={classes.textFieldShort}
          />

          <KeyboardTimePicker
            value={freeday.start}
            inputVariant='outlined'
            autoFocus
            margin='dense'
            id='time-picker'
            label='Domingos y feriados Mañana: Desde'
            onChange={(e) => this.handleDateChange(e, 'freeday', 'start')}
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
            className={classes.textFieldShort}
          />
          <KeyboardTimePicker
            value={freeday.end}
            inputVariant='outlined'
            autoFocus
            margin='dense'
            id='time-picker'
            label='Domingos y feriados Mañana: Hasta'
            onChange={(e) => this.handleDateChange(e, 'freeday', 'end')}
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
            className={classes.textFieldShort}
          />
          <KeyboardTimePicker
            value={freeday.startAfternoon}
            inputVariant='outlined'
            autoFocus
            margin='dense'
            id='time-picker'
            label='Domingos y feriados Tarde: Desde'
            onChange={(e) =>
              this.handleDateChange(e, 'freeday', 'startAfternoon')
            }
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
            className={classes.textFieldShort}
          />
          <KeyboardTimePicker
            value={freeday.endAfternoon}
            inputVariant='outlined'
            autoFocus
            margin='dense'
            id='time-picker'
            label='Domingos y feriados Tarde: Hasta'
            onChange={(e) =>
              this.handleDateChange(e, 'freeday', 'endAfternoon')
            }
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
            className={classes.textFieldShort}
          />

          <FormControl
            className={classes.textFieldShort}
            // variant='outlined'
            // autoFocus
            margin='dense'>
            {/* <InputLabel htmlFor='age-helper'>Imagen principal</InputLabel> */}

            <AntImageCrop
              name='imageUrl'
              blobName='image'
              changeImage={this.handleChangeCrop}
              imageUrl={imageUrl}
            />
            <FormHelperText>Imagen principal</FormHelperText>
          </FormControl>

          <FormControl
            className={classes.textFieldShort}
            // variant='outlined'
            // autoFocus
            margin='dense'>

            <AntSelectImage
              name='bannerImageUrl'
              //  is_image='is_image'
              handleIsImage={this.handleIsImage}
              blobName='bannerImage'
              changeImage={this.handleChangeCrop}
              imageUrl={bannerImageUrl}
            />
            <FormHelperText>Imagen panoramica</FormHelperText>
          </FormControl>
          <FormControl
            className={classes.textFieldShort}
            margin='dense'>
            <AntSelectVideo
              blobName='bannerImage'
              name='bannerImageUrl'
              handleIsVideo={this.handleIsVideo}


              // is_image={is_image}
              imageUrl={bannerImageUrl}
              changeImage={this.handleChangeCrop}
            />
            <FormHelperText>Video panoramica</FormHelperText>
          </FormControl>


          <div>
            {' '}
            <div className='p-5'>
              <CircularIntegration
                executeFunction={this.handleUpload}
                loadingButton={loading}
              />
            </div>
            <span style={{ color: 'red' }}>{errorFields}</span>{' '}
          </div>
        </div>
      </>
    );
  }
}


export default withStyles(useStyles)(AdminBranch);
