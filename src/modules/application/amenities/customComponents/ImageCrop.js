import ReactDOM from 'react-dom';
import React, { PureComponent } from 'react';
import ReactCrop from 'react-image-crop';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import IconButton from '@material-ui/core/IconButton';
import 'react-image-crop/dist/ReactCrop.css';
import './styles/App.css';
import { withStyles } from '@material-ui/core/styles';
const useStyles = theme => ({
    input: {
        display: 'none',
    },
    button: {
        margin: theme.spacing(1),
    },
});



class CropComponent extends PureComponent {
  state = {
    src: null,
    crop: {
      unit: '%',
      width: 30,
      aspect: 16 / 16,
    },
    imageName: ''
  };

  componentDidUpdate(prevProps) {
    if (prevProps.urlFile !== this.props.urlFile) {
      console.log('IN COMPONENT UPDATE',this.props.urlFile)
      
      // onSelectFile
      //this.setState({src: this.props.urlFile});
    }
  }

  componentDidMount() {
    console.log('IN COMPONENT DID MOUNT',this.props.urlFile)
    this.actualizeFile(this.props.urlFile);
    //this.setState({src: this.props.urlFile});
  }

  actualizeFile = async (urlFile) => {
    // let blob = await fetch(urlFile).then(r => r.blob());
    this.getFileBlob(urlFile, blob =>{
       console.log('BLOB SSSSS ', blob)
        // this.onSelectFile(blob);
      // firebase.storage().ref().put(blob).then(function(snapshot) {
      //    console.log('Uploaded a blob or file!');
      // })
    })
      // this.onSelectFile(blob);
  }

   getFileBlob = function (url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.addEventListener('load', function() {
      cb(xhr.response);
    });
    xhr.send();
  };

  getBlobFromUrl = (myImageUrl) => {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('GET', myImageUrl, true);
        request.responseType = 'blob';
        request.onload = () => {
            resolve(request.response);
        };
        request.onerror = reject;
        request.send();
    })
  }

  onSelectFile = e => {
    console.log('FILE -> SSSS',e.target.files)
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        this.setState({ src: reader.result })
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // If you setState the crop in here you should return false.
  onImageLoaded = image => {
    console.log('IMAGE REFFF',image)
    this.imageRef = image;
  };

  onCropComplete = crop => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop, percentCrop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop }); let blob = await fetch(url).then(r => r.blob());
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    console.log('CROP IMAGE IN MAKECLIENT CROP',crop)
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        'newFile.jpeg'
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error('Canvas is empty');
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);

        const { changeFile } = this.props;
        
        changeFile(blob);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, 'image/jpeg');
    });
  }

  render() {
    const { crop, croppedImageUrl, src } = this.state;
    const { classes } = this.props;
    return (
      <div className="App">
        <div>
            <input
                accept='image/*'
                className={classes.input}
                id='icon-button-file'
                type='file'
                onChange={this.onSelectFile}
            />
            <label htmlFor='icon-button-file'>
                <IconButton
                color='primary'
                className={classes.button}
                aria-label='upload picture'
                component='span'>
                <PhotoCamera />
                </IconButton>
            </label>
        </div>
        {src && (
          <ReactCrop
            src={src}
            crop={crop}
            ruleOfThirds
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
          />
        )}
        {croppedImageUrl && (
          <img alt="Crop" style={{ maxWidth: '100%' }} src={croppedImageUrl} />
        )}
      </div>
    );
  }
}
export default withStyles(useStyles)(CropComponent);