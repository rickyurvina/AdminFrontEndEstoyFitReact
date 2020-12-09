import React from 'react';

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
import { getBlogs, saveBlog, deleteBlog, activeBlog } from '../../../../@crema/services/applicationServices/blog';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';
import Swal from 'sweetalert2';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import parse from 'html-react-parser';
import { storage } from '../../../../@crema/firebase/firebase';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import BlockIcon from '@material-ui/icons/Block';
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
    padding: '0 30px',
  },
  textField: {
    width: 'calc(50% - 50px)',
    padding: '15px 0px 0px 5px'
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
              Header: 'Titulo',
              accessor: 'title',
              id: 'title',
              filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value) ||
                row[filter.id].endsWith(filter.value),
            },
            {
              Header: 'Breve Descripccion',
              accessor: 'description_blog',
              id: 'description_blog',
              filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value) ||
                row[filter.id].endsWith(filter.value),
            },      
            {
              Header: 'Categoria',
              accessor: 'category',
              id: 'category',
              filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value) ||
                row[filter.id].endsWith(filter.value),
            },
            // {
            //   Header: 'Activo',
            //   accessor: 'is_active',
            //   id: 'is_active',
            //   Cell: (row) =>
            //     row.row.is_active == '1' ? (
            //       <DoneOutlineIcon style={{ fill: '#008F39' }} />
            //     ) : (
            //         <BlockIcon style={{ fill: '#CB3234' }} />
            //       ),
            //   filterMethod: (filter, row) =>
            //     row[filter.id].startsWith(filter.value) ||
            //     row[filter.id].endsWith(filter.value),
            // },
            // {
            //   Header: 'Tags',
            //   accessor: 'tags_selected',
            //   id: 'tags_selected',
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
                  <a href="#" onClick={(e) => this.handleEdit(e, row.original)}> <EditIcon style={{ fill: "#0A8FDC" }} /> </a>
                  <a href="#" onClick={(e) => this.confirmDelete(e, row.original)}> <DeleteIcon style={{ fill: "#0A8FDC" }} /> </a>
                  <a
                  href='#'
                  onClick={(e) => this.confirmActive(e, row.original)}>
                  {' '}
                  {row.original.is_active == '1' && (
                    <HomeIcon style={{ fill: '#1CA93A' }} />
                  )}
                  {row.original.is_active == '0' && (
                    <HomeOutlinedIcon style={{ fill: '#F04F47' }} />
                  )},
                </a>
                  </div>
              ),
              filterMethod: (filter, row) => {
                console.log(
                  'FILTER ID => ',
                  filter,
                  row._original,
                  row._original['is_active'],
                );
                if (filter.value == 'all') {
                  return true;
                }
                if (filter.value == '0') {
                  return row._original['is_active'] == '0';
                }
                return row._original['is_active'] == '1';
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
      title: '',
      description_blog: '',
      content: '',
      category: '',
      is_active: '',
      image: '',
      imageUrl: '',
      errorFields: '',
      tags: [],
      tagsSelected: [],
      tags_selected:[],
      active:''
    };
  } 
  confirmActive = (e, row) => {
    e.preventDefault();
    const textAction = row.is_active == '0' ? 'Activar' : 'Desactivar';
    const textActionSuccess = row.is_active == '0' ? 'Activado' : 'Desactivado';
    const action = row.is_active == '0' ? '1' : '0';
    this.setState({ id: row.id });
    Swal.fire({
      title: `Está seguro de que desea ${textAction} este blog?`,
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0A8FDC',
      cancelButtonColor: '#F04F47',
      confirmButtonText: `Si, ${textAction}!`,
    }).then((result) => {
      if (result.value) {
        this.activeBlog(row.id, action);
        Swal.fire(
          `${textActionSuccess}!`,
          `El pase ${row.title} fue ${textActionSuccess} correctamente.`,
          'success',
        );
      }
    });
  };
  activeBlog = async (id, action) => {
    this.setLoading(true);

    console.log('ACTIVE ', id);
    const response = await activeBlog(id,action);
    console.log('RESPONSE', response);
    let { data } = this.state;
    let index = data.findIndex((item) => item.id == id);
    data[index].is_active = action;
    console.log('DATA MODIFIED =? ', data);
    this.setState({ data, id: null });
    this.setLoading(true);
  };

  componentDidMount() {
     this.getBlogs();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.openModal !== this.props.openModal) {
      this.handleClickOpen();
    }
  }
 
  getBlogs = async () => {
    this.setState({ loadingTable: true });
    const resp = await getBlogs();
    // console.log(resp.tags)
    this.setState({
      data: resp.data,
      tags: resp.tags,
      loadingTable: false,
    })  
    console.log("OBTENCION EXITOSA")
  };


  handleChangeField = (event) => {
    const { target: { name, value } } = event
    this.setState({ [name]: value })
  }

  handleChangeTags = (event) => {
    let {
      target: { name, value },
    } = event;
    console.log('SELECTED =? ', value)
    this.setState({ tagsSelected: value });
  };

  handleChangeCheck = (event) => {
    const active = event.target.checked ? 1 : 0;
    this.setState({ active });
  };

  handleEdit = async (e, row) => {
    e.preventDefault();
    console.log('EDITING ', row);
    this.setState({
      isUpdate: true,
      id: row.id,
      title: row.title,
      description_blog: row.description_blog,
      content: row.content,
      category: row.category,
      is_active: row.is_active,
      imageUrl: row.main_image,
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
      title: '',
      description_blog: '',
      content: '',
      category: '',
      is_active: '',
      image: '',
      imageUrl: '',
      // tags_selected:null
    })
  };

  handleDelete = async (row) => {
    this.setLoading(true);

    console.log('DELETING ', row);
    const { id } = this.state;
    const response = await deleteBlog(id);
    const { data } = response;

    this.setState({ data, id: null });
    this.setLoading(true);
  }

  confirmDelete = (e, row) => {
    e.preventDefault();
    this.setState({ id: row.id });
    Swal.fire({
      title: 'Está seguro de que desea eliminar este blog?',
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
          `El blog ${row.title} fue eliminado correctamente.`,
          'success'
        )
      }
    })
  }


  onChangeFile = image => {
    console.log('CROP -> ', image);
    this.setState({ image });
  };

  validateFields = async () => {
    console.log('validating ');
    const { title, description_blog, content, category, is_active } = this.state;
    if ((title == '') || (description_blog == '') || (content == '') || (category == '') || (is_active == '')) {
    

      return false;
    } else {
      return true;
    }
  }

  //handle to upload image
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

  send = async (urlFile) => {
    this.setLoading(true);

    const { id, title, description_blog,
      content, category, is_active, tagsSelected } = this.state;
    const objectSend = { id, title, description_blog, content, category, is_active, urlFile, tagsSelected };
    const response = await saveBlog(objectSend);
    const { data } = response;
    console.log('RESPONSE IN UPDATE ggg', response.data);
    this.setState({ data, id: null, open: false });

    this.setLoading(false);
  }

  setLoading = (bool) => {
    this.setState({ loading: bool });
  };


  render() {
    const { data, errorFields, columns, open, loadingTable,
      loading, title, description_blog, isUpdate,
      content, category, is_active, imageUrl, tagsSelected, tags } = this.state;
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
          <DialogTitle id="form-dialog-title">Editar</DialogTitle>
          <DialogContent>
            <DialogContentText>
              En este espacio puedes editar o crear un Blog.
          </DialogContentText>
            <div className=''>
              <TextField
                value={title}
                rows='1'
                variant='outlined'
                autoFocus
            
                margin="dense"
                name="title"
                label="Titulo"
                type="text"
                onChange={this.handleChangeField}
                className={classes.textFieldLarge}
              />
              <TextField
                value={description_blog}
                // rows='1'
                variant='outlined'
                autoFocus
              
                margin="dense"
                name="description_blog"
                multiline
                rows={2}
                rowsMax={4}
                placeholder="Agrega una breve descripción del Blog"
                label="Descripción"
                type="text"
                onChange={this.handleChangeField}
                className={classes.textFieldLarge}
              // fullWidth
              />

              <InputLabel htmlFor='age-helper' className={classes.textField}>
                Contenido del Blog
              </InputLabel>

              <FormControl
                className={classes.textFieldLarge}
                variant='outlined'
                autoFocus
               
                margin='none'>
                <CKEditor
                  editor={ClassicEditor}
                  data={this.state.content}
                  value={parse(content)}
                  config={{
                    toolbar: ['heading', '|', 'bold', 'italic', 'blockQuote', 'link', 'numberedList', 'bulletedList', 'insertTable',
                      'tableColumn', 'tableRow', '|', 'undo', 'redo']
                  }}

                  onChange={(event, editor) => {
                    const data = editor.getData()
                    this.setState({ content: data })
                  }
                  }
                />
              </FormControl>

              <FormControl
                className={classes.textField}
               
                variant='outlined'
                autoFocus
                margin='dense'>
                <InputLabel htmlFor='age-helper'>Categoría</InputLabel>
                <Select
                  value={category}
                  onChange={this.handleChangeField}
                  inputProps={{
                    name: 'category',
                    id: 'category',
                  }}>
                  <MenuItem value="Fitness">Fitness</MenuItem>
                  <MenuItem value="Nutrición">Nutrición</MenuItem>
                  <MenuItem value="Generales">Generales</MenuItem>
                  <MenuItem value="Salud">Salud</MenuItem>

                </Select>
              </FormControl>
              <FormControl
               
                className={classes.textField}
                variant='outlined'
                autoFocus
                margin='dense'>
                <InputLabel htmlFor='age-helper'>Activar Blog</InputLabel>
                <Select
                  value={is_active}
                  onChange={this.handleChangeField}
                  inputProps={{
                    name: 'is_active',
                    id: 'is_active',
                  }}>
                  <MenuItem value={1}>Activado</MenuItem>
                  <MenuItem value={0}>Desactivado</MenuItem>
                </Select>
              </FormControl>
              <FormControl
                className={classes.textField}
                variant='outlined'
                autoFocus
                margin='dense'>
                <InputLabel htmlFor='age-helper'>Tags</InputLabel>
                <Select
                   className={classes.textField}
                  multiple
                  value={tagsSelected}
                  onChange={this.handleChangeTags}
                  inputProps={{
                    name: 'tagsSelected',
                    id: 'tagsSelected',
                  }}>
                  {tags.map(v => {
                    return <MenuItem value={v.id}>{v.name}</MenuItem>;
                  })}
                </Select>
                {/* <FormHelperText>Some important helper text</FormHelperText>  */}
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
