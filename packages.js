var fs = require('fs');

// start build
const args = process.argv[2];

if (!['start', 'build'].includes(args)) {
  console.log('Please enter start or build.');
  return;
}

const map = {
  sheetForCore: {
    path: './packages/sheet-core/package.json',
    dev: {
      types: 'lib/index.ts',
      main: 'lib/index.ts',
    },
    runtime: {
      types: 'dist/index.d.ts',
      main: 'dist/index.js',
    },
  },
  sheetForReact: {
    path: './packages/sheet-for-react/package.json',
    dev: {
      types: 'packages/index.tsx',
      main: 'packages/index.tsx',
    },
    runtime: {
      types: 'dist/index.d.ts',
      main: 'dist/index.js',
    },
  },
};

Object.values(map).forEach((package) => {
  const file = fs.readFileSync(package.path, {
    encoding: 'utf-8',
  });
  const changes = args === 'start' ? package.dev : package.runtime;
  const targetFile = JSON.parse(file);

  Object.entries(changes).forEach(([key, value]) => {
    targetFile[key] = value;
  });
  fs.writeFileSync(package.path, JSON.stringify(targetFile, undefined, '  '));
});
