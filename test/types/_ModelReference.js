var ModelReference = Coool.type.ModelReference;
var Model = Coool.Model;
var Collection = Coool.Collection;


QUnit.module("type.ModelReference");


test("should be an instance of Attribute", function() {
    assert.instanceOf(new ModelReference(), Coool.Attribute);
});


test("should return null when not resolved", function() {
    var Reference = ModelReference({ resolveRef : sinon.stub().returns(null)});
    var ref = new Reference(new Model, "ref");

    assert.isNull(ref.get());
});


test("should return a model instance when resolved", function() {
    var model = new Model();
    var Reference = ModelReference({ resolveRef : sinon.stub().returns(model)});
    var ref = new Reference(new Model, "ref");

    assert.equal(ref.get(), model);
});

test("should throw error when resolveRef is not overridden", function() {
    var ref = new ModelReference(new Model(), "ref");
    var getter = _.bind(ref.get, ref);

    assert.throws(getter);
});


test("should resolveRef on each get()", function() {
    var resolve = sinon.stub();
    var Reference = ModelReference({ resolveRef : resolve });
    var ref = new Reference(new Model, "ref");

    ref.get();
    ref.get();
    ref.get();
    ref.get();

    assert.callCount(resolve, 4);
});



test("should be possible to set() refs by id", function() {
    var resolve = sinon.stub();
    var Reference = ModelReference({ resolveRef : resolve });
    var ref = new Reference(new Model, "ref");

    ref.set(123);
    ref.get();

    ref.set(42);
    ref.get();


    assert.calledWith(resolve, 123);
    assert.calledWith(resolve, 42);
});

test("should be possible to set() refs by passing a model with id", function() {
    var resolve = sinon.stub();
    var Reference = ModelReference({ resolveRef : resolve });
    var ref = new Reference(new Model, "ref");

    ref.set(new Model({id : 123}));
    ref.get();

    ref.set(new Model({ id : 42}));
    ref.get();


    assert.calledWith(resolve, 123);
    assert.calledWith(resolve, 42);
});


test("should throw error when attempting to use objects as IDs", function() {
    var Reference = ModelReference({ resolveRef : sinon.stub() });
    var ref = new Reference(new Model, "ref");

    assert.throws(function() { ref.set({})});
    assert.throws(function() { ref.set([])});
    assert.throws(function() { ref.set(function() {})});
});


test("should compare by ID, not the actual refs", function() {
    var Reference = ModelReference.defaultsTo(42);
    var ref = new Reference(new Model, "ref");

    assert.isTrue(ref.isEqualTo(42));
    assert.isTrue(ref.isEqualTo({id : 42, other : 44}));

    assert.isFalse(ref.isEqualTo({id : 11}));
    assert.isFalse(ref.isEqualTo(11));
});