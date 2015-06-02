var Class = Cool.Class;
var deps = Cool._deps;



QUnit.module("extend", {

    setup : function() {
        sinon.spy(deps, "extend");

        this.Child = Class.extend({ attr : 42, method : sinon.stub().returns("result") });
    },
    teardown : function() {
        deps.extend.restore();
    }
});


test("should be possible to extend", function() {
    var child = new this.Child();

    assert.property(child, "attr");
    assert.property(child, "method");

    assert.strictEqual(child.attr, 42);
    assert.strictEqual(child.method(), "result");
});

test("should be possible to extend() extended Class", function() {
    var GrandChild = this.Child.extend({method : sinon.stub().returns("other result")});
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
    var TraitOne = {static : { extend : sinon.spy() } };
    var TraitTwo = {static : { extend : sinon.spy() } };

    Class.extend({ traits : [TraitOne, TraitTwo]});

    assert.calledOnce(TraitOne.static.extend);
    assert.calledOnce(TraitTwo.static.extend);
    assert.ok(TraitOne.static.extend.calledBefore(TraitTwo.static.extend));
});


test("should call extend() for all trait's in inheritance hierarchy", function() {
    var TraitOne = {static : { extend : sinon.spy() } };
    var TraitTwo = {static : { extend : sinon.spy() } };
    var ChildTraitOne = {static : { extend : sinon.spy() } };
    var ChildTraitTwo = {static : { extend : sinon.spy() } };
    var GrandchildTraitOne = {static : { extend : sinon.spy() } };
    var GrandchildTraitTwo = {static : { extend : sinon.spy() } };

    var Parent = Class.extend({ traits : [TraitOne, TraitTwo]});
    var Child = Parent.extend({ traits : [ChildTraitOne, ChildTraitTwo]});
    Child.extend({ traits : [GrandchildTraitOne, GrandchildTraitTwo]});


    assert.calledThrice(TraitOne.static.extend);
    assert.calledThrice(TraitTwo.static.extend);

    assert.calledTwice(ChildTraitOne.static.extend);
    assert.calledTwice(ChildTraitTwo.static.extend);

    assert.calledOnce(GrandchildTraitOne.static.extend);
    assert.calledOnce(GrandchildTraitTwo.static.extend);


    assert.ok(sinon.calledInOrder(
            TraitOne.static.extend,
            TraitTwo.static.extend,
            ChildTraitOne.static.extend,
            ChildTraitTwo.static.extend,
            GrandchildTraitOne.static.extend,
            GrandchildTraitTwo.static.extend)
    )
});




