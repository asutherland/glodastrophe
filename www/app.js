// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'lib',
    paths: {
      app: '../app',
      gelam: '../../deps/gelam/js',
      mail_app_logic: '../felam',
      locales: '../locales'
    },
    scriptType: 'application/javascript;version=1.7',
    jsx: {
      fileExtension: '.jsx'
    }
});

// The explicit require on react and react-vendor-prefix is because the
// browserify-built standalone react-split-pane is not interacting correctly
// with requirejs.
requirejs(['react', 'react-vendor-prefix', 'jsx!app/main']);
