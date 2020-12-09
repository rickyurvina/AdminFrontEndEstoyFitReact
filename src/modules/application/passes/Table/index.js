import React from 'react';
import moment from 'moment';
// import 'react-image-crop/lib/ReactCrop.scss';
//import {useSelector} from 'react-redux';
//import matchSorter from 'match-sorter';
import ReactTable from 'react-table';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import CircularIndeterminate from '../customComponents/CircularIndeterminate';
import CircularIntegration from '../customComponents/InteractiveIntegration';
import {
  getPasses,
  savePasse,
  activePasse,
  deletePasse,
} from '../../../../@crema/services/applicationServices/passes';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import HomeIcon from '@material-ui/icons/Home';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';
import Swal from 'sweetalert2';
import {
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import deLocale from 'date-fns/locale/es';

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
  calcButton: {
    width: 'calc(50% - 50px)',
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
  textFieldShort: {
    width: 'calc(25% - 25px)',
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
          Header: 'Información',
          columns: [
            {
              Header: 'Nombre',
              accessor: 'name',
              id: 'name',
              filterMethod: (filter, row) =>
                row[filter.id]
                  .toUpperCase()
                  .startsWith(filter.value.toUpperCase()) ||
                row[filter.id]
                  .toUpperCase()
                  .endsWith(filter.value.toUpperCase()),
            },
            // {
            //   Header: 'Descripción',
            //   accessor: 'description',
            //   id: 'description',
            //   filterMethod: (filter, row) =>
            //     row[filter.id].startsWith(filter.value) ||
            //     row[filter.id].endsWith(filter.value),
            // },
            {
              Header: 'Ciudad',
              accessor: 'cityName',
              id: 'cityName',
              filterMethod: (filter, row) =>
                row[filter.id]
                  .toUpperCase()
                  .startsWith(filter.value.toUpperCase()) ||
                row[filter.id]
                  .toUpperCase()
                  .endsWith(filter.value.toUpperCase()),
            },
            {
              Header: 'Establecimiento',
              accessor: 'gymName',
              id: 'gymName',
              filterMethod: (filter, row) =>
                row[filter.id]
                  .toUpperCase()
                  .startsWith(filter.value.toUpperCase()) ||
                row[filter.id]
                  .toUpperCase()
                  .endsWith(filter.value.toUpperCase()),
            },
          ],
        },
        {
          Header: 'Pases',
          columns: [
            {
              Header: 'Tipo',
              accessor: 'typeName',
              id: 'typeName',
              filterMethod: (filter, row) =>
                row[filter.id]
                  .toUpperCase()
                  .startsWith(filter.value.toUpperCase()) ||
                row[filter.id]
                  .toUpperCase()
                  .endsWith(filter.value.toUpperCase()),
            },
            {
              Header: 'Categoría',
              accessor: 'categoryName',
              id: 'categoryName',
              filterMethod: (filter, row) =>
                row[filter.id]
                  .toUpperCase()
                  .startsWith(filter.value.toUpperCase()) ||
                row[filter.id]
                  .toUpperCase()
                  .endsWith(filter.value.toUpperCase()),
            },
          ],
        },
        {
          Header: 'Precios',
          columns: [
            {
              Header: 'Original',
              accessor: 'original_price',
              id: 'original_price',
              filterMethod: (filter, row) => row[filter.id] == filter.value,
            },
            {
              Header: 'Estoy fit',
              accessor: 'train_now_price',
              id: 'train_now_price',
              filterMethod: (filter, row) => row[filter.id] == filter.value,
            },
          ],
        },
        {
          Header: 'Pases',
          columns: [
            // {
            //   Header: 'Activo',
            //   accessor: 'active',
            //   id: 'active',
            //   Cell: row => row.row.active == '1' ? 'Activo' : 'Inactivo'
            // },
            {
              Header: 'Acciones',
              Cell: (row) => (
                <div>
                  <a href='#' onClick={(e) => this.handleEdit(e, row.original)}>
                    {' '}
                    <EditIcon style={{ fill: '#0A8FDC' }} />{' '}
                  </a>
                  <a
                    href='#'
                    onClick={(e) => this.confirmDelete(e, row.original)}>
                    {' '}
                    <DeleteIcon style={{ fill: '#0A8FDC' }} />{' '}
                  </a>
                  <a
                    href='#'
                    onClick={(e) => this.confirmActive(e, row.original)}>
                    {' '}
                    {row.original.active == '1' && (
                      <HomeIcon style={{ fill: '#1CA93A' }} />
                    )}
                    {row.original.active == '0' && (
                      <HomeOutlinedIcon style={{ fill: '#F04F47' }} />
                    )}
                  </a>
                </div>
              ),
              filterMethod: (filter, row) => {
                console.log(
                  'FILTER ID => ',
                  filter,
                  row._original,
                  row._original['active'],
                );
                if (filter.value == 'all') {
                  return true;
                }
                if (filter.value == '0') {
                  return row._original['active'] == '0';
                }
                return row._original['active'] == '1';
              },
              Filter: ({ filter, onChange }) => (
                <select
                  onChange={(event) => onChange(event.target.value)}
                  style={{ width: '100%' }}
                  value={filter ? filter.value : 'all'}>
                  <option value='all'>Todos</option>
                  <option value='1'>Activos</option>
                  <option value='0'>Inactivos</option>
                </select>
              ),
            },
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
      row: {},
      id: null,
      branchId: '',
      name: '',
      description: '',
      conditions: '',
      originalPrice: '',
      discount: '0',
      typeDiscount: 0,
      disc: '0',
      trainNowPrice: '0',
      daysForValidate: '0',
      expirationDate: null,
      color: '',
      sort: '',
      nAvaible: '',
      validFrom: moment().format(),
      validTo: moment().format(),
      trainNowBlack: 0,
      hotDeal: 0,
      forTurist: '',
      type: '',
      category: '',
      comission: '',
      comissionFixPrice: '',
      active: '',
      disabledDate: true,
      errorFields: '',
    };
  }

  componentDidMount() {
    this.getPasses();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.openModal !== this.props.openModal) {
      this.handleClickOpen();
    }
  }

  getPasses = async () => {
    this.setState({ loadingTable: true });
    const resp = await getPasses();
    console.log('RESPONSED ', resp.data);
    this.setState({
      data: resp.data,
      branchs: resp.gym_branchs,
      loadingTable: false,
    });
  };

  handleChangeField = (event) => {
    const {
      target: { name, value },
    } = event;
    this.setState({ [name]: value });
  };

  handleChangeDate = (event, name) => {
    const date = moment(event, 'yyyy/MM/dd HH:mm');
    this.setState({ [name]: date });
  };

  handleChangeCheck = (event) => {
    const {
      target: { name, checked },
    } = event;
    const value = checked ? 1 : 0;
    this.setState({ [name]: value });
    if (name == 'hotDeal') {
      this.setState({ disabledDate: !value });
    }
  };

  handleChangeColor = (event, nextView) => {
    console.log('NEXT VIEW', nextView);
    this.setState({ color: nextView });
    //setView(nextView);
  };

  activePasse = async (id, action) => {
    this.setLoading(true);

    console.log('ACTIVE ', id);
    const response = await activePasse(id,action);
    console.log('RESPONSE', response);
    let { data } = this.state;
    let index = data.findIndex((item) => item.id == id);
    data[index].active = action;
    console.log('DATA MODIFIED =? ', data);
    this.setState({ data, id: null });
    this.setLoading(true);
  };

  confirmActive = (e, row) => {
    e.preventDefault();
    const textAction = row.active == '0' ? 'Activar' : 'Desactivar';
    const textActionSuccess = row.active == '0' ? 'Activado' : 'Desactivado';
    const action = row.active == '0' ? '1' : '0';
    this.setState({ id: row.id });
    Swal.fire({
      title: `Está seguro de que desea ${textAction} este pase?`,
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0A8FDC',
      cancelButtonColor: '#F04F47',
      confirmButtonText: `Si, ${textAction}!`,
    }).then((result) => {
      if (result.value) {
        this.activePasse(row.id, action);
        Swal.fire(
          `${textActionSuccess}!`,
          `El pase ${row.name} fue ${textActionSuccess} correctamente.`,
          'success',
        );
      }
    });
  };

  handleEdit = async (e, row) => {
    e.preventDefault();
    console.log('EDITING ', row);
    this.setState({
      isUpdate: true,
      id: row.id,
      active: row.active,
      branchId: row.branch_id,
      name: row.name,
      description: row.description,
      conditions: row.conditions,
      originalPrice: row.original_price,
      discount: row.discount,
      typeDiscount: row.type_discount,
      disc: row.discount_value,
      trainNowPrice: row.train_now_price,
      daysForValidate: row.days_for_validate,
      expirationDate: row.expiration_date,
      color: row.color,
      sort: row.sort,
      nAvaible: row.n_avaible,
      validFrom: row.valid_from,
      validTo: row.valid_to,
      trainNowBlack: row.train_now_black,
      hotDeal: row.hot_deal,
      forTurist: row.for_turist,
      type: row.type,
      category: row.category,
      comission: row.commission,
      comissionFixPrice: row.commission_fix_price,
      disabledDate: !row.hot_deal,
    });

    this.handleClickOpen();
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
      branchId: '',
      name: '',
      description: '',
      conditions: '',
      originalPrice: '',
      discount: '0',
      typeDiscount: false,
      disc: '0',
      trainNowPrice: '0',
      daysForValidate: '0',
      expirationDate: '',
      color: '',
      sort: '',
      nAvaible: '',
      validFrom: '',
      validTo: '',
      trainNowBlack: '',
      hotDeal: '',
      forTurist: '',
      type: '',
      category: '',
      comission: '',
      comissionFixPrice: '',
      active: '',
      errorFields: '',
    });
  };

  handleDelete = async (row) => {
    this.setLoading(true);

    console.log('DELETING ', row);
    const { id } = this.state;
    const response = await deletePasse(id);
    const { data } = response;

    this.setState({ data, id: null });
    this.setLoading(true);
  };

  confirmDelete = (e, row) => {
    e.preventDefault();
    this.setState({ id: row.id });
    Swal.fire({
      title: 'Está seguro de que desea eliminar este pase?',
      text: 'No podrá revertir los cambios!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0A8FDC',
      cancelButtonColor: '#F04F47',
      confirmButtonText: 'Si, eliminalo!',
    }).then((result) => {
      if (result.value) {
        this.handleDelete();
        Swal.fire(
          'Eliminado!',
          `El pase ${row.name} fue eliminado correctamente.`,
          'success',
        );
      }
    });
  };

  validateFields = async () => {
    console.log('validating ');
    const { commercialName, ruc, userEmail, resume, typeBusiness } = this.state;
    if (
      commercialName == '' ||
      ruc == '' ||
      userEmail == '' ||
      resume == '' ||
      typeBusiness == ''
    ) {
      return false;
    } else {
      return true;
    }
  };

  send = async () => {
    this.setLoading(true);

    const {
      id,
      branchId,
      name,
      description,
      conditions,
      originalPrice,
      discount,
      typeDiscount,
      disc,
      trainNowPrice,
      daysForValidate,
      expirationDate,
      color,
      sort,
      nAvaible,
      validFrom,
      validTo,
      trainNowBlack,
      hotDeal,
      forTurist,
      type,
      category,
      comission,
      comissionFixPrice,
      active,
    } = this.state;

    console.log('color to back ',color)
    const objectSend = {
      id,
      branchId,
      name,
      description,
      conditions,
      originalPrice,
      discount,
      typeDiscount,
      disc,
      trainNowPrice,
      daysForValidate,
      expirationDate,
      color,
      sort,
      nAvaible,
      validFrom,
      validTo,
      trainNowBlack,
      hotDeal,
      forTurist,
      type,
      category,
      comission,
      comissionFixPrice,
      active,
    };


    const response = await savePasse(objectSend);
    const { data } = response;
    console.log('RESPONSE IN UPDATE ggg', response.data);
    this.setState({ data, id: null, open: false });

    this.setLoading(false);
  };

  setLoading = (bool) => {
    this.setState({ loading: bool });
  };

  calculatePrice = () => {
    let { originalPrice, discount, typeDiscount, trainNowPrice } = this.state;
    let disc = 0;
    if(typeDiscount){
      disc = (discount * originalPrice) / 100;
      trainNowPrice = originalPrice - disc;
    }else{
      disc = discount;
      trainNowPrice = originalPrice - disc;
    }

    trainNowPrice = originalPrice - disc;
    
    this.setState({ trainNowPrice, disc });
    console.log('DISCOUNTS ', disc);
  };

  render() {
    const {
      data,
      branchs,
      errorFields,
      columns,
      open,
      isUpdate,
      loadingTable,
      loading,
      branchId,
      name,
      description,
      conditions,
      originalPrice,
      discount,
      typeDiscount,
      disc,
      trainNowPrice,
      daysForValidate,
      expirationDate,
      color,
      sort,
      nAvaible,
      validFrom,
      validTo,
      trainNowBlack,
      hotDeal,
      forTurist,
      type,
      category,
      comission,
      comissionFixPrice,
      active,
      disabledDate,
    } = this.state;
    const { classes } = this.props;
    console.log('COLOR ', color);
    return (
      <>
        {loadingTable === true ? (
          <CircularIndeterminate />
        ) : (
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
          )}

        <Dialog
          open={open}
          onClose={this.handleClose}
          aria-labelledby='form-dialog-title'
          fullWidth={true}
          // className={classes.textField}
          maxWidth={'md'}>
          <DialogTitle id='form-dialog-title'>Editar</DialogTitle>
          <DialogContent>
            <DialogContentText>
              En este espacio puedes editar un pase.
            </DialogContentText>
            <div className=''>
              {/* <FormControlLabel
                className={classes.textField}
                control={
                  <Checkbox
                    icon={<HomeOutlinedIcon />}
                    checkedIcon={<HomeIcon />}
                    name='active'
                    checked={active}
                    onChange={this.handleChangeCheck}
                  />
                }
                label='Active'
              /> */}
              <FormControl
                className={classes.textField}
                variant='outlined'
                autoFocus
                margin='dense'>
                <InputLabel htmlFor='age-helper'>Centros</InputLabel>
                <Select
                  // className={classes.textField}
                  value={branchId}
                  onChange={this.handleChangeField}
                  inputProps={{
                    name: 'branchId',
                    id: 'branchId',
                  }}>
                  {/* <MenuItem value={1}>Gym 1</MenuItem> */}
                  {branchs.map((v) => {
                    return (
                      <MenuItem value={v.id}>{v.commercial_name}</MenuItem>
                    );
                  })}
                </Select>
                {/* <FormHelperText>Some important helper text</FormHelperText>  */}
              </FormControl>

              <FormControl
                className={classes.textField}
                variant='outlined'
                autoFocus
                margin='dense'>
                <InputLabel htmlFor='age-helper'></InputLabel>
                <ToggleButtonGroup
                  size='medium'
                  // orientation='vertical'
                  value={color}
                  exclusive
                  onChange={this.handleChangeColor}>
                  <ToggleButton value={1} aria-label='list'>
                    <ConfirmationNumberIcon style={{ fill: '#B42B63' }} />
                  </ToggleButton>
                  <ToggleButton value={2} aria-label='module'>
                    <ConfirmationNumberIcon style={{ fill: '#DEA728' }} />
                  </ToggleButton>
                  <ToggleButton value={3} aria-label='quilt'>
                    <ConfirmationNumberIcon style={{ fill: '#50B0DD' }} />
                  </ToggleButton>
                  <ToggleButton value={4} aria-label='quilt'>
                    <ConfirmationNumberIcon style={{ fill: '#84DE50' }} />
                  </ToggleButton>
                  <ToggleButton value={5} aria-label='quilt'>
                    <ConfirmationNumberIcon style={{ fill: '#8B63D5' }} />
                  </ToggleButton>
                  <ToggleButton value={6} aria-label='quilt'>
                    <ConfirmationNumberIcon style={{ fill: '#FF5733' }} />
                  </ToggleButton>
                  <ToggleButton value={7} aria-label='quilt'>
                    <ConfirmationNumberIcon style={{ fill: '#FF2929' }} />
                  </ToggleButton>
                  <ToggleButton value={8} aria-label='quilt'>
                    <ConfirmationNumberIcon style={{ fill: '#FE4384' }} />
                  </ToggleButton>
                </ToggleButtonGroup>

                {/* <FormHelperText>Some important helper text</FormHelperText>  */}
              </FormControl>

              <TextField
                value={name}
                rows='1'
                variant='outlined'
                autoFocus
                margin='dense'
                name='name'
                label='Nombre'
                type='text'
                onChange={this.handleChangeField}
                className={classes.textFieldLarge}
              // fullWidth
              />

              <TextField
                value={description}
                //rows='1'
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

              <TextField
                value={conditions}
                rows='1'
                variant='outlined'
                autoFocus
                margin='dense'
                name='conditions'
                label='Condiciones'
                placeholder='Escribe aquí las condiciones del pase'
                multiline
                rows={2}
                rowsMax={4}
                type='text'
                onChange={this.handleChangeField}
                className={classes.textFieldLarge}
              // fullWidth
              />

              <TextField
                value={originalPrice}
                rows='1'
                variant='outlined'
                autoFocus
                margin='dense'
                name='originalPrice'
                label='Precio original'
                type='number'
                onChange={this.handleChangeField}
                className={classes.textField}
              // fullWidth
              />

              <FormControlLabel
                className={classes.textFieldShort}
                control={
                  <Checkbox
                    name='typeDiscount'
                    checked={typeDiscount}
                    onChange={this.handleChangeCheck}
                  />
                }
                label='Tipo descuento % / $'
              />

              <TextField
                value={discount}
                rows='1'
                variant='outlined'
                autoFocus
                margin='dense'
                name='discount'
                label='Descuento'
                type='number'
                onChange={this.handleChangeField}
                className={classes.textFieldShort}
              // fullWidth
              />


              <TextField
                value={trainNowPrice}
                rows='1'
                variant='outlined'
                autoFocus
                margin='dense'
                name='trainNowPrice'
                label='Precio entrena ya'
                type='number'
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
                <Button
                  variant='contained'
                  color='primary'
                  onClick={this.calculatePrice}
                // className={classes.calcButton}
                >
                  Calcular precio entrenaYa
                </Button>
              </FormControl>

              <TextField
                value={comission}
                rows='1'
                variant='outlined'
                autoFocus
                margin='dense'
                name='comission'
                label='Comisión'
                type='number'
                onChange={this.handleChangeField}
                className={classes.textField}
              //disabled={disabled}
              // fullWidth
              />

              <TextField
                value={comissionFixPrice}
                rows='1'
                variant='outlined'
                autoFocus
                margin='dense'
                name='comissionFixPrice'
                label='Comisión precio fijo'
                type='number'
                onChange={this.handleChangeField}
                className={classes.textField}
              //disabled={disabled}
              // fullWidth
              />

              <MuiPickersUtilsProvider locale={deLocale} utils={DateFnsUtils}>
                <KeyboardDateTimePicker
                  value={expirationDate}
                  name='expirationDate'
                  inputVariant='outlined'
                  autoFocus
                  margin='dense'
                  id='time-picker'
                  // autoOk
                  ampm={true}
                  onChange={(e) => this.handleChangeDate(e, 'expirationDate')}
                  label='Fecha de expiración'
                  onError={console.log}
                  disablePast
                  format='yyyy/MM/dd HH:mm'
                  KeyboardButtonProps={{ 'aria-label': 'Select time' }}
                  className={classes.textField}
                />
              </MuiPickersUtilsProvider>

              <TextField
                value={sort}
                rows='1'
                variant='outlined'
                autoFocus
                margin='dense'
                name='sort'
                label='Orden'
                type='number'
                onChange={this.handleChangeField}
                className={classes.textField}
              //disabled={disabled}
              // fullWidth
              />
              <TextField
                value={nAvaible}
                rows='1'
                variant='outlined'
                autoFocus
                margin='dense'
                name='nAvaible'
                label='Cantidad disponible'
                type='number'
                onChange={this.handleChangeField}
                className={classes.textField}
              //disabled={disabled}
              // fullWidth
              />
              <FormControlLabel
                className={classes.textField}
                control={
                  <Checkbox
                    name='hotDeal'
                    checked={hotDeal}
                    onChange={this.handleChangeCheck}
                  />
                }
                label='Pase de promoción'
              />

              <MuiPickersUtilsProvider locale={deLocale} utils={DateFnsUtils}>
                <KeyboardDateTimePicker
                  disabled={disabledDate}
                  value={validFrom}
                  name='validFrom'
                  inputVariant='outlined'
                  autoFocus
                  margin='dense'
                  id='time-picker'
                  // autoOk
                  ampm={true}
                  onChange={(e) => this.handleChangeDate(e, 'validFrom')}
                  label='Valido desde'
                  onError={console.log}
                  disablePast
                  format='yyyy/MM/dd HH:mm'
                  KeyboardButtonProps={{ 'aria-label': 'Select time' }}
                  className={classes.textField}
                />
              </MuiPickersUtilsProvider>

              <MuiPickersUtilsProvider locale={deLocale} utils={DateFnsUtils}>
                <KeyboardDateTimePicker
                  disabled={disabledDate}
                  value={validTo}
                  name='validTo'
                  inputVariant='outlined'
                  autoFocus
                  margin='dense'
                  id='time-picker'
                  // autoOk
                  ampm={true}
                  onChange={(e) => this.handleChangeDate(e, 'validTo')}
                  label='Valido hasta'
                  onError={console.log}
                  disablePast
                  format='yyyy/MM/dd HH:mm'
                  KeyboardButtonProps={{ 'aria-label': 'Select time' }}
                  className={classes.textField}
                />
              </MuiPickersUtilsProvider>

              <FormControl
                className={classes.textField}
                variant='outlined'
                autoFocus
                margin='dense'>
                <InputLabel htmlFor='age-helper'>Tipo</InputLabel>
                <Select
                  // className={classes.textField}
                  value={type}
                  onChange={this.handleChangeField}
                  inputProps={{
                    name: 'type',
                    id: 'type',
                  }}>
                  <MenuItem value={1}>tipo A</MenuItem>
                  <MenuItem value={2}>tipo B</MenuItem>
                  {/* {usersAdmin.map((v) => {
                return <MenuItem value={v.id}>{v.name}</MenuItem>;
              })} */}
                </Select>
                {/* <FormHelperText>Some important helper text</FormHelperText>  */}
              </FormControl>

              <FormControl
                className={classes.textField}
                variant='outlined'
                autoFocus
                margin='dense'>
                <InputLabel htmlFor='age-helper'>Categoría</InputLabel>
                <Select
                  // className={classes.textField}
                  value={category}
                  onChange={this.handleChangeField}
                  inputProps={{
                    name: 'category',
                    id: 'category',
                  }}>
                  <MenuItem value={1}>Categoría A</MenuItem>
                  <MenuItem value={2}>Categoría B</MenuItem>
                  {/* {usersAdmin.map((v) => {
                return <MenuItem value={v.id}>{v.name}</MenuItem>;
              })} */}
                </Select>
                {/* <FormHelperText>Some important helper text</FormHelperText>  */}
              </FormControl>

              <TextField
                value={daysForValidate}
                rows='1'
                variant='outlined'
                autoFocus
                margin='dense'
                name='daysForValidate'
                label='Dias para validar'
                type='number'
                onChange={this.handleChangeField}
                className={classes.textField}
              //disabled={disabled}
              // fullWidth
              />

              <div>
                {' '}
                <span style={{ color: 'red' }}>{errorFields}</span>{' '}
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <div className='p-5'>
              <CircularIntegration
                executeFunction={this.send}
                loadingButton={loading}
              />
            </div>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default withStyles(useStyles)(Table);

// export default Table;
