'use strict';

const gen = require('../src/');

it('string', () => {
  const code = gen('string');
  expect(code).toMatchSnapshot();
});

it('number', () => {
  const codeInteger = gen(1);
  expect(codeInteger).toMatchSnapshot();

  const codeFloat = gen(0.3);
  expect(codeFloat).toMatchSnapshot();
});

it('boolean', () => {
  const code = gen(true);
  expect(code).toMatchSnapshot();
});

it('empty array', () => {
  const code = gen([]);
  expect(code).toMatchSnapshot();
});

it('array of strings', () => {
  const code = gen(['string', 'data']);
  expect(code).toMatchSnapshot();
});

it('array of strings and numbers', () => {
  const code = gen(['string', 1]);
  expect(code).toMatchSnapshot();
});

it('empty object', () => {
  const code = gen({});
  expect(code).toMatchSnapshot();
});

it('nested objects', () => {
  const code = gen({ a: { b: { c: 'string' } }});
  expect(code).toMatchSnapshot();
});
