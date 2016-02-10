export const put = doc => Model.db.put(doc).then(result => ({ ...doc, _rev: result.rev }));

export default function Model(prefix) {
  this.getId = function() {
    const args = Array.isArray(arguments[0]) ? arguments[0] : [].slice.call(arguments);
    return [prefix].concat(args).join(':');
  };
};

Model.prototype.on404 = function(err, fn) {
  if (err.status === 404) {
    return fn();
  } else {
    throw err;
  }
};

Model.prototype.findAll = function(id = '') {
  return Model.db
    .allDocs({
      include_docs: true,
      startkey: this.getId(id),
      endkey: this.getId(id) + '\uffff'
    })
    .then(result => result.rows.map(_ => _.doc));
};

Model.prototype.get = function(id) {
  return Model.db.get(this.getId(id));
};

Model.prototype.put = function(id, data) {
  return put({
    ...data,
    _id: this.getId(id),
    updatedAt: new Date().toISOString()
  });
};

Model.prototype.create = function(id, data) {
  return put({
    ...data,
    _id: this.getId(id),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
};

Model.prototype.update = function(id, data) {
  return this
    .get(id)
    .then(
      dbData => this.put(id, { ...dbData, ...data }),
      err => this.on404(err, () => this.create(id, data))
    );
};

Model.prototype.getOrFetch = function(id, fetch) {
  return this.get(id)
    .then(null,
      err => this.on404(
        err,
        () => fetch().then(data => this.create(id, data))
      )
    );
};
