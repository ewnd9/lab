import test from 'ava';
import 'babel-core/register';
import PouchDB from 'pouchdb';
import Model from './../odm/index';

test.serial('create a new entity', async t => {
  const db = new PouchDB(`/tmp/${new Date().getTime()}`);
  Model.db = db;

  db.Post = new Model('post');

  const postId = 'hello-world';
  const postContent = 'Hello World Tets';
  const postBody = {
    date: new Date(),
    content: postContent
  };
  const postFields = ['_id', '_rev', 'content', 'date', 'createdAt', 'updatedAt'];

  const item0 = await db.Post.update(postId, postBody);

  t.is(item0._id, 'post:hello-world');
  t.same(Object.keys(item0).sort(), postFields.sort());

  const item1 = await db.Post.update(postId, postBody);

  t.is(item1._id, 'post:hello-world');
  t.same(Object.keys(item1).sort(), postFields.sort());
  t.not(item1._rev, item0._rev);

  const item2 = await db.Post.getOrInit('hello-world', () => postBody);

  t.is(item2._id, 'post:hello-world');
  t.same(Object.keys(item2).sort(), postFields.sort());
  t.is(item2._rev, item1._rev);

  t.is(1, (await db.info()).doc_count);
  await db.Post.remove(item2);
  t.is(0, (await db.info()).doc_count);

});
