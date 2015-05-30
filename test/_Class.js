var Class = Cool.Class;


QUnit.module("Class");


test("should be possible to instantiate", function() {
    assert.instanceOf(new Class(), Class);
});


test("should be possible to extend", function() {
    var ChildClass = Class.extend({ attr : 42, method : function() { return "result"}});
    var child = new ChildClass();

    assert.property(child, "attr");
    assert.property(child, "method");

    assert.strictEqual(child.attr, 42);
    assert.strictEqual(child.method(), "result");
});


test("should invoke initialize() on instantiation", function() {
    var spy = sinon.spy();
    var Child = Class.extend({  initialize : spy });

    new Child();

    assert.called(spy);
});
