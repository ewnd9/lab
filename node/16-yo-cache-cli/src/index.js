import userHome from 'user-home';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { createEnv } from 'yeoman-environment';
import hasha from 'hasha';

const cacheBase = userHome + '/.yo-cache';
if (!fs.existsSync(cacheBase)) {
  fs.mkdirSync(cacheBase);
}

const input = process.argv[2];
const env = createEnv();

env.lookup(() => {
  let installDeps;
  let installCalled;

  const gen = env.run(input, () => {
    if (!installCalled) {
      installWithCache();
    }
  });

  const cwd = path.resolve();
  const dest = path.join(cwd, 'node_modules');

  function installWithCache() {
    const name = gen._globalConfig.name;
    gen.props.packageName = undefined;
    const propsHash = hasha(JSON.stringify(gen.props), { algorithm: 'md5' });
    const cacheFolder = path.join(cacheBase, `${name}-${propsHash}`);

    if (fs.existsSync(cacheFolder)) {
      execSync(`cp -R ${cacheFolder} ${dest}`);
      console.log(`node_modules was copied from cache ${cacheFolder}`);
    } else {
      execSync(`npm install`, {
        cwd: cwd,
        stdio: [null, process.stdout, process.stderr]
      });
      execSync(`cp -R ${dest} ${cacheFolder}`); // @TODO fix, somehow it still executing on (ctrl+c)
      console.log(`node_modules was copied to cache ${cacheFolder}`);
    }
  }

  installDeps = gen.installDependencies.bind(gen);
  gen.installDependencies = function() {
    installCalled = true;
    installWithCache();
  };
});
