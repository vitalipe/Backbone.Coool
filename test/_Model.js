var Model = Cool.Model;


QUnit.module("Model");

test("Model is instance of Backbone.Model", function() {
   var model = new Model();

    assert.instanceOf(model, Backbone.Model);
});