import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import ViewContainer from '../core/ViewContainer';
import ViewDetails from '../core/ViewDetails';
import ViewDetailsList from '../core/ViewDetailsList';
import SwitchViewDetails from '../core/SwitchViewDetails';
import ViewDetailsContainer from '../core/ViewDetailsContainer';
import ViewList from '../core/ViewList';
import AddNewEntity from '../core/AddNewEntity';
import AddEditAnnualPlanContainer from './AddEditAnnualPlanContainer';
import AnnualPlanDetailsContainer from './AnnualPlanDetailsContainer';
import permissionConfig from '../../constants/permission-config.json';
import routes from '../../constants/routes.json';
import { getListAction, getSearchAction } from '../../reducers/annual-plans';
import { LIST_STORE } from '../../helpers/stateUtils';
import LoadingMessage from '../misc/LoadingMessage';
import SearchBar from '../misc/SearchBar';
import BackButton from '../misc/BackButton';
import ClassroomsTitle from '../misc/ClassroomsTitle';

const { entity: permissionEntity } = permissionConfig;

const AnnualPlan = ({ item: annualPlan }) => {
  const { title, classroomDetails } = annualPlan;

  return (
    <Fragment>
      <h2 className="item-title">{title}</h2>
      <div className="item-details">
        <ClassroomsTitle classrooms={classroomDetails} />
      </div>
    </Fragment>
  );
};

AnnualPlan.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string,
    classroomDetails: PropTypes.arrayOf(PropTypes.shape({}))
  }).isRequired
};

class AnnualPlansContainer extends Component {
  static propTypes = {
    school: PropTypes.shape({
      id: PropTypes.string
    }),
    annualPlans: ImmutablePropTypes.map,
    match: PropTypes.shape({
      params: PropTypes.shape({})
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func
    }).isRequired,
    getAnnualPlans: PropTypes.func.isRequired,
    searchAnnualPlans: PropTypes.func.isRequired
  };

  static defaultProps = {
    school: null,
    annualPlans: null
  };

  state = {
    activeItem: null
  };

  componentDidMount() {
    const { school } = this.props;

    if (school) {
      this.props.getAnnualPlans({ school: school.id });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { id } = nextProps.match.params;
    const schoolSelectedChanged =
      nextProps.school && nextProps.school !== this.props.school;

    if (schoolSelectedChanged) {
      this.props.getAnnualPlans({ school: nextProps.school.id });
    }

    this.setState({
      activeItem: id
    });
  }

  setActive = annualPlanId => {
    const url = `${routes.annual_plans}/${annualPlanId}`;
    this.props.history.push(url);
  };

  searchForAnnualPlans = searchText => {
    const { getAnnualPlans, searchAnnualPlans, school } = this.props;
    if (!searchText || !searchText.length) {
      getAnnualPlans({ school: school.id });
    } else {
      searchAnnualPlans({ school: school.id, search: searchText });
    }
  };

  render() {
    const { annualPlans, school } = this.props;
    const { activeItem } = this.state;

    const newItemLink = `${routes.annual_plans}${routes.new}`;

    if (_.isNull(annualPlans)) {
      return <LoadingMessage message="Fetching Annual Plans..." />;
    }

    return (
      <ViewContainer>
        <div className="action-buttons">
          <AddNewEntity
            entityType={permissionEntity.annualPlans}
            linkToAdd={newItemLink}
            hide={!!activeItem}
          />
          <BackButton link={routes.annual_plans} hide={!activeItem} />
        </div>
        <ViewDetails>
          <ViewDetailsList hide={!!activeItem}>
            <div className="view-search">
              <SearchBar
                onSearch={this.searchForAnnualPlans}
                placeholder="Search Annual Plans.."
              />
            </div>
            <ViewList
              datalist={annualPlans}
              itemcomponent={AnnualPlan}
              activeItem={activeItem}
              setActive={this.setActive}
            />
          </ViewDetailsList>
          <ViewDetailsContainer hide={!activeItem}>
            <SwitchViewDetails
              routeSubdomain={routes.annual_plans}
              AddEditComponent={AddEditAnnualPlanContainer}
              DetailsComponent={AnnualPlanDetailsContainer}
            />
          </ViewDetailsContainer>
        </ViewDetails>
      </ViewContainer>
    );
  }
}

function mapStateToProps(state) {
  const { annualLessonPlans } = state;
  const annualPlansList = annualLessonPlans.get(LIST_STORE);
  return {
    annualPlans: annualPlansList
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getAnnualPlans: getListAction,
      searchAnnualPlans: getSearchAction
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnnualPlansContainer);
