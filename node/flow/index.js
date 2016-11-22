/* @flow */

'use strict';

import * as t from 'flow-io';
import type { TypeOf } from 'flow-io';

const Person = t.object({
  name: t.string,
  age: t.number
})

type PersonT = TypeOf<typeof Person>;

const p: PersonT = t.fromValidation(JSON.parse('{"name":"Giulio","age":43}'), Person) // => {name: "Giulio", age: 43}
const o: PersonT = t.fromValidation(JSON.parse('{"name":"Giulio","age":"43"}'), Person) // => {name: "Giulio", age: 43}
// const x: PersonT = { a: 1 } // flow error
// const y: PersonT = { name: 'Giulio', age: '43' } // no errors, should be age mismatch
// y.x = 1;
// y.name = 1;
