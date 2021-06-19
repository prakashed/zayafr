import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import _ from 'lodash';
import { List } from 'antd';

import ViewListItem from './ViewListItem';
import LoadingMessage from '../misc/LoadingMessage';
import './ViewList.less';

export default function ViewList(props) {
  const {
    datalist,
    itemcomponent: ItemComponent,
    setActive,
    activeItem,
    listTitle,
    ...otherProps
  } = props;

  return (
    <div className="view-list-container" {...otherProps}>
      {
          _.isNull(datalist) ?
            <LoadingMessage message="Fetching data..." />
          :
            <Fragment>
              { listTitle ? <div className="list-title">{ listTitle }</div> : '' }
              <List
                itemLayout="horizontal"
                dataSource={datalist.toIndexedSeq().toArray()}
                renderItem={item =>
                (
                  <ViewListItem item={item} setActive={setActive} activeItem={activeItem}>
                    <ItemComponent
                      item={item}
                    />
                  </ViewListItem>
                )}
              />
            </Fragment>

        }
    </div>
  );
}

ViewList.propTypes = {
  datalist: ImmutablePropTypes.map,
  itemcomponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]).isRequired,
  activeItem: PropTypes.string,
  listTitle: PropTypes.string,
  setActive: PropTypes.func,
};

ViewList.defaultProps = {
  datalist: null,
  activeItem: null,
  listTitle: null,
  setActive: () => {},
};
