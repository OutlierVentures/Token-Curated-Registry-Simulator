# TCR Simulator Backend

[![Build Status](https://travis-ci.com/TCR-Simulator/TCR-Backend.svg?branch=master)](https://travis-ci.com/TCR-Simulator/TCR-Backend)

### Installing dependencies

```
$ npm install
```

### Running a development server

```
$ npm start
```

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
