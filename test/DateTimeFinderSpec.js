describe("Date-time finder", function () {

  it('multiple matcher should match', function () {
    var regExp1 = /\d{2,4}-\d{2,4}-\d{2,4}/;
    var regExp2 = /\d{2,4}\/\d{2,4}\/\d{2,4}/;
    var expressions = [
      regExp1, regExp2
    ];
    expect(matchMultipleRegExps("28-08-1988", expressions)).toEqual(regExp1);
  });
  // TODO: merge configurations
});
