import React, {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

// import 'react-image-crop/lib/ReactCrop.scss';
//import {useSelector} from 'react-redux';
//import matchSorter from 'match-sorter';
import CircularIntegration from '../customComponents/InteractiveIntegration';
import {
  getGalleryGymBranch,
  saveGalleryGymBranch,
} from '../../../../@crema/services/applicationServices/gymBranch';
import {storage} from '../../../../@crema/firebase/firebase';
import {withStyles} from '@material-ui/core/styles';
import Swal from 'sweetalert2';
// import MultiImageInput from 'react-multiple-image-input';
import ImgCrop from 'antd-img-crop';
import {Upload} from 'antd';
import 'antd/dist/antd.css';

import 'react-dropzone-uploader/dist/styles.css';
import Dropzone from 'react-dropzone-uploader';

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

class Gallery extends React.Component {
  constructor(props) {
    super(props);
    // this.actionButton = React.createRef();
    this.state = {
      loading: false,
      loadingTable: false,
      data: [],
      open: false,
      id: null,
      errorFields: '',
      selected: '',
      images: [],
      imagesDb: [],
    };
  }

  componentDidMount() {
    this.getBranchGallery();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.openModal !== this.props.openModal) {
      this.handleClickOpen();
    }
  }

  getBranchGallery = async () => {
    this.setState({loadingTable: true});
    const {user} = this.props;
    if (!user.branch_id) {
      return;
    }
    const {branch_id} = user;
    const resp = await getGalleryGymBranch(branch_id);
    const {data} = resp;
    const tempArr = [];
    console.log('RESP => ', data);
    data.map((d) => {
      tempArr.push({
        uid: d.id,
        id: d.id,
        url: d.url,
      });
    });
    console.log('TEMP ARRR', tempArr);
    this.setState({images: tempArr});
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

  onChangeFile = (image) => {
    this.setState({image});
  };

  handleUpload = async () => {
    this.setState({errorFields: ''});
    const {images} = this.state;

    const uploadedFiles = await Promise.all(
      images.map(async (image) => {
        const {originFileObj} = image;

        if (!originFileObj) {
          return image;
        }

        let random = Math.random().toString(36).substr(2, 9);
        let fileName = `${random}_${originFileObj.name}`;
        originFileObj.name = fileName;
        const uploadTask = storage
          .ref(`images/${originFileObj.name}`)
          .put(originFileObj);
        const url = await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            () => {},
            (error) => reject(error),
            async () => {
              const downloadUrl = await uploadTask.snapshot.ref.getDownloadURL();
              resolve(downloadUrl);
            },
          );
        });

        return {name: originFileObj.name, url};
      }),
    );

    console.log('UPLOATED FILES => ', uploadedFiles);
    const arrObjectFiles = await Promise.all(
      uploadedFiles.map(async (file) => {
        return await this.addToDb(file, 0);
      }),
    );

    const {imagesDb} = this.state;
    arrObjectFiles.map((d) => {
      imagesDb.push(d);
    });

    this.send(imagesDb);
  };

  addToDb = async (image, removed) => {
    const id = image.uid ? image.uid : null;
    const url = image.url ? image.url : image;
    const action = image.uid ? 0 : 1;
    return {id, url, action, removed};
  };

  send = async (imagesDb) => {
    this.setLoading(true);

    const {
      user: {branch_id},
    } = this.props;
    const objectSend = {
      branch_id,
      imagesDb,
    };

    const response = await saveGalleryGymBranch(objectSend);
    const {data} = response;
    console.log('RESPONSE IN UPDATE GGGGG', response.data);
    const tempArr = [];
    data.map((d) => {
      tempArr.push({
        uid: d.id,
        id: d.id,
        url: d.url,
      });
    });

    this.onChange({fileList: tempArr});
    this.setState({imagesDb: []});

    this.setLoading(false);
  };

  setLoading = (bool) => {
    this.setState({loading: bool});
  };

  onChange = ({fileList: newFileList}) => {
    console.log('IMAGE LIST ', newFileList);
    this.setState({images: newFileList});
  };

  onRemove = async (rowDeleted) => {
    console.log(rowDeleted);
    if (rowDeleted.id) {
      const toDelete = await this.addToDb(rowDeleted, 1);
      const {imagesDb} = this.state;
      imagesDb.push(toDelete);
      this.setState({imagesDb});
    }
  };

  onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  render() {
    const {errorFields, loading, images} = this.state;
    const {classes} = this.props;

    return (
      <>
        <div className=''>
          <ImgCrop grid>
            <Upload
              action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
              listType='picture-card'
              fileList={images}
              onChange={this.onChange}
              onPreview={this.onPreview}
              onRemove={this.onRemove}>
              {images.length < 7 && '+ Seleccionar'}
            </Upload>
          </ImgCrop>

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
          {/* <CropComponent changeFile={this.onChangeFile} urlFile={imageUrl} /> */}
          {/* </div> */}
        </div>
      </>
    );
  }
}

export default withStyles(useStyles)(Gallery);
// export default Gallery;
