var Properties = Coool.traits.Properties;
var BaseClass = Coool.Class;
var Class = BaseClass.extend({ traits : [Properties]});



var createFakeProps = function(propSpec) {
    var properties = {};

    _.each(propSpec, function(val, key) {
        properties[key] = {
            get : sinon.stub().returns(val),
            set : sinon.stub()
        }
    });

    return properties;
};

var verifyProps = function(obj, props, values) {

    _(props).each(function(prop, name) {
        // get & set
        var value = obj[name];
        obj[name] = name;

        assert.equal(value, values[name]);
        assert.called(prop.get);
        assert.calledWith(prop.set, name);
    });
};

QUnit.module("traits.Properties");


test("are auto generated from \"properties\" hash", function() {
    var props = createFakeProps({"demo" : 42, "crap" : 11});
    var Host = Class.extend({properties : props});

    verifyProps( new Host(), props, {demo : 42, crap : 11});
});


test("can be inherited", function() {
    var parentProps = createFakeProps({ notCommon : "parent", common : "still parent"});
    var childProps = createFakeProps({ notCommon : "child", young : true});
    var Parent = Class.extend({properties : parentProps});
    var Child = Parent.extend({properties : childProps});
    var child = new Child();

    var notCommon = child.notCommon;
    var common = child.common;
    var young = child.young;

    assert.equal(notCommon, "child");
    assert.equal(common, "still parent");
    assert.equal(young, true);
});

test("are configurable by default, but an be explicitly set to non configurable", function() {
    var props = { demo : {value : "demo"}, fixed : {value : "fixed", configurable : false}};
    var Host = Class.extend({properties : props});
    var obj = new Host();

    var redefineProp = function() {Object.defineProperty(obj, "demo", { value : "other"});};
    var redefineFixedProp = function() {Object.defineProperty(obj, "fixed", { value : "other"});};

    assert.doesNotThrow(redefineProp);
    assert.throws(redefineFixedProp);
});

test("are accessible from child initialize() only if super() is called", function() {
    var props = createFakeProps({ one : 1, two : 2});
    var verify = function() { this._super(); verifyProps(this, props, { one : 1, two : 2});};
    var Host = Class.extend({ initialize : verify, properties : props});


    new Host();
});

