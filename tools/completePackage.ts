import { copyFile, readdir } from 'node:fs/promises';
import { readFileAsText, src, writeFileAsText, parsePackageJson } from './shared';

const packageExtension = {
  main: './cjs/index.js',
  module: './esm/index.js',
  types: './types/index.d.ts',
  exports: {
    '.': {
      types: './types/index.d.ts',
      node: './cjs/index.js',
      require: './cjs/index.js',
      default: './esm/index.js',
    },
    './package.json': './package.json',
  },
};

Promise.all([
  readFileAsText('.gitignore'),
  readFileAsText('.npmignore'),
])
  .then((fileLists) => fileLists
    .flatMap((fileList) => fileList.split(/\s*\n+\s*/))
    .filter((item) => !/^#/.test(item)),
  )
  .then((ignoredFilesList) => ignoredFilesList.map(source => {
    return new RegExp(`^${source.replace(/\*/g, '.+?')}$`);
  }))
  .then((filter) => readdir(src('.')).then((workingDirFiles) => {
    return workingDirFiles.filter((file) => {
      return !filter.some((ignore) => ignore.test(file));
    });
  }))
  .then((filesForCopy) => Promise.all(filesForCopy.map(file => {
    return copyFile(src(file), src(`./dist/${file}`));
  })))
  .then(() => parsePackageJson(`./dist/package.json`))
  .then((packageJson) => {
    delete packageJson.scripts;

    return {
      ...packageJson,
      ...packageExtension,
    };
  })
  .then((updatedPackage) => JSON.stringify(updatedPackage, null, 2))
  .then((jsonFile) => writeFileAsText(`./dist/package.json`, jsonFile))
  .then(
    () => console.log('SUCCESS'),
    (err) => {
      console.error('FAILED');
      console.error(err);
    },
  );
