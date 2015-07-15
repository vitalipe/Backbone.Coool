var ModelArrayReference = Coool.type.ModelArrayReference;
var Model = Coool.Model;
var Collection = Coool.Collection;


QUnit.module("type.ModelArrayReference");


test("should be an instance of Attribute", function() {
    assert.instanceOf(new ModelArrayReference(), Coool.Attribute);
});


test("should return [] when not resolved", function() {
    var Reference = ModelArrayReference({ resolveRef : sinon.stub().returns([])});
    var ref = new Reference(new Model, "ref");

    assert.isTrue(_.isArray(ref.get()) && _.isEmpty(ref.get()));
});


test("should return an array of models when resolved", function() {
    var models = [new Model(), new Model(), new Model()];
    var Reference = ModelArrayReference({ resolveRef : sinon.stub().returns(models)});
    var ref = new Reference(new Model, "ref");

    assert.deepEqual(ref.get(), models);
});


test("should throw error when resolveRef is not overridden", function() {
    var ref = new ModelArrayReference(new Model(), "ref");
    var getter = _.bind(ref.get, ref);

    assert.throws(getter);
});


test("should resolveRef on each get()", function() {
    var resolve = sinon.stub();
    var Reference = ModelArrayReference({ resolveRef : resolve });
    var ref = new Reference(new Model, "ref");

    ref.get();
    ref.get();
    ref.get();
    ref.get();

    assert.callCount(resolve, 4);
});


test("should be possible to set() refs by passing an array of IDs", function() {
    var resolve = sinon.stub();
    var Reference = ModelArrayReference({ resolveRef : resolve });
    var ref = new Reference(new Model, "ref");

    ref.set([123]);
    ref.get();

    ref.set([42, 1, 2]);
    ref.get();


    assert.calledWith(resolve, [123]);
    assert.calledWith(resolve, [42,1,2]);
});


test("should be possible to set() refs by passing an array of objects with ids", function() {
    var resolve = sinon.stub();
    var Reference = ModelArrayReference({ resolveRef : resolve });
    var ref = new Reference(new Model, "ref");

    ref.set([{id : 123}]);
    ref.get();

    ref.set([{ id : 1}, { id : 2}, { id : 3}]);
    ref.get();


    assert.calledWith(resolve, [123]);
    assert.calledWith(resolve, [1,2,3]);
});


test("should throw an Error when attempting to use empty objects as IDs", function() {
    var Reference = ModelArrayReference({ resolveRef : sinon.stub() });
    var ref = new Reference(new Model, "ref");

    assert.throws(function() { ref.set([{}])});
    assert.throws(function() { ref.set([[]])});
    assert.throws(function() { ref.set([1, []])});
    assert.throws(function() { ref.set([function() {}])});
});


test("should throw an Error when attempting to use objects with invalid id fields", function() {
    var Reference = ModelArrayReference({ resolveRef : sinon.stub() });
    var ref = new Reference(new Model, "ref");

    assert.throws(function() { ref.set([{ id : {} }])});
    assert.throws(function() { ref.set([{ id : [] }])});
    assert.throws(function() { ref.set([{ id : function() {} }])});
});


test("should be possible to mix objects with raw IDs", function() {
    var resolve = sinon.stub();
    var Reference = ModelArrayReference({ resolveRef : resolve });
    var ref = new Reference(new Model, "ref");

    ref.set([{ id : 1}, 2, { id : 3}, 4]);
    ref.get();

    assert.calledWith(resolve, [1,2,3,4]);
});


test("should compare by ID, not the actual refs", function() {
    var Reference = ModelArrayReference.defaultsTo([1,2,3]);
    var ref = new Reference(new Model, "ref");

    assert.isTrue(ref.isEqualTo([1,2,3]));
    assert.isTrue(ref.isEqualTo([{id : 1}, {id : 2, x : "value"}, 3]));

    assert.isFalse(ref.isEqualTo([1,2,4]));
    assert.isFalse(ref.isEqualTo([{ id : 8}, 2, 3]));
});