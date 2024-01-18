import { spawn } from "child_process";

import c from "chalk";
import commandExists from "command-exists";
import humanizeDuration from "humanize-duration";

import { listNestedDirs } from "./glob";
import { createLogger } from "./logger";

import {
	Configuration,
	ConfigurationSchema,
	Credentials,
	CredentialsSchema,
	CustomLftpOptions,
	CustomLftpOptionsSchema,
} from "./configuration";

async function deploy(configuration: Configuration) {
	const timeStart = Date.now();

	const configCheckResult = ConfigurationSchema.safeParse(configuration);

	const excludeRegExp = configuration.excludeRegExp || [];
	const includeForceRegExp = configuration.includeForceRegExp || [];

	const isIncludeForce = includeForceRegExp.length > 0;

	const localDirs = configuration?.localFolder
		? listNestedDirs(configuration?.localFolder, excludeRegExp)
		: [];

	const loggerTotal = localDirs.length * (isIncludeForce ? 2 : 1);
	const progress = configuration?.progress ?? "bar";
	const logger = createLogger(progress === "bar", loggerTotal);

	if (!configCheckResult.success) {
		logger.printError(
			`${c.red`✗`} ${c.bold
				.red`Invalid configuration`} for deploy function.\n\n${c.red`✗`} ${c.red
				.bold`Reason`} `,
			configCheckResult.error.format()
		);
		return;
	}

	const {
		host,
		port,
		protocol,
		username,
		password,
		localFolder,
		remoteFolder,
	} = configuration;

	const customLftpOptions = CustomLftpOptionsSchema.parse(
		configuration.customLftpOptions || {}
	);

	const beforeOpen: string = customLftpOptions.beforeOpen;
	const beforeMirror: string = customLftpOptions.beforeMirror;
	const beforeMirrorForce: string = customLftpOptions.beforeMirror;

	const openOptions: string = customLftpOptions.openCommandOptions;
	const mirrorOptions: string = customLftpOptions.mirrorCommandOptions;
	const mirrorForceOptions: string =
		customLftpOptions.mirrorForceCommandOptions;

	const enableSsl: boolean = customLftpOptions.enableSsl;

	const lftp: string = customLftpOptions.lftpCommand;
	const logLftpCommand: boolean = customLftpOptions.logLftpCommand;

	const toArgValue = (str: string) =>
		JSON.stringify(JSON.stringify(str)).replace(/(^"|"$)/g, "");
	const toEgrep = (pattern: RegExp) =>
		pattern
			.toString()
			.replace(/^\//, "")
			.replace(/\/\w?$/, "");

	const excludeRegExpString: string = excludeRegExp
		.map((pattern) => `--exclude ${toArgValue(toEgrep(pattern))}`)
		.join(" ");
	const includeForceRegExpString: string = includeForceRegExp
		.map((pattern) => `--include ${toArgValue(toEgrep(pattern))}`)
		.join(" ");

	const commands = {
		open: `open ${openOptions} -u ${username},${password} -p ${port} ${protocol}://${host}`,
		noSsl: enableSsl ? "" : `set ssl:verify-certificate no`,
		mirror: `mirror ${mirrorOptions} ${excludeRegExpString} ${localFolder} ${remoteFolder}`,
		mirrorForce: isIncludeForce
			? `mirror ${mirrorForceOptions} ${includeForceRegExpString} ${localFolder} ${remoteFolder}`
			: "",
	};

	try {
		const isLftpExists = await commandExists(lftp);
		if (!isLftpExists) throw false;
	} catch {
		logger.printError(
			`${c.red`✗`} ${c.red.bold`Error`}, no \`${c.bold(
				"lftp"
			)}\` found ${c.italic`(trying \`${lftp}\`)`}. It is required for deployment. \n${c.italic`Installation instructions here - https://github.com/Atinux/node-ftps?tab=readme-ov-file#requirements`}`
		);
		return;
	}

	logger.printMessage(
		`${c.blue.bold`PFTP`} deploy by ${c.italic.underline`@frylo`}`
	);
	logger.printMessage("");
	logger.printMessage(`${c.blue`⬖`} ${c.bold`Connecting`} to server...`);

	const lftpCommand =
		`lftp -c "` +
		(`${beforeOpen}; ${commands.open}; ` +
			`${commands.noSsl}; ` +
			`${beforeMirror}; ${commands.mirror}; ` +
			`${beforeMirrorForce}; ${commands.mirrorForce}`) +
		`"`;
	const lftpProcess = spawn(lftpCommand, [], { shell: true });

	let deployedCount = 1;

	let deployPromiseResolve: (value: unknown) => void;
	let deployPromiseReject: (error: Error) => void;

	const deployPromise = new Promise((resolve, reject) => {
		deployPromiseResolve = resolve;
		deployPromiseReject = reject;
	});

	const errorLog: string[] = [];

	lftpProcess.stdout.on("data", (data) => {
		if (deployedCount === 1) {
			if (logLftpCommand) {
				logger.printMessage("");
				logger.printMessage(`${c.blue`⚡`}${lftpCommand}`);
			}

			logger.printMessage("");
			logger.printMessage(
				`${c.blue`⚡`}${c.bold`Uploading`}...  ${c.grey`${localFolder} :: ${remoteFolder}`}`
			);
			logger.begin();
		}

		const text: string = data.toString().trim();
		const messages = text.split("\n");

		for (const message of messages) {
			const isFinishedMirror = message.startsWith("Finished mirror");

			if (!isFinishedMirror) return;

			const folderRelativePath = message.match(
				/^Finished mirror `(.*?)'$/
			)?.[1];

			if (!folderRelativePath) {
				deployPromiseReject(
					new Error(
						`Invalid format of message from server "${message}". Expected "Finished \`path/to/folder'"`
					)
				);
				return;
			}

			logger.printStep(deployedCount, folderRelativePath);

			deployedCount++;
		}
	});

	lftpProcess.stderr.on("data", (data) => {
		errorLog.push(data.toString().trim());
	});

	lftpProcess.on("exit", (code) => {
		if (code === 1) {
			logger.finish();

			logger.printMessage("");

			logger.printError(
				c.bold(`${c.red`✗`} Deployment finished with ${c.red("error")}!!`) +
					`\n    ${c.red`1.`} Check logs if them present below.` +
					`\n    ${c.red`2.`} Check credentials.` +
					`\n    ${c.red`3.`} Try run command by hand \`${c.italic.underline(
						lftpCommand
					)}\`.`
			);

			if (errorLog.length > 0) {
				logger.printError(
					"\n" +
						c.bold(`${c.red`✗`} Check this ${c.red("logs")} for more info:\n`) +
						errorLog
							.map((message) => c.red.bold("    > ") + message)
							.join("\n") +
						"\n\n"
				);
			}

			deployPromiseReject(
				new Error(`Program finished with error code ${code}`)
			);
			return;
		}
	});

	lftpProcess.on("close", (data) => {
		deployPromiseResolve(data);
	});

	await deployPromise;

	logger.finish();

	const timeEnd = Date.now();

	const duration = timeEnd - timeStart;
	const durationPretty = humanizeDuration(duration, { maxDecimalPoints: 1 });

	logger.printMessage("");
	logger.printMessage(
		`${c.blue`✓`} ${c.bold`Finished`}!! ${c.grey`~ ${durationPretty}`}`
	);
}

export {
	deploy,
	Configuration,
	ConfigurationSchema,
	Credentials,
	CredentialsSchema,
	CustomLftpOptions,
	CustomLftpOptionsSchema,
};
