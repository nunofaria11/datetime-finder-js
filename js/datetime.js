(function (context, undefined) {
  function mergeConfigurations(mainConfiguration, outerConfiguration) {
    var k, result = {};
    if (mainConfiguration === undefined) {
      mainConfiguration = {};
    }
    if (outerConfiguration === undefined) {
      outerConfiguration = {};
    }
    for (k in mainConfiguration) {
      result[k] = outerConfiguration[k];
    }
    for (k in outerConfiguration) {
      result[k] = outerConfiguration[k];
    }
    return result;
  }

  function domVisitor(element, functor) {
    if (element) {
      functor(element);
      for (var i = 0; i < element.childNodes.length; i++) {
        domVisitor(element.childNodes[i], functor);
      }
    }
  }

  function matchMultipleRegExps(text, regExps) {
    if (regExps === undefined) {
      throw "regExps undedined";
    }
    var i, regexp;
    for (i in regExps) {
      regexp = regExps[i];
      if (regexp.test(text)) {
        return regexp; // return the 1st regexp that matched
      }
    }
  }

  function addToNodeMap(node, match, nodeMap) {
    if (nodeMap[node] === undefined) {
      nodeMap[node] = [];
    }
    nodeMap[node].push(match);
  }


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
  }

  /**
   * Finds references to dates
   * @param  {string} elementSelector
   * @param  {json}   outerConfiguration optional
   * @return {array}  Array of dates found
   */
  DateFinder.prototype.findDates = function (elementSelector, outerConfiguration) {
    var config = mergeConfigurations(this.defaultConfiguration, outerConfiguration);
    if (elementSelector === undefined || !elementSelector.trim()) {
      elementSelector = 'body';
    }
    if (config['visibleOnly'] || config['visibleOnly'] === undefined) {
      // TODO: unsupported 'visibleOnly' options
    }
    // get parent element
    var parentNode = document.querySelector(elementSelector),
      nodeDateMap = {},
      regExps = this.dateRegExps, // closure
      text, match, matchedText;
    // functor for visitor
    var f = function (node) {
      // extract text from node (if it is a text node)
      if (node.nodeType === Node.TEXT_NODE) {
        text = node.textContent;
        // closure
        var matchedRegex = matchMultipleRegExps(text, regExps);
        if (matchedRegex !== undefined) {
          // is a date
          matchedText = text.match(matchedRegex);
          addToNodeMap(node, match, nodeDateMap);
        }
      }
      //console.log(node.textContent);
    };
    domVisitor(parentNode, f);
    return nodeDateMap;
  };
  context.DateFinder = DateFinder;

  /* test begin */
  context.matchMultipleRegExps = matchMultipleRegExps;
  /* test end */
})(window);
