import React from 'react';
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
  getTypePasses,
  saveTypePasse,
  deleteTypePasse,
} from '../../../../@crema/services/applicationServices/typePasses';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import BlockIcon from '@material-ui/icons/Block';
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
const months = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

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
          ],
        },
        {
          Header: 'Condiciones',
          columns: [
            {
              Header: 'Mes a cobrar',
              accessor: 'month',
              id: 'month',
              Cell: (row) => months[row.row.month],
              filterMethod: (filter, row) =>
                months[row[filter.id]] == filter.value,
            },
            {
              Header: 'Uno por usuario',
              accessor: 'one_per_user',
              id: 'one_per_user',
              Cell: (row) =>
                row.row.one_per_user == '1' ? (
                  <DoneOutlineIcon style={{fill: '#0A8FDC'}} />
                ) : (
                  <BlockIcon style={{fill: '#F04F47'}} />
                ),
              filterMethod: (filter, row) => row[filter.id] == filter.value,
            },
            {
              Header: 'Solo primera cuota',
              accessor: 'only_first_fee',
              id: 'only_first_fee',
              Cell: (row) =>
                row.row.only_first_fee == '1' ? (
                  <DoneOutlineIcon style={{fill: '#0A8FDC'}} />
                ) : (
                  <BlockIcon style={{fill: '#F04F47'}} />
                ),
              filterMethod: (filter, row) => row[filter.id] == filter.value,
            },
            {
              Header: 'Pase flexible',
              accessor: 'flexibility',
              id: 'flexibility',
              Cell: (row) =>
                row.row.flexibility == '1' ? (
                  <DoneOutlineIcon style={{fill: '#0A8FDC'}} />
                ) : (
                  <BlockIcon style={{fill: '#F04F47'}} />
                ),
              filterMethod: (filter, row) => row[filter.id] == filter.value,
            },
          ],
        },
        {
          Header: '',
          columns: [
            {
              Header: 'Acciones',
              Cell: (row) => (
                <div>
                  <a href='#' onClick={(e) => this.handleEdit(e, row.original)}>
                    {' '}
                    <EditIcon style={{fill: '#0A8FDC'}} />{' '}
                  </a>
                  <a
                    href='#'
                    onClick={(e) => this.confirmDelete(e, row.original)}>
                    {' '}
                    <DeleteIcon style={{fill: '#0A8FDC'}} />{' '}
                  </a>
                </div>
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
      name: '',
      identifier: '',
      benefeats: '',
      infinite: 0,
      quantitySessions: '',
      durationDays: '',
      flexibility: 0,
      limitDaysActivate: '',
      onePerUser: 0,
      onlyFirstFee: 0,
      quantityFee: '',
      month: '',
      disabledMonths: false,
      errorFields: '',
    };
  }

  componentDidMount() {
    this.getTypePasses();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.openModal !== this.props.openModal) {
      this.handleClickOpen();
    }
  }

  getTypePasses = async () => {
    this.setState({loadingTable: true});
    const resp = await getTypePasses();
    console.log('RESPONSED ', resp.data);
    this.setState({
      data: resp.data,
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
    const {
      target: {name, checked},
    } = event;
    const value = checked ? 1 : 0;
    this.setState({[name]: value});

    if (name == 'onlyFirstFee') {
      this.setState({disabledMonths: value});
    }
  };

  handleEdit = async (e, row) => {
    e.preventDefault();
    console.log('EDITING ', row);
    this.setState({
      isUpdate: true,
      id: row.id,
      name: row.name,
      identifier: row.identifier,
      benefeats: row.benefeats,
      infinite: row.infinite,
      quantitySessions: row.quantity_sessions,
      durationDays: row.duration_days,
      flexibility: row.flexibility,
      limitDaysActivate: row.limit_days_activate,
      onePerUser: row.one_per_user,
      onlyFirstFee: row.only_first_fee,
      quantityFee: row.quantity_fee,
      month: row.month,
      disabledMonths: row.only_first_fee ? true : false,
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
      name: '',
      identifier: '',
      benefeats: '',
      infinite: false,
      quantitySessions: '',
      durationDays: '',
      flexibility: false,
      limitDaysActivate: '',
      onePerUser: false,
      onlyFirstFee: false,
      quantityFee: '',
      month: '',
      disabledMonths: false,
      errorFields: '',
    });
  };

  handleDelete = async (row) => {
    this.setLoading(true);

    console.log('DELETING ', row);
    const {id} = this.state;
    const response = await deleteTypePasse(id);
    const {data} = response;

    this.setState({data, id: null});
    this.setLoading(true);
  };

  confirmDelete = (e, row) => {
    e.preventDefault();
    this.setState({id: row.id});
    Swal.fire({
      title: 'Está seguro de que desea eliminar este tipo de pase?',
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
          `El tipo de pase ${row.name} fue eliminado correctamente.`,
          'success',
        );
      }
    });
  };

  validateFields = async () => {
    console.log('validating ');
    const {commercialName, ruc, userEmail, resume, typeBusiness} = this.state;
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
      name,
      identifier,
      benefeats,
      infinite,
      quantitySessions,
      durationDays,
      flexibility,
      limitDaysActivate,
      onePerUser,
      onlyFirstFee,
      quantityFee,
      month,
    } = this.state;
    const objectSend = {
      id,
      name,
      identifier,
      benefeats,
      infinite,
      quantitySessions,
      durationDays,
      flexibility,
      limitDaysActivate,
      onePerUser,
      onlyFirstFee,
      quantityFee,
      month,
    };
    const response = await saveTypePasse(objectSend);
    const {data} = response;
    console.log('RESPONSE IN UPDATE ggg', response.data);
    this.setState({data, id: null, open: false});

    this.setLoading(false);
  };

  setLoading = (bool) => {
    this.setState({loading: bool});
  };

  render() {
    const {
      columns,
      open,
      data,
      name,
      identifier,
      benefeats,
      infinite,
      quantitySessions,
      durationDays,
      flexibility,
      limitDaysActivate,
      onePerUser,
      onlyFirstFee,
      quantityFee,
      month,
      disabledMonths,
      errorFields,
      loading,
      loadingTable,
    } = this.state;
    const {classes} = this.props;
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
              En este espacio puedes editar un tipo de pase.
            </DialogContentText>
            <div className=''>
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
                value={benefeats}
                rows='1'
                variant='outlined'
                autoFocus
                margin='dense'
                name='benefeats'
                label='Beneficios'
                placeholder='Escribe aquí los beneficios del tipo de pase'
                multiline
                rows={2}
                rowsMax={4}
                type='text'
                onChange={this.handleChangeField}
                className={classes.textFieldLarge}
                // fullWidth
              />

              <TextField
                value={identifier}
                rows='1'
                variant='outlined'
                autoFocus
                margin='dense'
                name='identifier'
                label='Identificador'
                type='text'
                onChange={this.handleChangeField}
                className={classes.textField}
                disabled={true}
                // fullWidth
              />

              {/* <FormControlLabel
                className={classes.textField}
                control={
                  <Checkbox
                    name='infinite'
                    checked={infinite}
                    onChange={this.handleChangeCheck}
                  />
                }
                label='Infinito'
              /> */}

              <TextField
                value={quantitySessions}
                rows='1'
                variant='outlined'
                autoFocus
                margin='dense'
                name='quantitySessions'
                label='Cantidad de pases (sesiones)'
                type='number'
                onChange={this.handleChangeField}
                className={classes.textField}
                // fullWidth
              />

              <TextField
                value={durationDays}
                rows='1'
                variant='outlined'
                autoFocus
                margin='dense'
                name='durationDays'
                label='Duración'
                type='number'
                onChange={this.handleChangeField}
                className={classes.textField}
                // fullWidth
              />

              <FormControlLabel
                className={classes.textField}
                control={
                  <Checkbox
                    name='flexibility'
                    checked={flexibility}
                    onChange={this.handleChangeCheck}
                  />
                }
                label='Flexibilidad'
              />
              <TextField
                value={limitDaysActivate}
                rows='1'
                variant='outlined'
                autoFocus
                margin='dense'
                name='limitDaysActivate'
                label='Limite de días para activar'
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
                    name='onePerUser'
                    checked={onePerUser}
                    onChange={this.handleChangeCheck}
                  />
                }
                label='Uno por usuario'
              />

              <FormControlLabel
                className={classes.textField}
                control={
                  <Checkbox
                    name='onlyFirstFee'
                    checked={onlyFirstFee}
                    onChange={this.handleChangeCheck}
                  />
                }
                label='Sólo primera cuota'
              />
              <TextField
                value={quantityFee}
                rows='1'
                variant='outlined'
                autoFocus
                margin='dense'
                name='quantityFee'
                label='Cantidad de cuotas'
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
                <InputLabel htmlFor='age-helper'>Mes</InputLabel>
                <Select
                  // className={classes.textField}
                  disabled={disabledMonths}
                  value={month}
                  onChange={this.handleChangeField}
                  inputProps={{
                    name: 'month',
                    id: 'month',
                  }}>
                  {months.map((v, i) => {
                    return <MenuItem value={i}>{v}</MenuItem>;
                  })}
                </Select>
                {/* <FormHelperText>Some important helper text</FormHelperText>  */}
              </FormControl>

              <div>
                {' '}
                <span style={{color: 'red'}}>{errorFields}</span>{' '}
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
