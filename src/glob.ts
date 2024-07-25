import { globSync } from "glob";

export function listNestedDirs(
	absPathToRootFolder: string,
	excludeRegExp: RegExp[]
) {
	const fullList = globSync("**/", {
		cwd: absPathToRootFolder,
		realpath: true,
	});

	const excludeRegExpEgrep = excludeRegExp.map(
		(regExp) => new RegExp(regExp.source.replace(/\\\/$/, "(\\/|$)"))
	);

	const result = fullList.filter((folderName) => {
		const isExcluded = excludeRegExpEgrep.some((regExp) =>
			regExp.test(folderName)
		);

		return !isExcluded;
	});

	return result.filter((path) => path !== ".");
}

export function listNestedEntries(
	absPathToRootFolder: string,
	includeOnlyRegExp: RegExp[]
) {
	const fullList = globSync("**", {
		cwd: absPathToRootFolder,
		realpath: true,
		nodir: true,
	});

	const result = fullList.filter((folderName) => {
		const isIncluded = includeOnlyRegExp.some((regExp) =>
			regExp.test(folderName)
		);

		return isIncluded;
	});

	return result.filter((path) => path !== ".");
}
