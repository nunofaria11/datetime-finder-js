(function (context, undefined) {
  /**
   * Constructor for DateRegexpBuilder
   * @param {array} separators
   */
  function DateRegexpBuilder(separators) {
    if (separators === undefined) {
      separators = ["-", "\\/", "\\\s"];
    }
    this.separators = separators;
  };

  DateRegexpBuilder.prototype = {
    /**
     * Build regexps based on the separators the object currently contains
     * @return {array} array of regexps
     */
    build: function () {
      var i, separator, regexps = [];
      for (i in this.separators) {
        separator = this.separators[i];
        var expr = "/(\\\d{2,4})" + separator + "(\\\d{2,4})" + separator + "(\\\d{2,4})/";
        regexps.push(eval(expr));
      }
      return regexps;
    },
    /**
     * Adds a separator to the object instance
     * @param {[type]} separator [description]
     * @return {DateRegexpBuilder} for chaining
     */
    addSeparator: function (separator) {
      if (this.separators.indexOf(separator) === -1) {
        this.separators.push(separator);
      }
      return this;
    },
    /**
     * Returns the all regular-expression that matched the text
     * @param  {String} text Text to match
     * @return {map} map regexp - all matches
     */
    match: function (text) {
      var i, re,
        regExps = this.build(),
        map = {};
      if (regExps !== undefined) {
        for (i in regExps) {
          re = regExps[i];
          if (re.test(text)) {
            map[re] = text.match(re);
          }
        }
      }
      return map;
    }
  };

  /**
   * Method to extract a date from a string value
   * @param  {string} value String value containing date
   * @return {Date}         returns a date if it can find one; undefined if not
   */
  function dateIsValid(value) {
    var year, month, day,
      regexBuilder = new DateRegexpBuilder(),
      matches = regexBuilder.match(value);

    return new Date(year, month, day);
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
    this.defaultConfiguration = {
      visibleOnly: true
    };
  };
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
        text, match, matchedText;
      // functor for node filter
      var _nodeFilter = function (node) {
        return node.nodeType === Node.TEXT_NODE;
      };
      // functor for node action
      var _nodeFunctor = function (node) {
          var text = node.textContent,
            matchedRegexp,
            matchedRegexps = new DateRegexpBuilder()
            .build()
            .match(text);
          if (matchedRegexps !== undefined && matchedRegexps.length > 0) {
            matchedRegex = matchedRegexps[0];
            if (matchedRegex !== undefined) { // is a date
              var match = text.match(matchedRegex);
              addToNodeMap(node, match, nodeDateMap);
            }
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
  context.DateRegexpBuilder = DateRegexpBuilder;
  /* test begin */
  // ---
  /* test end */
})(window);
