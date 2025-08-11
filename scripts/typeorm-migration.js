import { execSync } from 'child_process';
import args from 'minimist';
// create | generate | run | revert
const acceptableTypes = ['create', 'generate', 'run', 'revert'];
const { type, service, env, name } = args(process.argv.slice(2));
if (
  !acceptableTypes.includes(type) ||
  !service ||
  !env ||
  (type !== 'run' && type !== 'revert' && !name)
) {
  console.error(
    '❌ Please provide --type, --service, --env, and --name (if required)',
  );
  console.error(
    'example => yarn migration --type=create --service=posts --env=dev --name=InitTable',
  );
  process.exit(1);
}

const basePath = `./apps/${service}/src/db`;
console.log('🚀 ~ basePath:', basePath);
const migrationDir = `${basePath}/migrations${env === 'prod' ? '-prod' : ''}`;
console.log('🚀 ~ migrationDir:', migrationDir);
const dataSource = `${basePath}/typeorm${env === 'prod' ? '-prod' : ''}.config.ts`;
console.log('🚀 ~ dataSource:', dataSource);

let command = '';

switch (type) {
  case 'create':
    command = `yarn typeorm -- migration:create ${basePath}/${name}`;
    break;

  case 'generate':
    command = `yarn typeorm -- -d ${dataSource} migration:generate ${migrationDir}/${name} -p`;
    break;

  case 'run':
    command = `yarn typeorm -- migration:run -d ${dataSource}`;
    break;

  case 'revert':
    command = `yarn typeorm -- migration:revert -d ${dataSource}`;
    break;
}

console.log(`🚀 Running: ${command}`);
execSync(command, { stdio: 'inherit' });
