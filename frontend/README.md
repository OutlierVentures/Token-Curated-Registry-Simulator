# TCR Simulator Webpage

[![Build Status](https://travis-ci.com/TCR-Simulator/TCR-Webpage.svg?branch=master)](https://travis-ci.com/TCR-Simulator/TCR-Webpage)

See the web page in action here: https://tcr-simulator.github.io/

### Installing dependencies

```
$ npm install
```

### Running a development server

```
$ npm start
```

### Building for production

```
$ npm run build
```

A `build` folder will be created, containing all the generated HTML/CSS/JS.

## Contributing

### Passing Travis CI builds

#### eslint

`eslint` is the linter used to ensure consistency of code style in the project.
The following command lints the codebase. Run this before pushing to the repo to detect linter errors early!

```
$ npm run lint
```

Some `eslint` errors are fixable by this command:

```
$ npm run lint -- --fix
```

#### Tests

Travis CI is set up to test the project as follows, and the build won't pass if this doesn't pass.

```
$ npm test
```
