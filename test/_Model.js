var Model = Coool.Model;
var Attribute = Coool.Attribute;


var createFakeAttribute = function(spec) {
    var proxy = function() {return this._super.apply(this, arguments)};

    spec = (spec || {});

    var proxyFactory = function() {
        meta.instances.push(this);
        return this._super.apply(this, arguments)
    };

    var meta = {
        instances : []
    };

    var staticMethods = {

        getInstance : function(model, name) {
            return _.find(meta.instances, function(a) { return a.model === model && a.name === name});
        },

        verifyItExistsOn : function(model, name) {
            var attr = this.getInstance(model, name);

            model.set(name, "test value");

            assert.isDefined(attr);

            if (_.isUndefined(attr))
                return; // don't run other tests...

            assert.equal(model.get(name), "test value");
            assert.equal(attr.get(), "test value");
        },

        reset : function() {
            _.each(methods, function(spy) { if (spy && spy.reset) spy.reset(); });
        }
    };

    var methods = {
        constructor : sinon.spy(proxyFactory),
        default : spec.default,
        initialize : sinon.spy(spec.initialize || proxy),
        set : sinon.spy(spec.set || proxy),
        get : sinon.spy(spec.get || proxy),
        parse : sinon.spy(spec.parse || proxy),
        toJSON : sinon.spy(spec.toJSON || proxy)
    };

    return Attribute.extend(_.clone(methods), _.extend(staticMethods, {methods : methods, meta : meta}));
};

var createFakeHost  = function(defaults) {
    var Host = Model.extend({ defaults : defaults});
    return new Host;
};


QUnit.module("Model");

test("should be an instance of Backbone.Model", function() {
   var model = new Model();

    assert.instanceOf(model, Backbone.Model);
});

test("should expose Coool.extend()", function() {
    assert.equal(Model.extend, Coool.extend);
});



QUnit.module("Model->Custom Attributes");

test("should delegate to custom getters/setters", function() {
    var Fake = createFakeAttribute();
    var model = createFakeHost({ myCustom : Fake });

    Fake.reset();

    model.get("myCustom");
    model.set("myCustom", 12345);

    assert.called(Fake.methods.get);
    assert.calledWith(Fake.methods.set, 12345);
});


test("should inherent custom attrs from parent  ", function() {
    var Fake = createFakeAttribute({ default : 42});
    var ParentModel = Model.extend({ defaults : { myCustom : Fake, other : Fake}});
    var ChildModel = ParentModel.extend({});
    var child = new ChildModel();


    Fake.verifyItExistsOn(child, "myCustom");
    Fake.verifyItExistsOn(child, "other");
});


test("should be instantiated with model & name", function() {
    var Fake = createFakeAttribute();
    var model = createFakeHost({ myCustom : Fake });

    assert.calledWith(Fake.methods.initialize, model, "myCustom");
});


test("should be possible to instantiate multiple times in the same object", function() {
    var Fake = createFakeAttribute();
    var model = createFakeHost({ fakeOne : Fake, fakeTwo : Fake });

    assert.calledWithExactly(Fake.methods.initialize, model, "fakeTwo");
    assert.calledWithExactly(Fake.methods.initialize, model, "fakeOne");
});


test("should pass options to Attribute.set() ", function() {
    var options = { silent : true, someOtherOption : false};
    var Fake = createFakeAttribute();
    var model = createFakeHost({ myCustom : Fake});

    model.set("myCustom", 42, options);

    assert.calledWithExactly(Fake.methods.set, 42, options);
});


test("should not effect simple attributes", function() {
    var changeEventSpy = sinon.spy();
    var model = createFakeHost({ "myCustom" : createFakeAttribute(), simple : 42});
    var initialValue = model.get("simple");

    model.on("change change:simple", changeEventSpy);
    model.set("simple", 12345);

    assert.equal(initialValue, 42);
    assert.equal(model.get("simple"), 12345);
    assert.calledTwice(changeEventSpy);
});


test("should not store Attribute definitions in defaults, only default values", function() {
    var Fake = createFakeAttribute({ default : "bah!"});
    var Host = Model.extend({ defaults :{ myCustom : Fake }});

    assert.equal(Host.prototype.defaults.myCustom, "bah!");
});


test("toJSON() should work with custom attributes", function() {
    var FakeAttrOne = createFakeAttribute({ toJSON : sinon.stub().returns("ONE!")});
    var FakeAttrTwo = createFakeAttribute({ toJSON : sinon.stub().returns("TWO!")});
    var host = createFakeHost({ "one" : FakeAttrOne, "two" : FakeAttrTwo, "three" : 3});

    assert.deepEqual(host.toJSON(), {
        one : "ONE!",
        two : "TWO!",
        three : 3
    });
});


test("parse() should work with custom attributes", function() {
    var FakeAttrOne = createFakeAttribute({ parse : sinon.stub().returns("ONE!")});
    var FakeAttrTwo = createFakeAttribute({ parse : sinon.stub().returns("TWO!")});
    var host = createFakeHost({ "one" : FakeAttrOne, "two" : FakeAttrTwo, "three" : 3});

    assert.deepEqual(host.parse({one : 1, two: 2, three : 3}), {
        one : "ONE!",
        two : "TWO!",
        three : 3
    });
});


test("should not invoke Attribute.parse() if no attribute data was passed", function() {
    var FakeAttrOne = createFakeAttribute();
    var FakeAttrTwo = createFakeAttribute();
    var host = createFakeHost({ "one" : FakeAttrOne, "two" : FakeAttrTwo, "three" : 3});

    host.parse({nonExistent : "moo!!", three : "three" });

    assert.notCalled(FakeAttrOne.methods.parse);
    assert.notCalled(FakeAttrTwo.methods.parse);
});


test("methods should be invoked with attribute as context", function() {
    var Fake = createFakeAttribute();
    var host = createFakeHost({ "one" : Fake});
    var attr = Fake.getInstance(host, "one");

    host.parse({ one : 11});
    host.set("one", 1);
    host.get("one");
    host.toJSON();

    assert.alwaysCalledOn(Fake.methods.parse, attr);
    assert.alwaysCalledOn(Fake.methods.set, attr);
    assert.alwaysCalledOn(Fake.methods.get, attr);
    assert.alwaysCalledOn(Fake.methods.toJSON, attr);
});

test("set() should not alter param object", function() {
    var host = createFakeHost({ "one" : createFakeAttribute(), simple : "yes"});
    var params = { one : 11, simple : "no"};
    var cloned = _.clone(params);

    host.set(params);

    assert.deepEqual(params, cloned);
});
