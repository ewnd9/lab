import test from 'ava';
import 'babel-core/register';

import _ from 'lodash';
import Promise from 'bluebird';

import init, { queryByDynamic, queryByView } from './../utils/init';

const count = (x, result) => {
	x.map(v => result[v._id] = true);
	return result;
};

const getPaginated = async (initial, optionsFn) => {
	let prevDate = initial.prevDate;
	let prevId = initial.prevId;

	let skip;

	const mapping = {};

	const result = await Promise.mapSeries(_.range(0, 5), async (i) => {
		const startkey = [prevDate, prevId];

		const partResult = await pouch.query((doc, emit) => emit([doc.createdAt, doc._id]), {
			...optionsFn(startkey, skip),
			limit: 10,
			include_docs: true
		});

		count(partResult.rows.map(x => x.doc), mapping);

		const prevEl = partResult.rows[partResult.rows.length - 1];

		if (prevEl) {
			const prev = prevEl.doc;

			prevId = prev._id;
			prevDate = prev.createdAt;
			skip = 1;
		}

		return partResult;
	});

	return mapping;
};

let pouch = null;
let db = null;

test.before(async () => {
	const data = await init(50);

	pouch = data.pouch;
	db = data.db;
});

test.serial('fetch all items and design doc by 1 request', async t => {
	let result = await pouch.allDocs({ include_docs: true });
	let mapping = count(result.rows.map(x => x.doc), {});
	t.is(Object.keys(mapping).length, 51);
});

test.serial('fetch all items by 1 request', async t => {
	let result = await pouch.allDocs({ include_docs: true, endkey: '_design' });

	let mapping = count(result.rows.map(x => x.doc), {});
	t.is(Object.keys(mapping).length, 50);
});

test.serial('fetch all items (asc) by 5 request', async t => {
	let mapping = await getPaginated({}, (startkey, skip) => ({ startkey, skip }));
	t.is(Object.keys(mapping).length, 50);
});

test.serial('fetch 0 items (desc) by 5 request due to incorrect initial values', async t => {
	let mapping = await getPaginated({}, (startkey, skip) => ({ descending: true, startkey, skip }));
	t.is(Object.keys(mapping).length, 0);
});

test.serial('fetch all items (desc) by 5 request', async t => {
	let mapping = await getPaginated({ prevDate: '\uffff', prevId: '\uffff' }, (startkey, skip) => ({ descending: true, startkey, skip }));
	t.is(Object.keys(mapping).length, 50);
});

test.serial('fetch all items from 1 category by in-memory query', async t => {
	const result = await queryByDynamic(pouch, 1);
	t.is(result.rows.length, 10);
});

test.serial('fetch all items from 1 category by stored view', async t => {
	const result = await queryByView(pouch, 1);
	t.is(result.rows.length, 10);
});
