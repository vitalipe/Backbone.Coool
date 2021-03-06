var type = Coool.type;
var Model = Coool.Model;


var setAndVerifyEqual = function(attr, val, expected) {
    if (_.isUndefined(expected))
        expected = val;

    attr.set(val);
    assert.equal(attr.get(), expected);
};


var setAndVerifyCloseTo = function(attr, val) {
    attr.set(val);
    assert.closeTo(attr.get(), val, 0.001);
};

var verifyNaN = function(val) {
    assert.isTrue(_.isNaN(val));
};


var setAndVerifyThrows = function(attr, val) {
    var throws = function() { attr.set(val)};

    assert.throws(throws, Error);
};



QUnit.module("type.Number");


test("should be  instance of Attribute", function() {
    assert.instanceOf(new type.Number(), Coool.Attribute);
});

test("should accept integers", function() {
    var attr = new type.Number(new Model, "crap");

    setAndVerifyEqual(attr, 0);
    setAndVerifyEqual(attr, 1);
    setAndVerifyEqual(attr, 42);
    setAndVerifyEqual(attr, -200);

});

test("should accept floats", function() {
    var attr = new type.Number(new Model, "crap");

    setAndVerifyCloseTo(attr, 0.1);
    setAndVerifyCloseTo(attr, 0.5);
    setAndVerifyCloseTo(attr, -0.5);
});

test("should accept NaN", function() {
    var attr = new type.Number(new Model, "crap");

    attr.set(NaN);
    verifyNaN(attr.get())
});

test("should accept positive and negative infinity", function() {
    var attr = new type.Number(new Model, "crap");

    setAndVerifyEqual(attr, Number.POSITIVE_INFINITY);
    setAndVerifyEqual(attr, Number.NEGATIVE_INFINITY);
});


test("should reject non-number values", function() {
    var attr = new type.Number(new Model(), "demo");

    setAndVerifyThrows(attr, "1");
    setAndVerifyThrows(attr, false);
    setAndVerifyThrows(attr, {});
    setAndVerifyThrows(attr, []);
    setAndVerifyThrows(attr, null);
    setAndVerifyThrows(attr, undefined);
});

test("should parse() numeric strings as numbers", function() {
    var attr = new type.Number(new Model, "crap");

    assert.equal(attr.parse("42"), 42);
    assert.equal(attr.parse("-42"), -42);
    assert.equal(attr.parse("0"), 0);
    assert.equal(attr.parse("+0"), 0);

    assert.closeTo(attr.parse("0.5"), 0.5, 0.001);
    assert.closeTo(attr.parse("-0.1"), -0.1, 0.001);
});

test("should parse() non-numeric strings as NaN", function() {
    var attr = new type.Number(new Model, "crap");

    verifyNaN(attr.parse("blah blah"));
    verifyNaN(attr.parse("b1"));
    verifyNaN(attr.parse("123c"));
    verifyNaN(attr.parse("NaN"));
    verifyNaN(attr.parse("true"));
});


test("should parse() Boolean, Arrays, undefined, {}, null and NaN as NaN", function() {
    var attr = new type.Number(new Model, "crap");

    verifyNaN(attr.parse(false));
    verifyNaN(attr.parse(true));
    verifyNaN(attr.parse([]));
    verifyNaN(attr.parse({}));
    verifyNaN(attr.parse([1,2,3]));
    verifyNaN(attr.parse(undefined));
    verifyNaN(attr.parse(null));
    verifyNaN(attr.parse(NaN));
});

test("parse() should always clamp values", function() {
    var Attr = type.Number({ min : 0, max : 42});
    var attr = new Attr(new Model, "crap");

    assert.equal(attr.parse(1000), 42);
    assert.equal(attr.parse(-1000), 0);
    assert.equal(attr.parse("1000"), 42);
    assert.equal(attr.parse("-1000"), 0);
});


test("should clamp on set() when alwaysClamp is true", function() {
    var Attr = type.Number({ alwaysClamp : true, min : 0, max : 100});
    var attr = new Attr(new Model, "crap");

    setAndVerifyEqual(attr, 99999, 100);
    setAndVerifyEqual(attr, -99999, 0);
    setAndVerifyEqual(attr, 42, 42);
});

test("should not clamp on set() when alwaysClamp is false", function() {
    var Attr = type.Number({ alwaysClamp : false, min : 0, max : 100});
    var attr = new Attr(new Model, "crap");

    setAndVerifyEqual(attr, 99999);
    setAndVerifyEqual(attr, -99999);
    setAndVerifyEqual(attr, 42);
});

test("should clamp when calling toJSON()", function() {
    var Attr = type.Number({ alwaysClamp : false, min : 0, max : 10});
    var attr = new Attr(new Model, "crap");

    attr.set(-100);
    assert.equal(attr.toJSON(), 0);

    attr.set(1000);
    assert.equal(attr.toJSON(), 10);
});
