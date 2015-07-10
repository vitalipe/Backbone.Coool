var Tuple = Coool.type.Tuple;
var Model = Coool.Model;


var setAndVerifyDeepEqual = function(attr, val, expected) {
    if (_.isUndefined(expected))
        expected = val;

    attr.set(val);
    assert.deepEqual(attr.get(), expected);
};

var setAndVerifyThrows = function(attr, val) {
    var throws = function() { attr.set(val)};

    assert.throws(throws, Error);
};

var verifyIsFrozen = function(val) {
    assert.isTrue(Object.isFrozen(val));
};


QUnit.module("type.Tuple");


test("should be an instance of Attribute", function() {
    assert.instanceOf(new Tuple(), Coool.Attribute);
});


test("should accept arrays", function() {
    var attr = new Tuple(new Model(), "demo");

    setAndVerifyDeepEqual(attr, []);
    setAndVerifyDeepEqual(attr, [1,2,3]);
    setAndVerifyDeepEqual(attr, ["blah", false]);
});


test("should reject non-arrays", function() {
    var attr = new Tuple(new Model(), "demo");

    setAndVerifyThrows(attr, "");
    setAndVerifyThrows(attr, true);
    setAndVerifyThrows(attr, 123);
    setAndVerifyThrows(attr, {});
    setAndVerifyThrows(attr, { 1 : "", 5 : ""});
    setAndVerifyThrows(attr, null);
    setAndVerifyThrows(attr, undefined);
});


test("should have a frozen default value", function() {
    var attr = new Tuple(new Model(), "demo");

    verifyIsFrozen(attr.get());
});


test("custom default value should also be frozen", function() {
    var Attr = Tuple({ default : [1,2,3]});
    var attr = new Attr(new Model(), "demo");

    verifyIsFrozen(attr.get())
});


test("should return frozen values", function() {
    var attr = new Tuple(new Model(), "demo");

    attr.set([1,2,3]);
    verifyIsFrozen(attr.get())
});


test("should not freeze the original value", function() {
    var attr = new Tuple(new Model(), "demo");
    var val = [1,2];

    attr.set(val);
    assert.isFalse(Object.isFrozen(val));
});


test("should parse() array like strings into a frozen array", function() {
    var attr = new Tuple(new Model(), "demo");

    assert.deepEqual(attr.parse("[]"), []);
    assert.deepEqual(attr.parse("[1, 2, null]"), [1,2, null]);
    assert.deepEqual(attr.parse("[true, false, \"green\"]"), [true, false, "green"]);

    verifyIsFrozen(attr.parse("[]"));
    verifyIsFrozen(attr.parse("[1, 2, null]"));
    verifyIsFrozen(attr.parse("[true, false, \"green\"]"));
});


test("should parse() array values, and return a frozen array", function() {
    var attr = new Tuple(new Model(), "demo");

    assert.deepEqual(attr.parse([]), []);
    assert.deepEqual(attr.parse([1, 2, null]), [1,2, null]);
    assert.deepEqual(attr.parse([true, false, "green"]), [true, false, "green"]);

    verifyIsFrozen(attr.parse([]));
    verifyIsFrozen(attr.parse([1, 2, null]));
    verifyIsFrozen(attr.parse([true, false, "green"]));
});


test("should parse() invalid strings and other types, and return a frozen empty array", function() {
    var attr = new Tuple(new Model(), "demo");

    assert.deepEqual(attr.parse(""), []);
    assert.deepEqual(attr.parse(1), []);
    assert.deepEqual(attr.parse("1,2"), []);
    assert.deepEqual(attr.parse(true), []);
    assert.deepEqual(attr.parse(null), []);

    verifyIsFrozen(attr.parse(""));
    verifyIsFrozen(attr.parse(1));
    verifyIsFrozen(attr.parse("1,2"));
    verifyIsFrozen(attr.parse(true));
    verifyIsFrozen(attr.parse(null));

});


test("should trigger change events when changed", function() {
    var spy = sinon.spy();
    var model = new Model();
    var attr = new Tuple(model, "demo");

    model.on("change", spy);
    model.on("change:demo", spy);

    attr.set([1,2,3,4]);

    assert.calledTwice(spy);
});


test("should not trigger change events when nothing is changed", function() {
    var Attr = Tuple.defaultsTo([1,2]);
    var spy = sinon.spy();
    var model = new Model();
    var attr = new Attr(model, "demo");

    model.on("change", spy);

    attr.set(attr.get());
    attr.set([1,2]);

    assert.notCalled(spy);
});
