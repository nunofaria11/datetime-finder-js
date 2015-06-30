describe("Date regular expression builder test suite", function () {
  it('addSeparator() chaining test', function () {
    var builder = new DateRegexpBuilder();
    expect(builder.addSeparator('.')).toBe(builder);
  });
  it('build() should return regular expressions array', function () {
    var regexps = new DateRegexpBuilder().match('28-08-1988');
    var regexp = eval(Object.keys(regexps)[0]);
    var matchedWords = regexps[regexp];
    delete matchedWords['index'];
    delete matchedWords['input'];
    expect(matchedWords.length).toBeGreaterThan(0);
    expect(matchedWords).toEqual(["28-08-1988", "28", "08", "1988"]);
  });
});
