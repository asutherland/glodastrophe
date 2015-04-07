// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'lib',
    paths: {
        app: '../app',
        gelam: '../../deps/gelam/js',
        locales: '../locales'
    },
    scriptType: 'application/javascript;version=1.7',
    jsx: {
      fileExtension: '.jsx'
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['jsx!app/main']);
