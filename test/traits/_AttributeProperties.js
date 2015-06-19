var AttributeProperties = Coool.traits.AttributeProperties;
var Model = Coool.Model;


QUnit.module("traits.AttributeProperties");

test("dynamic getters & setters are generated from \"defaults\" ", function() {
    var getter = sinon.spy(function(key, options) { return this._super(key, options)});
    var setter = sinon.spy(function(key, val, options) { return this._super(key, val, options)});
    var Host = Model.extend({ get : getter, set : setter, defaults : { one : 1, two : 2}, traits : [AttributeProperties]});
    var obj = new Host();


    getter.reset();
    setter.reset();

    var one = obj.one;
    var two = obj.two;

    obj.one = "one";
    obj.two = "two";

    assert.equal(one, 1);
    assert.equal(two, 2);

    assert.calledWith(getter, "one");
    assert.calledWith(getter, "two");

    assert.calledWith(setter, "one", "one");
    assert.calledWith(setter, "two", "two");
});
