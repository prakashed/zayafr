import React from "react";
import PropTypes from "prop-types";

export function getScrollXY() {
  let a = 0;
  let b = 0;
  return (
    // eslint-disable-next-line
    "number" == typeof window.pageYOffset
      ? ((b = window.pageYOffset), (a = window.pageXOffset))
      : document.body && (document.body.scrollLeft || document.body.scrollTop)
      ? ((b = document.body.scrollTop), (a = document.body.scrollLeft))
      : document.documentElement &&
        (document.documentElement.scrollLeft ||
          document.documentElement.scrollTop) &&
        ((b = document.documentElement.scrollTop),
        (a = document.documentElement.scrollLeft)),
    [a, b]
  );
}

export function getDocHeight() {
  const a = document;
  return Math.max(
    a.body.scrollHeight,
    a.documentElement.scrollHeight,
    a.body.offsetHeight,
    a.documentElement.offsetHeight,
    a.body.clientHeight,
    a.documentElement.clientHeight
  );
}

class InfiniteLoad extends React.PureComponent {
  constructor(props) {
    super(props);
    this.items = [];
    this.dicItems = {};
    this.realItems = [];
    this.isFetch = true;
    this.pagesLoaded = {};
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    this.loadItems(() => {
      const { handlerFirstFetch } = this.props;
      if (handlerFirstFetch) {
        handlerFirstFetch();
      }
    });
  }
  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  };

  filterListItems = (newList, newFilter) => {
    const { applyFilters } = this.props;
    if (newList) {
      this.realItems = newList;
    }
    if (applyFilters) {
      const filterResult = applyFilters(this.realItems, newFilter);
      this.rebuildItems(filterResult, false);
    }
  };

  rebuildItems = (list, updateRealList = true) => {
    if (!updateRealList) {
      this.items = [];
    }
    const { onListUpdate } = this.props;
    list.forEach(it => {
      this.addItemToList(it, updateRealList);
    });
    this.loaderMode(false);
    this.forceUpdate();
    if (updateRealList && onListUpdate) {
      onListUpdate(this.realItems);
    }
    if (this.elementNoItems) {
      this.elementNoItems.style.display =
        this.items.length === 0 ? "inline" : "none";
    }
  };

  handleScroll = () => {
    const { onTop } = this.props;
    clearTimeout(this.intervalTime);
    this.intervalTime = setTimeout(() => {
      const isLoadMore = onTop ? this.isOnTop() : this.isOnBottom();
      if (isLoadMore) {
        if (!this.isFetch) this.loadItems();
      }
    }, 400);
  };

  isOnTop = () =>
    window.innerHeight + document.documentElement.scrollTop ===
    document.documentElement.offsetHeight;

  isOnBottom = () =>
    getDocHeight() - (this.props.offset || 0) <=
    getScrollXY()[1] + window.innerHeight;

  addItemToList = (elm, updateList = true) => {
    const { onTop } = this.props;
    // use dic
    const { id } = elm;
    if (id && !this.dicItems[id]) {
      this.dicItems[id] = true;
    } else {
      // eslint-disable-next-line
      if (id && updateList) {
        return;
      }
    }
    if (updateList) {
      this.realItems.push(elm);
    }
    if (onTop) {
      this.items.unshift(this.props.formatItem(elm));
    } else {
      this.items.push(this.props.formatItem(elm));
    }
  };

  loadItems(next) {
    const { loadMore } = this.props;
    if (loadMore) {
      const skep = this.realItems.length;
      if (!this.pagesLoaded[skep]) {
        this.loaderMode(true);
        this.pagesLoaded[skep] = true;
        loadMore(skep).then(data => {
          this.rebuildItems(data);
          if (next) {
            next();
          }
        });
      }
    } else {
      // eslint-disable-next-line
      console.log("not provider loadMore props func to loader more items");
    }
  }

  loaderMode = mode => {
    if (this.elementLoader) {
      this.elementLoader.style.display = mode ? "inline" : "none";
    }
    this.isFetch = mode;
  };

  renderLoader() {
    return (
      this.props.loader && (
        <div
          className="containerInfiniteLoader"
          ref={elementLoader => {
            this.elementLoader = elementLoader;
          }}
        >
          {this.props.loader}
        </div>
      )
    );
  }

  renderNoItemsToShow() {
    const { noItems } = this.props;
    return (
      <div
        className="infiniteNoItemsToShow"
        ref={elementNoItems => {
          this.elementNoItems = elementNoItems;
        }}
        style={{ display: "none" }}
      >
        {noItems || <span>no items to show </span>}
      </div>
    );
  }

  render() {
    return (
      <div className="containerInfinite">
        {this.props.onTop && this.renderLoader()}
        <div className="itemsInfinite">
          {this.items.length > 0 &&
            this.items.map((ele, index) => (
              <div className={`i-${index}-l`} key={`listItem-${index}`}>
                {ele}
              </div>
            ))}
          {this.renderNoItemsToShow()}
        </div>
        {!this.props.onTop && this.renderLoader()}
      </div>
    );
  }
}

InfiniteLoad.propTypes = {
  loadMore: PropTypes.func,
  formatItem: PropTypes.func,
  onTop: PropTypes.bool,
  loader: PropTypes.any,
  offset: PropTypes.number,
  onListUpdate: PropTypes.func,
  applyFilters: PropTypes.func,
  handlerFirstFetch: PropTypes.func,
  noItems: PropTypes.any
};

export default InfiniteLoad;
