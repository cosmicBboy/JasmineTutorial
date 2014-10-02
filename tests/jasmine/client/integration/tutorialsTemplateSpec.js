describe("Tutorials template", function() {
  var div;
  beforeEach(function() {
      div = document.createElement("DIV");
  })

  it("should show a list of tutorials when there are some available", function () {
    var data = {tutorials: [{}, {}]};
    data.tutorials.count = function() { return 2; };

    Blaze.renderWithData(Template.tutorials, data, div);

    expect($(div).find(".tutorialLine").length).toEqual(2);
  });

  it("should show a warning when no tutorials are available", function () {
    Blaze.renderWithData(Template.tutorials, {tutorials: {count: function() { return 0; }}}, div);


    expect($(div).find("#noTutorialsWarning")[0]).toBeDefined();
  });

  it("should sort tutorials by name", function() {
    var route = _.findWhere(Router.routes, {name: "tutorials"});
    spyOn(Tutorials, "find").and.returnValue({});

    var data = route.options.data();

    expect(Tutorials.find).toHaveBeenCalled();
    expect(Tutorials.find.calls.mostRecent().args[0]).toEqual({});
    expect(Tutorials.find.calls.mostRecent().args[1].sort.name).toEqual(1);
    expect(data).toEqual({tutorials: {}});
  });

  it("should show create, modify and delete button to admin user", function() {
    spyOn(Blaze._globalHelpers, 'isInRole').and.returnValue(true);

    var data = {tutorials: [{currentCapacity: 0}, {currentCapacity: 0}]};
    data.tutorials.count = function() { return 2; };

    Blaze.renderWithData(Template.tutorials, data, div);

    console.log(div.innerHTML);

    expect($(div).find("#createTutorial")[0]).toBeDefined();
    expect($(div).find(".modifyTutorial").length).toEqual(2);
    expect($(div).find(".removeTutorial").length).toEqual(2);
  });

  it("should not show create, modify and delete button to non-admin user", function() {
    spyOn(Blaze._globalHelpers, "isInRole").and.returnValue(false);

    var data = {tutorials: [{}, {}] };
    data.tutorials.count = function() { return 2; };

    Blaze.renderWithData(Template.tutorials, data, div);

    expect($(div).find("#createTutorial")[0]).not.toBeDefined();
    expect($(div).find(".modifyTutorial")[0]).not.toBeDefined();
    expect($(div).find(".removeTutorial")[0]).not.toBeDefined();

    console.log(div.innerHTML);
  });

  it("function canDelete should return true only when tutorial has no registrations", function () {
    expect(Template.tutorials.canDelete.call({currentCapacity: 0})).toBeTruthy();
  });

  it("function canDelete should return false when there are registrations", function () {
    expect(Template.tutorials.canDelete.call({currentCapacity: 1})).toBeFalsy();
  });

  it("function canRegister should return true when capacity is available and student is not yet registered", function () {
    // stub values called with accessor "this.currentCapacity"
    spyOn(TutorialRegistrations, "find").and.returnValue({count: function() { return 0; }});
    expect(Template.tutorials.canRegister.call({currentCapacity: 1, capacity: 2})).toBeTruthy();
  });

  it("function canRegister should return false when reached capacity is available and student is not yet registered", function () {
    expect(Template.tutorials.canRegister.call({currentCapacity: 2, capacity: 2})).toBeFalsy();

    spyOn(TutorialRegistrations, "find").and.returnValue({count: function() { return 1; }});
    expect(Template.tutorials.canRegister.call({currentCapacity: 1, capacity: 2})).toBeFalsy();
  });

  it("should be able to register for tutorial by clicking on the '.registerForTutorial' button", function () {
    var data = new Tutorial(null, "Tutorial 1", 10);

    spyOn(data, "registerStudent");
    spyOn(Blaze, "getData").and.returnValue(data);

    Template.tutorials.__eventMaps[0]["click .registerForTutorial"].call({templateInstance: function() {}}, {preventDefault : function() {}});

    expect(data.registerStudent).toHaveBeenCalled();

  });

});