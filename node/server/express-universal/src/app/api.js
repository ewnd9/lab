import request from 'superagent-bluebird-promise';

const host = (() => {
  if (typeof window === 'undefined') {
    if (process.env.NODE_ENV === 'production') {
      return 'http://localhost:3000';
    } else {
      return 'http://localhost:3000';
    }
  } else {
    return '';
  }
})();

const baseUrl = host + '/api/v1';
const get = url => request(baseUrl + url);

export function findCategories() {
  return get('/categories')
    .then(({ body }) => body);
};
