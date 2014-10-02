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

    it ("should sort tutorials by name", function() {
        var route = _.findWhere(Router.routes, {name: "tutorials"});
        spyOn(Tutorials, "find").and.returnValue({});

        var data = route.options.data();

        expect(Tutorials.find).toHaveBeenCalled();
        expect(Tutorials.find.calls.mostRecent().args[0]).toEqual({});
        expect(Tutorials.find.calls.mostRecent().args[1].sort.name).toEqual(1);
        expect(data).toEqual({tutorials: {}});
    });

});