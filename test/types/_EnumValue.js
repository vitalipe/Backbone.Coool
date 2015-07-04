var EnumValue = Coool.type.EnumValue;
var Model = Coool.Model;


var FlatModes = {
    COOL : 0,
    HEAT : 1,
    FAN :  2,
    UNKNOWN : -1
};

var OperationModes = {

    COOL: {
        value: "COOL",
        displayName: "Cool",
        displayNameLong: "Cooling Mode",
        temperatureRange: {min: 9, max: 30},
        order: 1
    },

    HEAT: {
        value: "HEAT",
        displayName: "Heat",
        displayNameLong: "Heating Mode",
        temperatureRange: {min: 20, max: 40},
        order: 3
    },

    FAN: {
        value: "FAN",
        displayName: "Fan",
        displayNameLong: "Fan Mode",
        temperatureRange: {min: null, max: null},
        order: 2
    },

    UNKNOWN: {
        value: "UNKNOWN",
        displayName: "Unknown",
        displayNameLong: "Unknown Mode",
        temperatureRange: {min: null, max: null},
        order: null
    }
};

var newAttr = function(AttributeClass, name) {
    return new AttributeClass(new Model(), (name || "demo"))
};


QUnit.module("type.EnumValue");


test("should be instance of Attribute", function() {
    assert.instanceOf(new EnumValue(), Coool.Attribute);
});

test("parse() should lookup from enum", function() {
    var ModeAttr = EnumValue.extend({ enum : OperationModes});
    var attr = newAttr(ModeAttr);

    assert.equal(attr.parse("COOL"), OperationModes.COOL);
    assert.equal(attr.parse("HEAT"), OperationModes.HEAT);
    assert.equal(attr.parse("UNKNOWN"), OperationModes.UNKNOWN);
});


test("parse() should return undefined when value is not found in enum", function() {
    var ModeAttr = EnumValue.extend({ enum : OperationModes});
    var attr = newAttr(ModeAttr);

    assert.equal(attr.parse("other"), undefined);
});


test("set() should work with values that are in enum", function() {
    var ModeAttr = EnumValue.extend({ enum : OperationModes});
    var attr = newAttr(ModeAttr);

    attr.set(OperationModes.HEAT);

    assert.equal(attr.get(), OperationModes.HEAT);
});


test("set() with with values that are not in enum should have no effect ", function() {
    var ModeAttr = EnumValue.extend({ enum : OperationModes, default: OperationModes.UNKNOWN});
    var attr = newAttr(ModeAttr);

    attr.set({other : "other value"});

    assert.equal(attr.get(), OperationModes.UNKNOWN);
});


test("toJSON() return only the value", function() {
    var ModeAttr = EnumValue.extend({ enum : OperationModes});
    var attr1 = newAttr(ModeAttr);
    var attr2 = newAttr(ModeAttr);

    attr1.set(OperationModes.HEAT);
    attr2.set(OperationModes.FAN);

    assert.equal(attr1.toJSON(), "HEAT");
    assert.equal(attr2.toJSON(), "FAN");
});



test("toJSON() should work with optional value param", function() {
    var ModeAttr = EnumValue.extend({ enum : OperationModes});
    var attr = newAttr(ModeAttr);

    attr.set(OperationModes.HEAT);

    assert.equal(attr.toJSON(OperationModes.FAN), "FAN");
    assert.equal(attr.toJSON(OperationModes.COOL), "COOL");
});

test("should allow default value", function() {
    var ModeAttr = EnumValue.extend({ enum : OperationModes, default : OperationModes.UNKNOWN});
    var attr = newAttr(ModeAttr);

    assert.equal(attr.get(), OperationModes.UNKNOWN);
});

test("should work with flat data", function() {
    var ModeAttr = EnumValue.extend({ enum : FlatModes, default : FlatModes.FAN});
    var attr = newAttr(ModeAttr);

    attr.set(FlatModes.COOL);

    assert.equal((newAttr(ModeAttr)).get(), FlatModes.FAN);

    assert.equal(attr.get(), FlatModes.COOL);
    assert.equal(attr.toJSON(), FlatModes.COOL);
    assert.equal(attr.toJSON(FlatModes.FAN), FlatModes.FAN);
    assert.equal(attr.parse(FlatModes.HEAT), FlatModes.HEAT);
});

test("should be possible to set valueAttribute", function() {
    var ModeAttr = EnumValue.extend({ enum : OperationModes, valueAttribute : "displayName", default : OperationModes.COOL});
    var attr = newAttr(ModeAttr);

    assert.equal(attr.toJSON(), "Cool");
    assert.equal(attr.toJSON(OperationModes.FAN), "Fan");
    assert.equal(attr.parse("Cool"), OperationModes.COOL);
    assert.equal(attr.parse("Heat"), OperationModes.HEAT);
});

