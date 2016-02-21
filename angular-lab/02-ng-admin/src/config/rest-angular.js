export default RestangularProvider => {
  RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params) {
    if (operation === 'getList') {
      // custom pagination params
      if (params._page) {
        var start = (params._page - 1) * params._perPage;
        var end = params._page * params._perPage - 1;
        params.range = "[" + start + "," + end + "]";
        delete params._page;
        delete params._perPage;
      }

      // custom sort params
      if (params._sortField) {
        params.sort = '["' + params._sortField + '","' + params._sortDir + '"]';
        delete params._sortField;
        delete params._sortDir;
      }

      // custom filters
      if (params._filters) {
        params.filter = params._filters;
        delete params._filters;
      }
    }

    return { params: params };
  });

  RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response) {
    if (operation === "getList") {
      var headers = response.headers();

      if (headers['content-range']) {
        response.totalCount = headers['content-range'].split('/').pop();
      }
    }

    return data;
  });
};
