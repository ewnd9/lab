import test from 'ava';
import 'babel-core/register';
import PouchDB from 'pouchdb';
import Model from './../odm/index';

test.serial('create a new entity', async t => {
  const db = new PouchDB(`/tmp/${new Date().getTime()}`);
  Model.db = db;

  const post = new Model('post');

  const item = await post.update('hello-world', {
    date: new Date(),
    content: 'Hello World Test'
  });

  t.is(item._id, 'post:hello-world');
  t.same(Object.keys(item).sort(), ['_id', '_rev', 'content', 'date', 'createdAt', 'updatedAt'].sort());
});
