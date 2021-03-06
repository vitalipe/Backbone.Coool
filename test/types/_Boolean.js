var Model = Coool.Model;


QUnit.module("type.Boolean");


test("should be instance of Attribute", function() {
    assert.instanceOf(new Coool.type.Boolean(), Coool.Attribute);
});

test("should accept true/false", function() {
    var attr = new Coool.type.Boolean(new Model(), "fake");

    attr.set(true);
    assert.isTrue(attr.get());

    attr.set(false);
    assert.isFalse(attr.get());
});


test("should correctly parse() 'true' and 'false' ", function() {
    var attr = new Coool.type.Boolean();

    assert.isTrue(attr.parse("true"));
    assert.isFalse(attr.parse("false"));
});


test("should use case insensitive parse()", function() {
    var attr = new Coool.type.Boolean();

    assert.isTrue(attr.parse("True"));
    assert.isTrue(attr.parse("TRUE"));
    assert.isTrue(attr.parse("TrUe"));

    assert.isFalse(attr.parse("False"));
    assert.isFalse(attr.parse("FALSE"));
    assert.isFalse(attr.parse("FaLse"));
});


test("should parse() 0, -0, and return false ", function() {
    var attr = new Coool.type.Boolean();

    assert.isFalse(attr.parse(0));
    assert.isFalse(attr.parse("0"));
    assert.isFalse(attr.parse("-0"));
    assert.isFalse(attr.parse("+0"));
});



test("should parse() null, and return false ", function() {
    var attr = new Coool.type.Boolean();

    assert.isFalse(attr.parse(null));
    assert.isFalse(attr.parse("null"));
});



test("should parse() undefined, and return false ", function() {
    var attr = new Coool.type.Boolean();

    assert.isFalse(attr.parse(undefined));
    assert.isFalse(attr.parse("undefined"));
});


test("should parse() NaN, and return false ", function() {
    var attr = new Coool.type.Boolean();

    assert.isFalse(attr.parse(NaN));
    assert.isFalse(attr.parse("NaN"));
});


test("should parse() \"\", and return false ", function() {
    var attr = new Coool.type.Boolean();

    assert.isFalse(attr.parse(""));
});


test("should parse() \"1\", as true ", function() {
    var attr = new Coool.type.Boolean();

    assert.isTrue(attr.parse("1"));
});


test("should throw error when calling set() with a non boolean value", function() {
    var Attr = Coool.type.Boolean({default : false});
    var attr = new Attr(new Model(), "crap");
    var throwOnInvalidCallToSet = function() { attr.set(1)};


    assert.throws(throwOnInvalidCallToSet, Error);
});
