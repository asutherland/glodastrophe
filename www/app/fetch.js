define(function(require) {

/**
 * Fetch the contents of a URL.
 *
 * Return a promise that is resolved
 */
function fetch(url, responseType) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.responseType = responseType;
    req.addEventListener('load', function() {
      if (req.status == 200)
        resolve(req.response);
      else
        reject(req.status);
    }, false);
    req.addEventListener('timeout', function() {
      reject('timeout');
    });
    req.timeout = 30 * 1000;
    req.send(null);
  });
}

/**
 * Fetch the contents of a URL that contain a list of newline delimited JSON
 * strings.
 *
 * Returns a promise that is resolved with an array of the JSON.parse()d
 * objects and rejected if a network failure occurs.  Parse problems are
 * silently ignored since it's possible for the last entry in a log to be
 * partial and there may be weird writes in there if logging was done in some
 * hacky fashion.
 */
function fetchJsons(url) {
  return fetch(url, 'text').then(function(bigString) {
    var jsonStrings = bigString.split(/[\r\n]+/g);
    var objs = [];
    for (var i = 0; i < jsonStrings.length; i++) {
      try {
        objs.push(JSON.parse(jsonStrings[i]));
      }
      catch (ex) {
      }
    }
    return objs;
  });
}

return {
  fetch: fetch,
  fetchJsons: fetchJsons
};

}); // end define
