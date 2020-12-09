import React from 'react';
import ImgCrop from 'antd-img-crop';
import {Upload, message} from 'antd';
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import 'antd/dist/antd.css';

class AntImageCrop extends React.Component {
  constructor(props) {
    super(props);
    // this.actionButton = React.createRef();
    this.state = {
      loading: false,
      loadingImage: false,
      image: '',
      imageUrl: '',
    };
  }

  componentWillReceiveProps(newProps) {
    // console.log('Component WILL RECIEVE PROPS!', newProps)
    if (newProps.imageUrl !== this.state.imageUrl) {
      this.setState({imageUrl: newProps.imageUrl});
    }
  }

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Puedes seleccionar solo archivos JPG/PNG!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Tu imagen no debe pasar de 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({loadingImage: true});
      return;
    }
    if (info.file.status === 'done') {
      this.getBase64(info.file.originFileObj, (imageUrlCroped) =>
        this.handleImage(info.file.originFileObj, imageUrlCroped),
      );
    }
  };

  handleImage = (img, cropped) => {
    console.log('IN CALLBACK IMAGE => ', img, cropped);
    this.setState({
      image: img,
      imageUrl: cropped,
      loadingImage: false,
    });

    const {name, blobName} = this.props;
    this.props.changeImage(cropped, img, name, blobName);
  };

  render() {
    const {loadingImage, image, imageUrl} = this.state;
    const {classes} = this.props;
    // console.log('IMAGE IN RENDER ', imageUrl);
    return (
      <>
        <ImgCrop grid>
          <Upload
            name='avatar'
            listType='picture-card'
            className='avatar-uploader'
            showUploadList={false}
            action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
            beforeUpload={this.beforeUpload}
            onChange={this.handleChange}>
            {imageUrl ? (
              <img src={imageUrl} alt='avatar' style={{width: '100%'}} />
            ) : (
              <div>
                {loadingImage ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{marginTop: 8}}>Seleccionar</div>
              </div>
            )}
          </Upload>
        </ImgCrop>
      </>
    );
  }
}

export default AntImageCrop;
