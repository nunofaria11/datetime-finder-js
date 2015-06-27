/**
 * DateFinder constructor
 */
function DateFinder() {
  // constructor
  this.dateRegExps = [];
  var dateSeparators = ["-", "\\/", "\\\s"],
    separator;
  for (separator in dateSeparators) {
    var expr = "/\\\d{2,4}" + dateSeparators[separator] + "\\\d{2,4}" + dateSeparators[separator] + "\\\d{2,4}/";
    this.dateRegExps.push(eval(expr));
  }
  this.defaultConfiguration = {
    visibleOnly: true
  };
  /**
   * Merge configurations and return a new configuration object
   * @param  {json} mainConfiguration
   * @param  {json} outerConfiguration
   * @return {json} configuration new configuration object
   */
  this.mergeConfigurations = function (mainConfiguration, outerConfiguration) {
    var k, result = {};
    for (k in mainConfiguration) {
      result[k] = outerConfiguration[k];
    }
    for (k in outerConfiguration) {
      result[k] = outerConfiguration[k];
    }
    return result;
  };
  this.domVisitor = function (element, functor) {
    if (element) {
      functor(element);
      for (var i = 0; i < element.childNodes.length; i++) {
        this.domVisitor(element.childNodes[i], functor);
      }
    }
  };
}

/**
 * Finds references to dates
 * @param  {string} elementSelector
 * @param  {json}   outerConfiguration optional
 * @return {array}  Array of dates found
 */
DateFinder.prototype.findDates = function (elementSelector, outerConfiguration) {
  var config;
  if (outerConfiguration !== undefined) {
    config = this.mergeConfigurations(this.defaultConfiguration, outerConfiguration);
  } else {
    config = this.defaultConfiguration;
  }
  if (elementSelector === undefined || !elementSelector.trim()) {
    elementSelector = 'body';
  }
  if (config['visibleOnly'] || config['visibleOnly'] === undefined) {
    // TODO: unsupported 'visibleOnly' options
  }
  var parentNode = document.querySelector(elementSelector),
    nodeDateMap = {},
    regExps = this.dateRegExps,
    text, match;
  var f = function (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      text = node.textContent;
      for (var i in regExps) {
        var regexp = regExps[i];
        if (regexp.test(text)) {
          // is a date
          match = text.match(regexp);
          if (nodeDateMap[node] === undefined) {
            nodeDateMap[node] = [];
          }
          nodeDateMap[node].push(match);
        }
      }
    }
    //console.log(node.textContent);
  };
  this.domVisitor(parentNode, f);
  return nodeDateMap;
}
