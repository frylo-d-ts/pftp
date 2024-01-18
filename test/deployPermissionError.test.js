const process = require('process');
const { deploy } = require('../lib/index.js');
const { credentialsPermissionTest, foldersPermissionTest } = require('./credentials.js');

async function main() {
	await deploy({
		...credentialsPermissionTest,
		...foldersPermissionTest,
		progress: 'logs',

		customLftpOptions: {
			logLftpCommand: true,
		}
	});
}

main()
	.then(() => process.exit())
	.catch((error) => console.error(error));
