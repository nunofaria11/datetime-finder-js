describe("Date-time finder test suite", function () {
  it('configurations should get merged', function () {
    var config = {
      one: 1,
      two: 2
    };
    expect(new DateFinder()._mergeConfigurations(config)).toEqual({
      visibleOnly: true,
      one: 1,
      two: 2
    });
  });
});
