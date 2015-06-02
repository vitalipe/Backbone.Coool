var Class = Cool.Class;


QUnit.module("Class");


test("should be possible to instantiate", function() {
    assert.instanceOf(new Class(), Class);
});


test("should invoke initialize() on instantiation", function() {
    var spy = sinon.spy();
    var Child = Class.extend({  initialize : spy });

    new Child();

    assert.called(spy);
});


test("should be possible to pass args to initialize()", function() {
    var spy = sinon.spy();
    var Child = Class.extend({  initialize : spy });

    new Child(1,2,3,4);

    assert.calledWithExactly(spy, 1,2,3,4);
});
