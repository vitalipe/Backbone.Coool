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



test("should be possible to set default value", function() {
    var Fake = Attribute.extend({ default : "default value"});
    var attr = new Fake(new Model(), "attr");

    assert.equal(attr.get(), "default value");
});



