var Relations = Coool.traits.Relations;
var Model = Coool.Model.extend({ traits : [Relations]});
var Collection = Coool.Collection;


QUnit.module("trait.Relations", {
    setup : function() {

        this.FakeStore = {
            Stuff : new Collection([{id : 1}, {id : 2}, {id : 3}]),
            EmptyStuff : new Collection()
        };

        Model.setStore(this.FakeStore);
    },

    teardown : function() {
        Model.setStore(null);
    }
});


test("hasMany() should return array of model instances when resolved", function() {
    var store = this.FakeStore.Stuff;
    var ManyRef = Model.hasMany("Stuff");
    var many = new ManyRef(new Model(), "demo");

    many.set([1,2]);

    assert.deepEqual(many.get(), [store.get(1), store.get(2)]);
});



test("hasMany() should return empty array when not resolved", function() {
    var ManyRef = Model.hasMany("Stuff");
    var many = new ManyRef(new Model(), "demo");

    many.set(["one", "blah"]);

    assert.deepEqual(many.get(), []);
});


test("hasOneFrom() should return a model when resolved", function() {
    var store = this.FakeStore.Stuff;
    var OneRef = Model.hasOneFrom("Stuff");
    var one = new OneRef(new Model(), "demo");

    one.set(1);

    assert.equal(one.get(), store.get(1));
});


test("hasOneFrom() should return null when not resolved", function() {
    var OneRef = Model.hasOneFrom("Stuff");
    var one = new OneRef(new Model(), "demo");

    one.set("crap");

    assert.deepEqual(one.get(), null);
});


test("should throw an Error when store is not set", function() {
    Model.setStore(null);

    var ManyRef = Model.hasMany("Stuff");
    var OneRef = Model.hasOneFrom("Stuff");

    var many = new ManyRef(new Model(), "demo");
    var one = new OneRef(new Model(), "demo");

    many.set([1,2]);
    one.set(1);

    assert.throws(function() { many.get()});
    assert.throws(function() {one.get()});
});



test("should throw an Error when collection does not exists in store", function() {
    Model.setStore({ other : new Collection() });

    var ManyRef = Model.hasMany("Stuff");
    var OneRef = Model.hasOneFrom("Stuff");

    var many = new ManyRef(new Model(), "demo");
    var one = new OneRef(new Model(), "demo");

    many.set([1,2]);
    one.set(1);

    assert.throws(function() { many.get()});
    assert.throws(function() {one.get()});
});