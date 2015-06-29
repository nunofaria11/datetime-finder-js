(function (context, undefined) {

  function validDate(dateValue) {

  }

  function matchMultipleRegExps(text, regExps) {
    var i, regexp;
    for (i in regExps) {
      regexp = regExps[i];
      if (regexp.test(text)) {
        return regexp; // return the 1st regexp that matched
      }
    }
  }

  function addToNodeMap(node, date, nodeMap) {
    if (nodeMap[date] === undefined) {
      nodeMap[date] = [];
    }
    nodeMap[date].push(node);
  }

  function applyTransformer(node, tranform) {
    // http://stackoverflow.com/questions/1835903/how-do-to-wrap-a-span-around-a-section-of-text-without-using-jquery
  }

  /**
   * DOM visitor implementation
   * @param {DOM object} parentElement parentElement document parent element to start DOM tree traversal
   * @param {function}   functor       executable function on each node
   * @param {function}   nodeFilter    boolean functor
   */
  function DomVisitor(parentElement, functor, nodeFilter) {
    if (parentElement === undefined) {
      parentElement = document.querySelector('body');
    }
    this.parentElement = parentElement;
    this.functor = functor;
    this.nodeFilter = nodeFilter;
  }
  DomVisitor.prototype.visit = function (node) {
    if (node === undefined) node = this.parentElement;
    if (node !== undefined && (this.nodeFilter === undefined || (this.nodeFilter !== undefined && this.nodeFilter(node)))) {
      this.functor(node);
    }
    // recursive call
    for (var i = 0; i < node.childNodes.length; i++) {
      this.visit(node.childNodes[i]);
    }
  };

  /**
   * DateFinder constructor
   */
  function DateFinder() {
    this.dateRegExps = [];
    var dateSeparators = ["-", "\\/", "\\\s"],
      separator;
    // join regexps with multiple separators (-, / and whitespace)
    for (separator in dateSeparators) {
      var expr = "/\\\d{2,4}" + dateSeparators[separator] + "\\\d{2,4}" + dateSeparators[separator] + "\\\d{2,4}/";
      this.dateRegExps.push(eval(expr));
    }
    this.defaultConfiguration = {
      visibleOnly: true
    };
  }

  DateFinder.prototype = {
    /**
     * Finds references to dates
     * @param  {string} elementSelector
     * @param  {json}   outerConfiguration optional
     * @return {array}  Array of dates found
     */
    findDates: function (elementSelector, outerConfiguration) {
      var config = this._mergeConfigurations(outerConfiguration);
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
      // functor for node filter
      var _nodeFilter = function (node) {
        return node.nodeType === Node.TEXT_NODE;
      };
      // functor for node action
      var _nodeFunctor = function (node) {
          var text = node.textContent;
          var matchedRegex = matchMultipleRegExps(text, regExps); // regExps closure
          if (matchedRegex !== undefined) { // is a date
            var match = text.match(matchedRegex);
            addToNodeMap(node, match, nodeDateMap);
          }
        }
        // spawn and run a DomVisitor
      new DomVisitor(parentNode, _nodeFunctor, _nodeFilter)
        .visit();
      return nodeDateMap;
    },
    /**
     * Merge configurations to default configurations
     * @param  {map} configuration Outer configurations
     */
    _mergeConfigurations: function (configuration) {
      if (this.defaultConfiguration === undefined) {
        this.defaultConfiguration = {};
      }
      var k, result = this.defaultConfiguration;
      if (configuration !== undefined) {
        for (k in configuration) {
          this.defaultConfiguration[k] = configuration[k];
        }
      }
      return result;
    }
  };

  context.DateFinder = DateFinder;
  /* test begin */
  context.matchMultipleRegExps = matchMultipleRegExps;
  /* test end */
})(window);
