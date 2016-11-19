/* @flow */

'use strict';

const db1 = require('noop3');
const s: string = '1';

type User = {
  _id?: string,
  name: string
}

type Movie = {
  _id?: string,
  title: string
}

class StoreClass<T> {
  find(id: string): T {
    return db()
  }
}

const userStore: StoreClass<User> = new StoreClass();
const user = userStore.find('1'); // correct type

function StoreFunction() {

}

StoreFunction.prototype.find = function(id: string) {
  return db();
}

interface StoreInterface<T> {
  find(id: string): T;
}

const movieStore: StoreInterface<Movie> = new StoreFunction();
const movie = movieStore.find('2'); // correct type
