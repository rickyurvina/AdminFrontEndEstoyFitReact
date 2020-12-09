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

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [buffered, setBuffered] = useState([]);
  // specify upload params and url for your files
  const getUploadParams = async ({meta}) => {
    return {url: 'https://httpbin.org/post'};
  };

  const authUser = useSelector(({auth}) => auth.user);
  const branchId = authUser.branch_id;

  useEffect(() => {
    async function fetchData() {
      const resp = await getGalleryGymBranch(branchId);
      const {data} = resp;
      setImages(data);
      console.log('RESPONSE GALLERY', data);

      let headers = new Headers();

      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      // headers.append('Authorization', 'Basic ' + base64.encode(username + ":" +  password));
      headers.append('Origin', 'http://localhost:3000');

      const uploadedFiles = await Promise.all(
        data.map(async (i, k) => {
          let pushed = '';
          let fileName = i.url;
          // console.log('DATAXXX', i.url);
          const fetched = await fetch(fileName, {
            mode: 'cors',
            // credentials: 'include',
            method: 'POST',
            headers: headers,
          }).then(async (res) => {
            const url = await new Promise(async (resolve, reject) => {
              res.arrayBuffer().then((buf) => {
                console.log(buf);
                i.name = 'fileAb';
                pushed = new File([buf], 'Fm258rah2r_chinagym.jpg', {
                  type: 'image/jpge',
                });

                resolve(pushed);
              });
              // let datas = await res.blob();

              // let metadata = {
              //   type: 'image/jpeg',
              // };
              // let random = Math.random().toString(36).substr(2, 9);
              // //https://firebasestorage.googleapis.com/v0/b/proconty-gym.appspot.com/o/images%2Fm258rah2r_chinagym.jpg?alt=media&token=c0e15f40-dff9-418f-bf29-d21d53e36361
              // let fileName = `Fm258rah2r_chinagym.jpg`;
              // let file = new File([datas], fileName, metadata);
              // console.log('URL ',res.url)

              // resolve(file);
            });

            console.log('RESPPSSSSS', url);
            return {url};
          });

          return fetched;
        }),
      );

      console.log('SSSS ', uploadedFiles);
      let temp = [];
      uploadedFiles.map((file) => {
        temp.push(file.url);
      });

      console.log('TEMPSSSS ', temp);

      setBuffered(temp);
    }
    fetchData();
  }, [branchId]);

  const arrayBufferToBase64 = (buffer) => {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  // called every time a file's `status` changes
  const handleChangeStatus = ({meta, file}, status) => {
    // console.log(status, meta, file)
    if (status == 'done') {
      //console.log('DONE ', file);
      //setImages([...images, {file}]);
      //console.log('IMAGES ', images);
    }
  };

  // receives array of files that are done uploading when submit button is clicked
  const handleSubmit = (files, allFiles) => {
    console.log(files.map((f) => f.meta));
    console.log('SEND ', images);
    handleUpload();

    // allFiles.forEach(f => f.remove())
  };

  const handleUpload = async () => {
    // const {images} = this.state;

    const uploadedFiles = await Promise.all(
      images.map(async (image) => {
        const {file} = image;
        if (!file) {
          return image;
        }

        console.log('IMAGE -> ', file.name);

        let random = Math.random().toString(36).substr(2, 9);
        let fileName = `${random}_${file.name}`;
        // Object.assign(file, {name:fileName});
        Object.assign({}, file, {name: fileName});
        const uploadTask = storage.ref(`images/${file.name}`).put(file);
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

        return {name: file.name, url};
      }),
    );

    console.log('UPLOATED FILES => ', uploadedFiles);
    const arrObjectFiles = await Promise.all(
      uploadedFiles.map(async (file) => {
        return await addToDb(file, 0);
      }),
    );

    console.log('ARR OBJECT FILES => ', arrObjectFiles);

    // const {imagesDb} = this.state;
    // arrObjectFiles.map((d) => {
    //   imagesDb.push(d);
    // });

    // this.send(imagesDb);
  };

  const addToDb = async (image, removed) => {
    const id = image.uid ? image.uid : null;
    const url = image.url ? image.url : image;
    const action = image.uid ? 0 : 1;
    return {id, url, action, removed};
  };

  const onDrop = (droped) => {
    console.log('DROP', droped);
  };

  return (
    <Dropzone
      initialFiles={buffered}
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      accept='image/*,audio/*,video/*'
      styles={{dropzone: {minHeight: 500, maxHeight: 550}}}
      // multiple
      // onDrop={onDrop}
    />
  );
};

// class Gallery extends React.Component {
//   constructor(props) {
//     super(props);
//     // this.actionButton = React.createRef();
//     this.state = {
//       loading: false,
//       loadingTable: false,
//       data: [],
//       open: false,
//       id: null,
//       errorFields: '',
//       selected: '',
//       images: [],
//       imagesDb: [],
//     };
//   }

//   componentDidMount() {
//     this.getBranchGallery();
//   }

//   componentDidUpdate(prevProps) {
//     if (prevProps.openModal !== this.props.openModal) {
//       this.handleClickOpen();
//     }
//   }

//   getBranchGallery = async () => {
//     this.setState({loadingTable: true});
//     const {user} = this.props;
//     if (!user.branch_id) {
//       return;
//     }
//     const {branch_id} = user;
//     const resp = await getGalleryGymBranch(branch_id);
//     const {data} = resp;
//     const tempArr = [];
//     console.log('RESP => ', data);
//     data.map((d) => {
//       tempArr.push({
//         uid: d.id,
//         id: d.id,
//         url: d.url,
//       });
//     });
//     console.log('TEMP ARRR', tempArr);
//     this.setState({images: tempArr});
//   };

//   handleChangeField = (event) => {
//     const {
//       target: {name, value},
//     } = event;
//     this.setState({[name]: value});
//   };

//   handleChangeCheck = (event) => {
//     const active = event.target.checked ? 1 : 0;
//     this.setState({active});
//   };

//   onChangeFile = (image) => {
//     this.setState({image});
//   };

//   handleUpload = async () => {
//     this.setState({errorFields: ''});
//     const {images} = this.state;

//     const uploadedFiles = await Promise.all(
//       images.map(async (image) => {
//         const {originFileObj} = image;

//         if (!originFileObj) {
//           return image;
//         }

//         let random = Math.random().toString(36).substr(2, 9);
//         let fileName = `${random}_${originFileObj.name}`;
//         originFileObj.name = fileName;
//         const uploadTask = storage
//           .ref(`images/${originFileObj.name}`)
//           .put(originFileObj);
//         const url = await new Promise((resolve, reject) => {
//           uploadTask.on(
//             'state_changed',
//             () => {},
//             (error) => reject(error),
//             async () => {
//               const downloadUrl = await uploadTask.snapshot.ref.getDownloadURL();
//               resolve(downloadUrl);
//             },
//           );
//         });

//         return {name: originFileObj.name, url};
//       }),
//     );

//     console.log('UPLOATED FILES => ', uploadedFiles);
//     const arrObjectFiles = await Promise.all(
//       uploadedFiles.map(async (file) => {
//         return await this.addToDb(file, 0);
//       }),
//     );

//     const {imagesDb} = this.state;
//     arrObjectFiles.map((d) => {
//       imagesDb.push(d);
//     });

//     this.send(imagesDb);
//   };

//   addToDb = async (image, removed) => {
//     const id = image.uid ? image.uid : null;
//     const url = image.url ? image.url : image;
//     const action = image.uid ? 0 : 1;
//     return {id, url, action, removed};
//   };

//   send = async (imagesDb) => {
//     this.setLoading(true);

//     const {
//       user: {branch_id},
//     } = this.props;
//     const objectSend = {
//       branch_id,
//       imagesDb,
//     };

//     const response = await saveGalleryGymBranch(objectSend);
//     const {data} = response;
//     console.log('RESPONSE IN UPDATE GGGGG', response.data);
//     const tempArr = [];
//     data.map((d) => {
//       tempArr.push({
//         uid: d.id,
//         id: d.id,
//         url: d.url,
//       });
//     });

//     this.onChange({fileList: tempArr});
//     this.setState({imagesDb: []});

//     this.setLoading(false);
//   };

//   setLoading = (bool) => {
//     this.setState({loading: bool});
//   };

//   onChange = ({fileList: newFileList}) => {
//     console.log('IMAGE LIST ', newFileList);
//     this.setState({images: newFileList});
//   };

//   onRemove = async (rowDeleted) => {
//     console.log(rowDeleted);
//     if (rowDeleted.id) {
//       const toDelete = await this.addToDb(rowDeleted, 1);
//       const {imagesDb} = this.state;
//       imagesDb.push(toDelete);
//       this.setState({imagesDb});
//     }
//   };

//   onPreview = async (file) => {
//     let src = file.url;
//     if (!src) {
//       src = await new Promise((resolve) => {
//         const reader = new FileReader();
//         reader.readAsDataURL(file.originFileObj);
//         reader.onload = () => resolve(reader.result);
//       });
//     }
//     const image = new Image();
//     image.src = src;
//     const imgWindow = window.open(src);
//     imgWindow.document.write(image.outerHTML);
//   };

//   render() {
//     const {errorFields, loading, images} = this.state;
//     const {classes} = this.props;

//     return (
//       <>
//         <div className=''>
//           {/* <ImgCrop grid>
//             <Upload
//               action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
//               listType='picture-card'
//               fileList={images}
//               onChange={this.onChange}
//               onPreview={this.onPreview}
//               onRemove={this.onRemove}>
//               {images.length < 7 && '+ Seleccionar'}
//             </Upload>
//           </ImgCrop>  */}

//           <div>
//             {' '}
//             <div className='p-5'>
//               <CircularIntegration
//                 executeFunction={this.handleUpload}
//                 loadingButton={loading}
//               />
//             </div>
//             <span style={{color: 'red'}}>{errorFields}</span>{' '}
//           </div>
//           {/* <div className={classes.iconSize}> */}
//           {/* <CropComponent changeFile={this.onChangeFile} urlFile={imageUrl} /> */}
//           {/* </div> */}
//         </div>
//       </>
//     );
//   }
// }

export default withStyles(useStyles)(Gallery);
// export default Gallery;
