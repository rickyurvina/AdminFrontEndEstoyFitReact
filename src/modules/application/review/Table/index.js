import React from 'react';

import ReactTable from 'react-table';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import CircularIntegration from '../customComponents/InteractiveIntegration';


import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import CircularIndeterminate from '../customComponents/CircularIndeterminate';

import { getReviews,  deleteReview, activeReview } from '../../../../@crema/services/applicationServices/review';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';
import Swal from 'sweetalert2';
import HomeIcon from '@material-ui/icons/Home';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';


const useStyles = theme => ({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    // padding: '0 30px',
  },
  textField: {
    width: 'calc(50% - 50px)',
    padding: '15px 0px 0px 5px'
  },
  textFieldLarge: {
    width: 'calc(100% - 100px)',
    // padding: '15px 0px 0px 5px'
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
  btnRoot: {
    marginLeft: '50em'
    // paddingLeft: 0,
    // paddingRight: 0,
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
            // {
            //   Header: 'Branchs ID',
            //   accessor: 'branch_id',
            //   id: 'branch_id',
            //   filterMethod: (filter, row) =>
            //     row[filter.id].startsWith(filter.value) ||
            //     row[filter.id].endsWith(filter.value),
            // },
            {
              Header: 'Nombre',
              accessor: 'name',
              id: 'name',
              filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value) ||
                row[filter.id].endsWith(filter.value),
            },
            {
              Header: 'Titulo',
              accessor: 'title',
              id: 'title',
              filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value) ||
                row[filter.id].endsWith(filter.value),
            },
            // {
            //   Header: 'Correo',
            //   accessor: 'email',
            //   id: 'email',
            //   filterMethod: (filter, row) =>
            //     row[filter.id].startsWith(filter.value) ||
            //     row[filter.id].endsWith(filter.value),
            // },
            {
              Header: 'Contenido',
              accessor: 'content',
              id: 'content',
              filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value) ||
                row[filter.id].endsWith(filter.value),
            },
            {
              Header: 'Rating Value',
              accessor: 'rating_value',
              id: 'rating_value',
              filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value) ||
                row[filter.id].endsWith(filter.value),
            },
            {
              Header: 'Nombre Gimnasio',
              accessor: 'gym_name',
              id: 'gym_name',
              filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value) ||
                row[filter.id].endsWith(filter.value),
            },
            // {
            //   Header: 'Activado',
            //   accessor: 'active',
            //   id: 'active',
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
                  <a href="#" onClick={(e) => this.handleEdit(e, row.original)}> <VisibilityIcon style={{ fill: "#0A8FDC" }} /> </a>
                  <a href="#" onClick={(e) => this.confirmDelete(e, row.original)}> <DeleteIcon style={{ fill: "#0A8FDC" }} /> </a>
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
            }
          ],
        },
      ],

      data: [],
      open: false,
      row: {},
      id: null,
      branch_id: '',
      name: '',
      email: '',
      rating_value: '',
      title: '',
      content: '',
      gym_name:'',
      active:'',
   
    };
  } 
  confirmActive = (e, row) => {
    e.preventDefault();
    const textAction = row.active == '0' ? 'Activar' : 'Desactivar';
    const textActionSuccess = row.active == '0' ? 'Activado' : 'Desactivado';
    const action = row.active == '0' ? '1' : '0';
    this.setState({ id: row.id });
    Swal.fire({
      title: `Está seguro de que desea ${textAction} este review?`,
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0A8FDC',
      cancelButtonColor: '#F04F47',
      confirmButtonText: `Si, ${textAction}!`,
    }).then((result) => {
      if (result.value) {
        this.activeReview(row.id, action);
        Swal.fire(
          `${textActionSuccess}!`,
          `El comentario ${row.name} fue ${textActionSuccess} correctamente.`,
          'success',
        );
      }
    });
  };
  
  activeReview = async (id, action) => {
    this.setLoading(true);

    console.log('ACTIVE ', id);
    const response = await activeReview(id,action);
    console.log('RESPONSE', response);
    let { data } = this.state;
    let index = data.findIndex((item) => item.id == id);
    data[index].active = action;
    console.log('DATA MODIFIED =? ', data);
    this.setState({ data, id: null });
    this.setLoading(true);
  };


  componentDidMount() {
     this.getReviews();
  }
  handleClickOpen = () => {
    this.setState({
      open: true
    })
  };
  componentDidUpdate(prevProps) {
  
    if (prevProps.openModal !== this.props.openModal) {
      this.handleClickOpen();
      // this.handleDelete2();
    }
  }

  handleClose = () => {
    this.setState({
      open: false,
      isUpdate: false,
      // tags_selected:null
    })
  };
  handleEdit = async (e, row) => {
    e.preventDefault();
    console.log('EDITING ', row);
    this.setState({
      isUpdate: true,
      id: row.id,
      name:row.name,
      email:row.email,
      rating_value:row.rating_value,
      title:row.title,
      content:row.content,
      gym_name:row.gym_name,
      active:row.active,
    });
    this.handleClickOpen();
  }
  handleClickOpen = () => {
    this.setState({
      open: true
    })
  };

  componentDidUpdate(prevProps) {
    if (prevProps.openModal !== this.props.openModal) {
      this.handleClickOpen();
    }
  }
 
  getReviews = async () => {
    this.setState({ loadingTable: true });
    const resp = await getReviews();
    // console.log(resp.tags)
    this.setState({
      data: resp.data,
      // tags: resp.tags,
      loadingTable: false,
    })  
    console.log("OBTENCION EXITOSA")
  };
  
  handleDelete = async (row) => {
    this.setLoading(true);

    console.log('DELETING ', row);
    const { id } = this.state;
    const response = await deleteReview(id);
    const { data } = response;
    this.setState({ data, id: null });
    this.setLoading(true);
  }

  confirmDelete = (e, row) => {
    e.preventDefault();
    this.setState({ id: row.id });
    Swal.fire({
      title: 'Está seguro de que desea eliminar este Review?',
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
          `El Review ${row.title} fue eliminado correctamente.`,
          'success'
        )
      }
    })
  }
  confirmDelete2 = (e) => {
    e.preventDefault();
    // this.setState({ id: id_select });
    this.handleClose();
    Swal.fire({
      title: 'Está seguro de que desea eliminar este Review?',
      text: "No podrá revertir los cambios!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0A8FDC',
      cancelButtonColor: '#F04F47',
      confirmButtonText: 'Si, eliminalo!'
    }).then((result) => {
      if (result.value) {
        this.handleDelete2();
        Swal.fire(
          'Eliminado!',
          `El Review fue eliminado correctamente.`,
          'success'
        )
      }
    })
  }
  handleDelete2 = async () => {
    // e.preventDefault();
    this.setLoading(true);
    const { id } = this.state;
    const response = await deleteReview(id);
    this.handleClose();
    const { data } = response;
    this.setState({ data, id: null });
    this.setLoading(true);
  }

  setLoading = (bool) => {
    this.setState({ loading: bool });
  };


  render() {
    const { data,columns,loadingTable,
      isUpdate, open,name, email, title, rating_value, content, gym_name, active
     } = this.state;
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
          maxWidth={"md"}
        >
          <DialogTitle id="form-dialog-title">Ver Comentario</DialogTitle>
          <DialogContent>
            <DialogContentText>
              En este espacio puedes ver el  review.
          </DialogContentText>
            <div className=''>
            <TextField
            value={gym_name}
            // rows='1'
            // multiline
            rows="5"
            size="medium"
            variant='outlined'
            autoFocus
            margin="dense"
            name="gym_name"
            label="Gimnasio"
            type="text"
            disabled
            className={classes.textFieldLarge}
          // fullWidth
          />
              <TextField
                value={name}
                rows='1'
                variant='outlined'
                autoFocus
                margin="dense"
                name="name"
                label="Nombre"
                type="text"
                disabled
                className={classes.textField}
              />
              <TextField
                value={email}
                // rows='1'
                variant='outlined'
                autoFocus
                margin="dense"
                name="email"
                label="Correo"
                type="text"
                disabled
                className={classes.textField}
              // fullWidth
              />
              <TextField
              value={rating_value}
              // rows='1'
              variant='outlined'
              autoFocus
              margin="dense"
              name="email"
              label="Rating Value"
              type="text"
              disabled
              className={classes.textField}
            // fullWidth
            />
            <TextField
            value={title}
            // rows='1'
            variant='outlined'
            autoFocus
            margin="dense"
            name="email"
            label="Titulo"
            type="text"
            disabled
            className={classes.textField}
          // fullWidth
          />
       {/*   <TextField
          value={active}
          // rows='1'
          variant='outlined'
          autoFocus
          margin="dense"
          name="active"
          label="Activado"
          type="text"
          disabled
          className={classes.textField}
        // fullWidth
       />*/}
        
          <TextField
          value={content}
          // rows='1'
          multiline
          rows="5"
          size="medium"
          variant='outlined'
          autoFocus
          margin="dense"
          name="email"
          label="Contenido del Review"
          type="text"
          disabled
          className={classes.textFieldLarge}
        // fullWidth
        />
       
        
            </div>
          </DialogContent>
          <DialogActions style={{display:'block'}}>
          <div className="p-5">
        <Button label="Eliminar" text="eliminar" color="secondary" className={classes.btnRoot} onClick={(e) => this.confirmDelete2(e)} >
        Eliminar
        </Button>
          </div>
        </DialogActions>

        </Dialog>
      </>
    );
  }
}

export default withStyles(useStyles)(Table);

// export default Table;
