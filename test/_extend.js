var extend = Coool.extend;
var deps = Coool._deps;

var createFakeClass = function() {
    var Class = function() {};
    Class.extend = extend;

    return Class;
};

var Class = createFakeClass();

QUnit.module("extend", {

    setup : function() {
        sinon.spy(deps, "extend");
    },
    teardown : function() {
        deps.extend.restore();
    }
});


test("should be possible to extend", function() {
    var Child = Class.extend({ attr : 42, otherAttr : "other", method : sinon.stub().returns("result") });
    var child = new Child();

    assert.property(child, "attr");
    assert.property(child, "method");

    assert.strictEqual(child.attr, 42);
    assert.strictEqual(child.method(), "result");
});

test("should be possible to extend() extended Class", function() {
    var Child = Class.extend({ attr : 42, otherAttr : "other", method : sinon.stub().returns("result") });
    var GrandChild = Child.extend({method : sinon.stub().returns("other result")});
    var grandchild = new GrandChild();

    assert.property(grandchild, "attr");
    assert.property(grandchild, "method");

    assert.strictEqual(grandchild.attr, 42);
    assert.strictEqual(grandchild.method(), "other result");
});

test("should delegate extend() to Backbone", function() {
    Class.extend({});
    assert.called(deps.extend);
});


QUnit.module("Trait.static");

test("should extend with static traits", function() {
    var Trait = {static : { Value : 42, staticMethod : sinon.stub().returns("value") } };
    var TraitClass = Class.extend({ traits : [Trait]});

    assert.strictEqual(TraitClass.Value, 42);
    assert.strictEqual(TraitClass.staticMethod(), "value");
});

test("should invoke trait's extend() method if it has one", function() {
    var Trait = {static : { extend : sinon.spy() } };

    Class.extend({ traits : [Trait]});

    assert.calledOnce(Trait.static.extend);
});

test("should call trait's extend() with parent Class as context", function() {
    var Trait = {static : { extend : sinon.spy() } };

    Class.extend({ traits : [Trait]});

    assert.calledOn(Trait.static.extend, Class);
});

test("should call trait's extend() with the same args as Backbone.Model.extend()", function() {
    var Trait = {static : { extend : sinon.spy() } };
    var spec = { blah : true, traits : [Trait]};
    var staticSpec = { x: 42, y : false};

    Class.extend(spec, staticSpec);
    var args = Trait.static.extend.firstCall.args;

    assert.equal(args[0], spec);
    assert.equal(args[1], staticSpec);
});

test("should invoke trait's extend() methods in order", function() {
    var TraitOne = { extend : sinon.spy() };
    var TraitTwo = { extend : sinon.spy() };

    Class.extend({ traits : [{ static : TraitOne}, { static : TraitTwo}]});

    assert.calledOnce(TraitOne.extend);
    assert.calledOnce(TraitTwo.extend);
    assert.ok(TraitOne.extend.calledBefore(TraitTwo.extend));
});


test("should call extend() for all trait's in inheritance hierarchy", function() {
    var TraitOne = { extend : sinon.spy() };
    var TraitTwo = { extend : sinon.spy() };
    var ChildTraitOne = { extend : sinon.spy() };
    var ChildTraitTwo = { extend : sinon.spy() };
    var GrandchildTraitOne = { extend : sinon.spy() };
    var GrandchildTraitTwo = { extend : sinon.spy() };

    var Parent = Class.extend({ traits : [{ static : TraitOne}, { static : TraitTwo}]});
    var Child = Parent.extend({ traits : [{ static : ChildTraitOne}, { static : ChildTraitTwo}]});
    Child.extend({ traits : [{ static : GrandchildTraitOne}, { static : GrandchildTraitTwo}]});


    assert.calledThrice(TraitOne.extend);
    assert.calledThrice(TraitTwo.extend);

    assert.calledTwice(ChildTraitOne.extend);
    assert.calledTwice(ChildTraitTwo.extend);

    assert.calledOnce(GrandchildTraitOne.extend);
    assert.calledOnce(GrandchildTraitTwo.extend);


    assert.ok(sinon.calledInOrder(
            TraitOne.extend,
            TraitTwo.extend,
            ChildTraitOne.extend,
            ChildTraitTwo.extend,
            GrandchildTraitOne.extend,
            GrandchildTraitTwo.extend)
    )
});

QUnit.module("Trait.override");

test("should be possible to completely override an existing method or prop", function() {
    var Trait = {override : { method : sinon.stub().returns("different result"), attr : 0 } };
    var Child = Class.extend({ attr : 42, method : sinon.stub().returns("result") });
    var Demo = Child.extend({ traits : [Trait]});

    var object = new Demo();

    assert.equal(object.attr, 0);
    assert.equal(object.method(), "different result");

});


QUnit.module("Trait.mixin", {

    setup : function() {
        sinon.spy(deps, "mixin");
    },
    teardown : function() {
        deps.mixin.restore();
    }
});

test("should delegate the mixin section to Cocktail.mixin()", function() {
    var Trait = { method : sinon.stub().returns("mixed result"), attr : 0 };
    var Demo = Class.extend({ traits : [{mixin : Trait}]});
    var args = deps.mixin.firstCall.args;

    assert.calledOnce(deps.mixin);

    assert.equal(args[0], Demo);
    assert.include(args[1], Trait);
});

test("should wrap mixed in methods", function() {
    var mixinSpy = sinon.stub().returns("mixed result");
    var extendSpy = sinon.spy();
    var Demo = Class.extend({ method : extendSpy, traits : [{ mixin : { method : mixinSpy}}]});
    var object = new Demo();

    object.method();

    assert.called(mixinSpy);
    assert.called(extendSpy);

    assert.ok(mixinSpy.calledAfter(extendSpy));
});












