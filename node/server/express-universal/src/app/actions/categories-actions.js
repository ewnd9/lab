import * as api from '../api';

export const REQUEST_CATEGORIES = 'REQUEST_CATEGORIES';
export const RECIEVE_CATEGORIES = 'RECIEVE_CATEGORIES';

function requestCategories() {
  return {
    type: REQUEST_CATEGORIES
  };
};

function recieveCategories(categories) {
  return {
    type: RECIEVE_CATEGORIES,
    categories
  };
};

export function fetchCategories() {
  return (dispatch, getState) => {
    dispatch(requestCategories());

    return api
      .findCategories()
      .then(categories => dispatch(recieveCategories(categories)));
  };
};
