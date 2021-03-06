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


test("should not crash on constructor functions that are not called with new", function() {
    var Demo = Class.extend({ constructor  : sinon.stub().returns({})});

    assert.doesNotThrow(_.bind(Demo,null));
});


test("should be possible to invoke parent method with _super()", 1, function() {
    var verifySuper = function() {assert.equal(this._super(), "parent")};
    var Parent = Class.extend({ whoAmI  : sinon.stub().returns("parent")});
    var Child = Parent.extend({ whoAmI : verifySuper});
    var obj = new Child();

    obj.whoAmI();
});


test("_super() should be relative to inheritance hierarchy, not context", function() {
    var action = sinon.spy(function() { this._super();});
    var Parent = Class.extend({ action  : action});
    var Child = Parent.extend({});
    var obj = new Child();

    obj.action();

    assert.calledOnce(action);
});

test("should have __parent__ reference to parent Class", function() {
    var Parent = Class.extend({});
    var Child = Parent.extend({});

    assert.equal(Parent.__parent__, Class);
    assert.equal(Child.__parent__, Parent);
});


QUnit.module("Trait", {

    setup : function() {
        sinon.spy(deps, "mixin");
    },
    teardown : function() {
        deps.mixin.restore();
    }
});

test("should delegate mixins to Cocktail.mixin()", function() {
    var Trait = { method : sinon.stub().returns("mixed result"), attr : 0 };
    var Demo = Class.extend({ traits : [Trait]});
    var args = deps.mixin.firstCall.args;

    assert.calledOnce(deps.mixin);

    assert.equal(args[0], Demo);
    assert.include(args[1], Trait);
});

test("should wrap mixed-in methods", function() {
    var mixinSpy = sinon.stub().returns("mixed result");
    var extendSpy = sinon.spy();
    var Demo = Class.extend({ method : extendSpy, traits : [{ method : mixinSpy}]});
    var object = new Demo();

    object.method();

    assert.called(mixinSpy);
    assert.called(extendSpy);

    assert.ok(mixinSpy.calledAfter(extendSpy));
});

QUnit.module("extend custom constructor");

test("when invoked without new, it's should have the Class as context", function() {
    var spy = sinon.spy();
    var Child = Class.extend({constructor : spy});

    Child();

    assert.calledOn(spy, Child);
});

test("when an inherited class invoked without new, it's should have itself as context", function() {
    var spy = sinon.spy();
    var Parent = Class.extend({constructor : spy});
    var Child = Parent.extend({});


    Child();

    assert.calledOn(spy, Child);
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







