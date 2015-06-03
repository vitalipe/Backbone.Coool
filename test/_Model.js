var Model = Coool.Model;


QUnit.module("Model");

test("should be an instance of Backbone.Model", function() {
   var model = new Model();

    assert.instanceOf(model, Backbone.Model);
});

test("should expose Coool.extend()", function() {
    assert.equal(Model.extend, Coool.extend);
});