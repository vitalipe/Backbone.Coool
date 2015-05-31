var Class = Cool.Class;


QUnit.module("Class extend", {

    setup : function() {
        sinon.spy(Backbone.Model, "extend");

        this.Child = Class.extend({ attr : 42, method : sinon.stub().returns("result") });
    },
    teardown : function() {
        Backbone.Model.extend.restore();
    }
});


test("should be possible to instantiate", function() {
    assert.instanceOf(new Class(), Class);
});


test("should be possible to extend", function() {
    var child = new this.Child();

    assert.property(child, "attr");
    assert.property(child, "method");

    assert.strictEqual(child.attr, 42);
    assert.strictEqual(child.method(), "result");
});

test("should be possible to extend() extended Class", function() {
    var GrandChild = this.Child.extend({method : sinon.stub().returns("other result")});
    var grandchild = new GrandChild();

    assert.property(grandchild, "attr");
    assert.property(grandchild, "method");

    assert.strictEqual(grandchild.attr, 42);
    assert.strictEqual(grandchild.method(), "other result");
});

test("should delegate extend() to Backbone", function() {
    Class.extend({});
    assert.called(Backbone.Model.extend);
});




QUnit.module("Class");

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
