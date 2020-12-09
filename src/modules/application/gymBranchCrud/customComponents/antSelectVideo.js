import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import { Upload, Button, Icon } from "antd";
import { DownloadOutlined, UploadOutlined, VideoCameraTwoTone } from '@ant-design/icons';
import PropTypes from 'prop-types';


class antSelectVideo extends React.Component {
  state = {
    fileList: [],
    selectedAttachment: null,
    image: '',
    imageUrl: '',
    isImage:'',
  };
  componentWillReceiveProps(newProps) {
    // console.log('Component WILL RECIEVE PROPS!', newProps)
    if (newProps.imageUrl !== this.state.imageUrl) {
      this.setState({imageUrl: newProps.imageUrl});
      this.setState({isImage: newProps.is_image})
      console.log('is_active desde bdd',newProps.is_image)
      
    }
  }

  viewAttachment = file => {
    let reader = new FileReader();

    //if reading completed
    reader.onload = e => {
      //set values of selected attachment
      let newSelectedAttachment = {};
      newSelectedAttachment.file = file;
      newSelectedAttachment.blobData = e.target.result;
      console.log(newSelectedAttachment);

      //if file type is image then show the attachment or download the same
      if (file.type.includes("video")) {
        this.setState({
          selectedAttachment: newSelectedAttachment
        });
         this.handleImage(file, this.state.selectedAttachment.blobData)
         

      }
    };

    //read the file
    reader.readAsDataURL(file);
    // console.log(file)
  };
  handleImage = (img, imageUrl) => {
    console.log('IN CALLBACK IMAGE => ', img, imageUrl);
    this.setState({
      image: img,
      imageUrl: imageUrl,
      isImage:0,

    });
    const {name, blobName, is_image} = this.props;
    this.props.changeImage(imageUrl, img, name, blobName, is_image);
  };
  render = () => {
    const { imageUrl } = this.state;
    const {isImage}=this.state
    const {handleIsVideo}=this.props;
    return (
        
      <React.Fragment>
        <Upload
          multiple={false}
          beforeUpload={e => false}
          showUploadList={false}
          onChange={info => {
            if (info.file.status !== "uploading") {
              let newFileList = this.state.fileList;
              newFileList.push(info.file);
              this.setState({
                fileList: newFileList
              });
            }
            // console.log(this.state.fileList)
          }}
        >
          {/*<Button>
         
          Upload
          </Button>*/}
        { /*  <h1>esta activo: {isImage}</h1>*/}
          <Button type="primary" icon={<UploadOutlined />} onClick={handleIsVideo} size="large">
          Subir Video
        </Button>
        </Upload>
        {this.state.fileList.length > 0 && (
          <ul>
            {this.state.fileList.map((file, index) => {
              return (
                <li
                onChange={this.handleImage}
                  onClick={() => this.viewAttachment(file)}
                  style={{ cursor: "pointer" }}
                  key={index}
                >
                <Button type="dashed" icon={<VideoCameraTwoTone />}  onClick={handleIsVideo}  size="large" >
                Cargar y previsualizar: {file.name}
              </Button>
                </li>

              );
            })}
          </ul>
        )}
        
        {this.state.selectedAttachment && (
          
            <video width="400" controls>
            <source
              src={this.state.selectedAttachment.blobData}
              type={this.state.selectedAttachment.file.type}
            />
            Your browser does not support HTML5 video.
          </video>
        )}
      </React.Fragment>
    );
  };
}
antSelectVideo.propTypes ={
  handleIsVideo:PropTypes.func.isRequired
}
export default antSelectVideo;