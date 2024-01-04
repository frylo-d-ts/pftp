/* eslint-disable no-console */
import { SingleBar } from "cli-progress";
import c from "chalk";

function createProgress() {
	const dot = c.blue('•');
	const line = c.blue('|');

	const bar = new SingleBar({
		format: `${c.blue(
			"{bar}"
		)} ${line} {value}/{total} ${dot} ${c.bold('{eta_formatted}')} ${c.italic.grey('~ {filename}')}`,
		barCompleteChar: "\u2588",
		barIncompleteChar: "\u2591",
		hideCursor: true,
	});

	return bar;
}

type Logger = {
	printMessage: (message: string) => void;
	printStep: (count: number, filename: string) => void;
	printError: (...messages: unknown[]) => void;
	begin: () => void;
	finish: () => void;
};

export function createLogger(isBar: boolean, totalCount: number): Logger {
	const base = {
		printMessage: console.log.bind(console),
		printError: console.error.bind(console),
	};

	if (isBar) {
		const bar = createProgress();

		return {
			...base,
			printStep(count: number, filename: string) {
				bar.update(count, { filename });
			},
			begin() {
				bar.start(totalCount, 1, { filename: "" });
			},
			finish() {
				bar.stop();
			},
		};
	} else {
		return {
			...base,
			printStep(count: number, filename: string) {
				const lineStartSpaces = " ".repeat(
					totalCount.toString().length - count.toString().length + 1
				);
				console.log(
					c.blue(`${lineStartSpaces}${c.bold(count)} / ${totalCount}`) +
						` ~ ${c.italic(filename)}`
				);
			},
			begin() {
				// ...
			},
			finish() {
				// ...
			},
		};
	}
}
