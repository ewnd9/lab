import test from 'ava';

import sinon from 'sinon';
import proxyquire from 'proxyquire';

require('babel-register')({
  presets: ['es2015']
});

test(async t => {
  await createTest(t, {
    rootDir: ['cat-a', 'cat'],
    mkdirCalls: [
    ],
    renameCalls: [
    ]
  });
});

test.only(async t => {
  await createTest(t, {
    rootDir: ['cat-a-a', 'cat-a-b', 'cat'],
    mkdirCalls: [
    ],
    renameCalls: [
    ]
  });
});

test(async t => {
  await createTest(t, {
    rootDir: ['cat-a-a', 'cat-a-b', 'cat-c-a', 'cat-c-b'],
    mkdirCalls: [
      [
        '/root/cat-a',
      ],
      [
        '/root/cat-c'
      ]
    ],
    renameCalls: [
      [ '/root/cat-a-a', '/root/cat-a/cat-a-a' ],
      [ '/root/cat-a-b', '/root/cat-a/cat-a-b' ],
      [ '/root/cat-c-a', '/root/cat-c/cat-c-a' ],
      [ '/root/cat-c-b', '/root/cat-c/cat-c-b' ]
    ]
  });
});

async function createTest(t, { rootDir, mkdirCalls, renameCalls }) {
  const mkdir = sinon.stub().returns(Promise.resolve());
  const rename = sinon.stub().returns(Promise.resolve());

  const { refactorMdCollapse } = proxyquire.noCallThru().load('./index.js', {
    fs: {
      readdir: () => Promise.resolve(rootDir),
      mkdir,
      rename
    },
    pify: x => x
  });

  await refactorMdCollapse('/root');

  t.deepEqual(mkdir.getCalls().map(x => x.args), mkdirCalls);
  t.deepEqual(rename.getCalls().map(x => x.args), renameCalls);
}
