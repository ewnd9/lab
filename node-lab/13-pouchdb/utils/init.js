import Promise from 'bluebird';
import fs from 'fs';
import _ from 'lodash';

import PouchDB from 'pouchdb';
PouchDB.plugin(require('pouchdb-hoodie-api'));

const createDesignDoc = (name, mapFunction) => {
	const ddoc = {
		_id: '_design/' + name,
		views: {}
	};

	ddoc.views[name] = { map: mapFunction };
	return ddoc;
};

export default (count, createView = true) => {
	const folder = `/tmp/pouch-test-${Math.random()}`;
	fs.mkdirSync(folder);

	const path = `${folder}/pouch`;

	const pouch = new PouchDB(path);
	const db = pouch.hoodieApi({});

	return Promise.mapSeries(_.range(0, count), (i) => db.add({
		name: `x-${i}`,
		category: `cat-${(i / 10) | 0}`
	})).then(() => {
		if (createView) {
			return pouch
				.put(createDesignDoc('by_category', (doc) => {
					emit(doc.category + '$' + doc.createdAt + '$' + doc._id);
				}.toString()))
				.then(() => {
					return pouch.query('by_category', { stale: 'update_after' });
				});
		} else {
			return Promise.resolve();
		}
	}).then(() => {
		return { pouch, db, path, folder };
	});
};

export const queryByDynamic = (pouch, cat) => {
	const category = 'cat-' + cat;

	return pouch.query((doc, emit) => {
		emit(doc.category + '$' + doc.createdAt + '$' + doc._id);
	}, {
		startkey: category,
		endkey: category + '$\uffff'
	});
};

export const queryByView = (pouch, cat) => {
	const category = 'cat-' + cat;

	return pouch.query('by_category', {
		startkey: category,
		endkey: category + '$\uffff'
	});
};
