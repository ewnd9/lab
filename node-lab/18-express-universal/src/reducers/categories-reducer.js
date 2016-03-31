import {
  REQUEST_CATEGORIES,
  RECIEVE_CATEGORIES,
  MARK_CATEGORY_AS_SEEN
} from '../actions/categories-actions';

function categories(state = {
  isFetching: false,
  categories: []
}, action) {
  switch (action.type) {
    case REQUEST_CATEGORIES:
      return {
        ...state,
        isFetching: true
      };
    case RECIEVE_CATEGORIES:
      return {
        ...state,
        isFetching: false,
        categories: action.categories
      };
    default:
      return state;
  }
};

export default categories;
