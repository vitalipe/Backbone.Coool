var Class = Coool.Class;
var Model = Coool.Model;
var Attribute = Coool.Attribute;


QUnit.module("Attribute");

test("instanceof Coool.Class", function() {
    assert.instanceOf(new Attribute(), Class);
});


test("should have model & name property", function() {
    var model = new Model;
    var attr = new Attribute(model, "myCustom");

    assert.equal(attr.name, "myCustom");
    assert.equal(attr.model, model);
});


test("should be synced with model.attributes", function() {
    var model = new Model;
    var attr = new Attribute(model, "myCustom");

    attr.set(42);
    assert.equal(model.attributes.myCustom, 42);

    model.attributes.myCustom = 0;
    assert.equal(attr.get(), 0);
});


test("should store value when calling set()", function() {
    var attr = new Attribute(new Model, "attr");

    attr.set(42);
    assert.equal(attr.get(), 42);


    attr.set("other");
    assert.equal(attr.get(), "other");
});


test("should trigger change events on the model", function() {
    var listener = sinon.spy();
    var attr = new Attribute(new Model(), "myCustom");


    attr.model.on("change change:myCustom", listener);
    attr.triggerChangeEvent("mooo");

    assert.isTrue(listener.calledTwice);
    assert.isTrue(listener.calledWithExactly(attr.model));
    assert.isTrue(listener.calledWithExactly(attr.model, "mooo"));
});


test("should trigger change events when set()", function() {
    var listener = sinon.spy();
    var attr = new Attribute(new Model, "myCustom");

    attr.model.on("change change:myCustom", listener);
    attr.set("blah");

    assert.isTrue(listener.calledTwice);
    assert.isTrue(listener.calledWithExactly(attr.model));
    assert.isTrue(listener.calledWithExactly(attr.model, "blah"));
});

test("should not trigger any change events if {silent : true} is passed to set()", function() {
    var listener = sinon.spy();
    var attr = new Attribute(new Model, "myCustom");

    attr.model.on("change change:myCustom", listener);
    attr.set("blah", { silent : true});

    assert.notCalled(listener);
});


test("should not trigger any change events if it's the same value", function() {
    var listener = sinon.spy();
    var attr = new Attribute(new Model, "myCustom");

    attr.set("blah");
    attr.model.on("change change:myCustom", listener);

    attr.set("blah");
    attr.set("blah");

    assert.notCalled(listener);
});


test("should delegate to .isEqualTo() when checking for equality during set()", function() {
    var listener = sinon.spy();
    var isEqualTo = sinon.stub();
    var Attr = Attribute({ isEqualTo : isEqualTo});
    var attr = new Attr(new Model, "myCustom");

    attr.model.on("change:myCustom", listener);

    isEqualTo.returns(false);
    attr.set("blah");
    attr.set("blah");
    attr.set("blah");
    attr.set("blah");
    attr.set("blah");

    isEqualTo.returns(true);
    attr.set("mooo!");
    attr.set("mooo!");
    attr.set("mooo!");
    attr.set("mooo!");
    attr.set("mooo!");

    assert.callCount(listener, 5);
    assert.callCount(isEqualTo, 10);
});


test("isEqualTo() should perform simple value comparison", function() {
    var attr = new Attribute(new Model, "myCustom");

    attr.set("blah");
    assert.isTrue(attr.isEqualTo("blah"));
    assert.isFalse(attr.isEqualTo("other"));


    attr.set(1);
    assert.isTrue(attr.isEqualTo(1));
    assert.isFalse(attr.isEqualTo(2));


    attr.set({});
    assert.isTrue(attr.isEqualTo({}));
    assert.isFalse(attr.isEqualTo({ x : 4}));

});


test("isEqualTo() should perform deep value comparison", function() {
    var attr = new Attribute(new Model, "myCustom");

    attr.set([1,2,3]);
    assert.isTrue(attr.isEqualTo([1,2,3]));
    assert.isFalse(attr.isEqualTo([3,2,1]));


    attr.set({ x : 4});
    assert.isTrue(attr.isEqualTo({ x : 4}));
    assert.isFalse(attr.isEqualTo({x : 5}));
});


test("should be possible to set default value", function() {
    var Fake = Attribute.extend({ default : "default value"});
    var attr = new Fake(new Model(), "attr");

    assert.equal(attr.get(), "default value");
});

test("toJSON() should just return the current value by default", function() {
    var attr = new Attribute(new Model(), "attr");

    attr.set("other value");

    assert.equal(attr.toJSON(), "other value");
});

test("when constructor is called without new, it should extend the Attribute", function() {
    var nameSpace = { Attribute : Attribute};
    var Attr = Attribute({});
    var Other = nameSpace.Attribute({});
    var Child = Attr({});

    assert.equal(Attr.__super__, Attribute.prototype);
    assert.isFalse(Attr instanceof Attribute);

    assert.equal(Other.__super__, Attribute.prototype);
    assert.isFalse(Other instanceof Attribute);

    assert.equal(Child.__super__, Attr.prototype);
    assert.isFalse(Child instanceof Attribute);
});


