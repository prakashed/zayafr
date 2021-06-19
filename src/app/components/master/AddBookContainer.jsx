import React from 'react';
import PropTypes from 'prop-types';
import cookie from 'js-cookie';
import { Upload, Icon, Row, Col, message } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getBooksAction } from '../../reducers/books';
import routes from '../../constants/routes.json';

const { Dragger } = Upload;

function AddBookContainer({ getBooks, history }) {
  const token = cookie.get('token');
  const schoolId = localStorage.getItem('school');

  const draggerProps = {
    name: 'book',
    multiple: false,
    accept: '.csv, .xls, .xlsx',
    action: `${process.env.SERVER_URL}/book-upload/`,
    headers: {
      Authorization: `Token ${token}`,
      School: `${schoolId}`,
    },
    onChange: (info) => {
      const { status } = info.file;
      // if (status !== 'uploading') {
      //   console.log(info.file, info.fileList);
      // }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
        getBooks();
        const { response } = info.file;
        const { bookId } = response;
        if (bookId) {
          history.push(`${routes.books}/${bookId}`);
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <Row>
      <Col>
        <div className="import-books-view">
          <h1>Upload a new book</h1>
          <p>
            The books need to be uploaded in a specific format. <br />
            You can download the following example template and get started.
          </p>
          <p>
            <a target="_blank" rel="noopener noreferrer" href="https://docs.google.com/spreadsheets/d/1j8kgvCLCiAGaG2EQnk6ylfmiKFN0-R5IrZKu8Ikftx8/edit#gid=2123480294">Book with Tags (Keyboard, Piano)</a>
          </p>
          <p>
            <a target="_blank" rel="noopener noreferrer" href="https://docs.google.com/spreadsheets/d/1bZz6EGs5VEOhdENrvoDnnW31zWrWqhof0gRj0tJHx48/edit">Book with Activities (Quaver)</a>
          </p>
          <p>
            <a target="_blank" rel="noopener noreferrer" href="https://docs.google.com/spreadsheets/d/1JAGjMRwM5QG-bfkiAaD5ES8A2SwBa8hzN7uC6qfR8b8/edit">Book with Categories (Guitar, Drums)</a>
          </p>

          <div className="upload-area" style={{ marginTop: '32px' }}>
            <Dragger {...draggerProps}>
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">Drag the file or Click here to select file</p>
              <p className="ant-upload-hint">Supported format is *.csv</p>
            </Dragger>
          </div>
        </div>
      </Col>
    </Row>
  );
}

AddBookContainer.propTypes = {
  getBooks: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getBooks: getBooksAction,
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(AddBookContainer);
