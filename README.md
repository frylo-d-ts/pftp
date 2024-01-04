# @frylo/pftp - Progressive FTP

This package using [LFTP](https://lftp.yar.ru/) to deploy your code to FTP/SFTP/SSH server.

Benefits:
1. Update only changed files
2. See the progress bar
3. Simple configuration.


## Getting Started

Install package:
```bash
npm install --save-dev @frylo/pftp
yarn install -D @frylo/pftp
pnpm i -D @frylo/pftp
```

Create upload script file, e.g. `deployment.mjs`:
```js
import { deploy, Credentials } from '@frylo/pftp';

/** @type {Credentials} */
const credentials = {
	host: '000.00.00.0',
	port: 22,
	protocol: 'sftp',
	username: 'my-username',
	password: 'my-password',
};

async function main() {
	await deploy({
		...credentials,
		localFolder: './build',
		remoteFolder: '/var/www/my-site.com',
		progress: 'bar',
	});
}

main.then(() => process.exit());
```

Run upload script to deploy files:
```bash
node ./deployment.mjs
```

## Package development

Read more about package development [here](./readme/package-development.md).
