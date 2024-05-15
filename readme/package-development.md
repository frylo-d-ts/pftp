# @frylo/pftp - Package Development

### Build the package

Run

```bash
npm run build
```

### Test the package

To test package you have to manually run e2e test scripts, because there is no infra configured to test package automatically.

To run test you have to pass this preconditions:

1. You have a server that could be used to test PFTP
2. Copy file [credentials example](../test/credentials.example.js) as `test/credentials.js` and add credentials to you server to it. You also have to insert path to deploy folders here.

Then you could run test locally by hand. Before each run of test you are usually need to build this package, so I recommend this command:

```bash
pnpm build && node ./test/[nameOfText].test.js

# Example with pwd in root of project
pnpm build && node ./test/deployExcludeRegExp.test.js
```

### Check dependencies

You can check and upgrade dependencies to the latest versions, ignoring specified versions. with [npm-check-updates](https://www.npmjs.com/package/npm-check-updates):

```bash
npm run check-updates
```

You can also use `npm run check-updates:minor` to update only patch and minor.

Instead `npm run check-updates:patch` only updates patch.

### Publish

First commit the changes to GitHub. Then login to your [NPM](https://www.npmjs.com) account (If you don’t have an account you can do so on [https://www.npmjs.com/signup](https://www.npmjs.com/signup))

```bash
npm login
```

Then run publish:

```bash
npm publish
```

If you're using a scoped name use:

```bash
npm publish --access public
```

### Bumping a new version

To update the package use:

```bash
npm version patch
```

and then

```bash
npm publish
```

### Install and use the package

To use the package in a project:

```bash
npm i @frylo/pftp
```

and then in a file:

```ts
import { deploy } from "@frylo/pftp";

deploy({ /* configuration */}).then(() => process.exit())
```
