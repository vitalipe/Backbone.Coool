var Collection = Coool.Collection;


QUnit.module("Collection");

test("should be an instance of Backbone.Collection", function() {
   var collection = new Collection();

    assert.instanceOf(collection, Backbone.Collection);
});

test("should expose Coool.extend()", function() {
    assert.equal(Collection.extend, Coool.extend);
});