var type = Coool.type;
var Model = Coool.Model;



var setAndVerifyEqual = function(attr, val, expected) {
    if (_.isUndefined(expected))
        expected = val;

    attr.set(val);
    assert.equal(attr.get(), expected);
};

var setAndVerifyThrows = function(attr, val) {
    var throws = function() { attr.set(val)};

    assert.throws(throws, Error);
};

QUnit.module("type.String");


test("should be an instance of Attribute", function() {
    assert.instanceOf(new type.String(), Coool.Attribute);
});

test("should accept string values", function() {
    var attr = new type.String(new Model(), "demo");

    setAndVerifyEqual(attr, "blah");
    setAndVerifyEqual(attr, "");
    setAndVerifyEqual(attr, "MOO");
});

test("should reject non string values", function() {
    var attr = new type.String(new Model(), "demo");

    setAndVerifyThrows(attr, 0);
    setAndVerifyThrows(attr, false);
    setAndVerifyThrows(attr, {});
    setAndVerifyThrows(attr, []);
    setAndVerifyThrows(attr, null);
    setAndVerifyThrows(attr, undefined);
});


test("should parse() as a string", function() {
    var attr = new type.String(new Model(), "demo");

    assert.equal(attr.parse(""), "");
    assert.equal(attr.parse("x"), "x");
    assert.equal(attr.parse(7), "7");
    assert.equal(attr.parse(false), "false");
    assert.equal(attr.parse(undefined), "undefined");
    assert.equal(attr.parse(null), "null");
});

