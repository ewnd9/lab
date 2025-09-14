import { afterAll, beforeAll, expect, test } from 'bun:test';
import { spawn, $ } from 'bun';

interface TestContext {
  clusterName: string;
  kubeconfigPath: string;
  dockerImageName: string;
  dockerImageTag: string;
}

let ctx: TestContext;

beforeAll(setupDependencies);
afterAll(teardownDependencies);

test('kubectl get nodes', async () => {
  const nodes =
    await $`kubectl --kubeconfig ${ctx.kubeconfigPath} get nodes --output=json`.json();

  expect(nodes.items[0].metadata.name).toBe('blog-control-plane');
});

test('deploy via helm', async () => {
  await runCommand([
    'helm',
    'repo',
    'add',
    'bjw-s',
    'https://bjw-s-labs.github.io/helm-charts',
  ]);

  await runCommand([
    'helm',
    'upgrade',
    'helm-deploy-app',
    'bjw-s/app-template',
    '--kubeconfig',
    ctx.kubeconfigPath,
    '--atomic',
    '--timeout=3m',
    '--install',
    '--values',
    './helm/values.yaml',
    '--set',
    `controllers.main.containers.main.image.repository=${ctx.dockerImageName}`,
    '--set',
    `controllers.main.containers.main.image.tag=${ctx.dockerImageTag}`,
  ]);

  const helmApps =
    await $`helm --kubeconfig ${ctx.kubeconfigPath} list --output=json`.json();

  expect(helmApps.map((app: any) => app.name)).toEqual(['helm-deploy-app']);

  const pods =
    await $`kubectl --kubeconfig ${ctx.kubeconfigPath} get pods --output=json`.json();
  expect(
    pods.items.map(
      (pod: any) => pod.metadata.labels['app.kubernetes.io/instance']
    )
  ).toEqual(['helm-deploy-app']);

  await runCommand([
    'helm',
    'delete',
    'helm-deploy-app',
    '--kubeconfig',
    ctx.kubeconfigPath,
  ]);

  const helmAppsAfterDelete =
    await $`helm --kubeconfig ${ctx.kubeconfigPath} list --output=json`.json();

  expect(helmAppsAfterDelete.map((app: any) => app.name)).toEqual([]);
});

test('deploy via helmfile', async () => {
  await runCommand(
    [
      'helmfile',
      'apply',
      '--kubeconfig',
      ctx.kubeconfigPath,
      '--file',
      './helmfile/helmfile.yaml.gotmpl',
      '--set',
      `controllers.main.containers.main.image.repository=${ctx.dockerImageName}`,
      '--set',
      `controllers.main.containers.main.image.tag=${ctx.dockerImageTag}`,
    ],
    {
      env: {
        ...process.env,
        KUBECONFIG: `${__dirname}/kubeconfig`,
      },
    }
  );

  const pods =
    await Bun.$`kubectl --kubeconfig ${ctx.kubeconfigPath} --namespace common get pods --output=json`.json();

  expect(
    pods.items.map(
      (pod: any) => pod.metadata.labels['app.kubernetes.io/instance']
    )
  ).toEqual(['helmfile-deploy-app']);

  await runCommand([
    'helmfile',
    'destroy',
    '--kubeconfig',
    ctx.kubeconfigPath,
    '--file',
    './helmfile/helmfile.yaml.gotmpl',
  ]);
});

test('deploy via helmwave', async () => {
  await runCommand(
    ['helmwave', 'build', '--file', './helmwave/helmwave.yaml'],
    {
      env: {
        ...process.env,
        IMAGE_REPOSITORY: ctx.dockerImageName,
        IMAGE_TAG: ctx.dockerImageTag,
        KUBECONFIG: `${__dirname}/kubeconfig`,
      },
    }
  );

  await runCommand(['helmwave', 'up'], {
    env: {
      ...process.env,
      KUBECONFIG: `${__dirname}/kubeconfig`,
    },
  });

  const pods =
    await Bun.$`kubectl --kubeconfig ${ctx.kubeconfigPath} --namespace common get pods --output=json`.json();

  expect(
    pods.items.map(
      (pod: any) => pod.metadata.labels['app.kubernetes.io/instance']
    )
  ).toEqual(['helmwave-deploy-app']);

  await runCommand(['helmwave', 'down'], {
    env: {
      ...process.env,
      KUBECONFIG: `${__dirname}/kubeconfig`,
    },
  });
});

async function setupDependencies() {
  ctx = {
    clusterName: 'blog',
    // helmfile breaks on just "./kubeconfig"
    kubeconfigPath: `${__dirname}/kubeconfig`,
    dockerImageName: 'lab-helm-deploy-app',
    dockerImageTag: 'latest',
  };

  if (!Bun.env['MANUAL_KIND']) {
    await runCommand([
      'kind',
      'create',
      'cluster',
      '--name',
      ctx.clusterName,
      '--kubeconfig',
      ctx.kubeconfigPath,
    ]);
    await runCommand(
      [
        'docker',
        'build',
        '-t',
        `${ctx.dockerImageName}:${ctx.dockerImageTag}`,
        '.',
      ],
      { cwd: 'app' }
    );
  }

  // https://iximiuz.com/en/posts/kubernetes-kind-load-docker-image/
  await runCommand([
    'kind',
    'load',
    'docker-image',
    `${ctx.dockerImageName}:${ctx.dockerImageTag}`,
    '--name',
    ctx.clusterName,
  ]);
}

async function teardownDependencies() {
  if (!Bun.env['MANUAL_KIND']) {
    await runCommand([
      'kind',
      'delete',
      'cluster',
      '--name',
      ctx.clusterName,
      '--kubeconfig',
      ctx.kubeconfigPath,
    ]);
  }
}

async function runCommand(
  cmd: string[],
  options?: Bun.SpawnOptions.OptionsObject<'ignore', 'inherit', 'inherit'>
): Promise<void> {
  console.log(`\x1b[90m$ ${cmd.join(' ')}\x1b[0m`);
  const proc = spawn(cmd, {
    cwd: options?.cwd,
    ...options,
    stdout: 'inherit',
    stderr: 'inherit',
  });

  const result = await proc.exited;
  if (result !== 0) {
    throw new Error(`Command failed with exit code ${result}`);
  }
}
