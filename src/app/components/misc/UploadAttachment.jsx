import React from 'react';
import PropTypes from 'prop-types';
import { Upload, Button, Icon, Spin } from 'antd';
import { uploadAttachments } from '../../apis/general-api';

export default class UploadAttachment extends React.Component {
  static propTypes = {
    uploadType: PropTypes.string.isRequired,
    onRemove: PropTypes.func,
    afterUpload: PropTypes.func,
    multiple: PropTypes.bool,
  };

  static defaultProps = {
    multiple: false,
    afterUpload: () => {},
    onRemove: () => {},
  }

  state = {
    fileList: [],
    uploading: false,
  }

  onChange = (info) => {
    if (info.file.status !== 'uploading' && info.file.status !== 'removed') {
      this.handleUpload(info.file);
    }
  }

  handleUpload = (file) => {
    this.setState({
      uploading: true,
    });

    const { uploadType, afterUpload } = this.props;
    uploadAttachments({ file, type: uploadType })
      .then((res) => {
        this.setState({
          uploading: false,
        });

        afterUpload({ ...res, uid: file.uid });
      })
      .catch((error) => {
        this.setState({
          uploading: false,
        });

        afterUpload({ err: true, error });
      });
  }

  render() {
    const { uploading } = this.state;
    const { onRemove, multiple } = this.props;

    const props = {
      onRemove: (file) => {
        onRemove(file);
        const { uid } = file;
        const { fileList } = this.state;
        const filePos = fileList.findIndex(f => f.uid === uid);
        if (filePos > -1) {
          const newFileList = [...fileList.slice(0, filePos), ...fileList.slice(filePos + 1)];
          this.setState({
            fileList: newFileList,
          });
        }
      },
      beforeUpload: (file) => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }));
        return false;
      },
      onChange: this.onChange,
      fileList: this.state.fileList,
    };

    return (
      <div>
        <Upload {...props} multiple={multiple}>
          <Button>
            <Icon type="upload" /> Select File
          </Button>
        </Upload>
        {
          uploading && (<Spin indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} />)
        }
      </div>
    );
  }
}
