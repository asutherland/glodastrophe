{
    "appDir": "../www",
    "baseUrl": "lib",
    "paths": {
        "app": "../app",
        "jsx": "../../tools/jsx",
        "JSXTransformer": "../../tools/JSXTransformer-0.11.1",
        "text": "../../tools/text"
    },
    "dir": "../www-built",
    "stubModule": ["jsx"],
    "modules": [
        {
            "name": "app",
            "exclude": ["JSXTransformer", "text"]
        }
    ],
    "jsx": {
      "fileExtension": ".jsx"
    },
    "fileExclusionRegExp": /(?:^\.)|(?:.+~$)/,
    "optimize": "uglify2",

}
