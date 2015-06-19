var AttributeGuard = Coool.traits.AttributeGuard;
var Model = Coool.Model.extend({ traits : [AttributeGuard] });


QUnit.module("traits.AttributeGuard");


test("should throw error if trying to set() non-existent attribute", function() {
    var model = new Model();

    assert.throws(function() { model.set("some", 42)});
});

test("should throw error if trying to get() non-existent attribute", function() {
    var model = new Model();

    assert.throws(function() { model.get("some")});
});

test("should not throw if trying to get()/set() existent attribute", function() {
    var Fake = Model.extend({ defaults : {my : 22}});
    var model = new Fake();

    assert.doesNotThrow(function() { model.get("my")});
    assert.doesNotThrow(function() { model.set("my", 42)});

});