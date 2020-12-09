import React from 'react';
import { Upload, message, Button } from 'antd';
import EditIcon from '@material-ui/icons/Edit';
import HomeIcon from '@material-ui/icons/Home';
import 'antd/dist/antd.css';
import { DownloadOutlined, UploadOutlined, VideoCameraTwoTone } from '@ant-design/icons';
import PropTypes from 'prop-types';
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

class AntSelectImage extends React.Component {
  state = {
    loading: false,
    loadingImage: false,
    image: '',
    imageUrl: '',
  };


  componentWillReceiveProps(newProps) {
    // console.log('Component WILL RECIEVE PROPS!', newProps)
    if (newProps.imageUrl !== this.state.imageUrl) {
      this.setState({imageUrl: newProps.imageUrl});
    }
  }


  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.handleImage(info.file.originFileObj, imageUrl),
      );
    }
  };

  handleImage = (img, imageUrl) => {
    console.log('IN CALLBACK IMAGE => ', img, imageUrl);
    this.setState({
      image: img,
      imageUrl: imageUrl,
      loadingImage: false,
    });

    const {name, blobName} = this.props;
    this.props.changeImage(imageUrl, img, name, blobName);
  };

  render() {
    const {handleIsImage}=this.props;
    const icon = (this.state.loading) ? <EditIcon /> : <HomeIcon /> ;
    const uploadButton = (
      <div>
        {/* <Icon type={this.state.loading ? 'loading' : 'plus'} /> */}
        {/* {icon} */}
        <div className="ant-upload-text">Seleccionar</div>
      </div>
    );
    const { imageUrl } = this.state;
    return (
      <Upload
        name="avatar"
        // listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        // beforeUpload={beforeUpload}
        onChange={this.handleChange}
       
      >
      {imageUrl ? <img src={imageUrl} alt="" style={{ width: '100%' }} /> : this.uploadButton}
      
    <Button type="primary" icon={<UploadOutlined />}  onClick={handleIsImage} size="large">
    Subir Foto
  </Button>
      </Upload>
    );
  }
}

AntSelectImage.propTypes ={
  handleIsImage:PropTypes.func.isRequired
}

export default AntSelectImage;
