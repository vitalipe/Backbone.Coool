var InheritanceHelpers = Coool.traits.InheritanceHelpers;
var Class = Coool.Class.extend({ traits : [InheritanceHelpers]});


QUnit.module("traits.InheritanceHelpers");


test("parent Class should be isAncestorOf() it's direct child", function() {
    var Parent = Class.extend({});
    var Child = Parent.extend({});

    assert.isTrue(Parent.isAncestorOf(Child));
});

test("indirect parent Class should also be isAncestorOf()", function() {
    var Parent = Class.extend({});
    var Child = Parent.extend({});
    var Grandchild = Child.extend({});

    assert.isTrue(Parent.isAncestorOf(Grandchild));
});

test("child Class should not be isAncestorOf() it's parent", function() {
    var Parent = Class.extend({});
    var Child = Parent.extend({});

    assert.isFalse(Child.isAncestorOf(Parent));
});

test("a Class should not be isAncestorOf() itself", function() {
    var Demo = Class.extend({});

    assert.isFalse(Demo.isAncestorOf(Demo));
});

test("unrelated Class should not be isAncestorOf() other class ", function() {
    var One = Class.extend({});
    var Other = Class.extend({});

    assert.isFalse(One.isAncestorOf(Other));
    assert.isFalse(Other.isAncestorOf(One));
});


test("Class should not be isAncestorOf() undefined, null, or primitive", function() {
    var Demo = Class.extend({});

    assert.isFalse(Demo.isAncestorOf(undefined));
    assert.isFalse(Demo.isAncestorOf(null));
    assert.isFalse(Demo.isAncestorOf(true));
    assert.isFalse(Demo.isAncestorOf(0));
    assert.isFalse(Demo.isAncestorOf("string"));
});


