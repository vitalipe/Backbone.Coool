var ModelReference = require("../types/ModelReference");
var ModelArrayReference = require("../types/ModelArrayReference");

var _store = null;
var _resolve  = function(ref) {

    if (!_.isObject(_store))
        throw new Error("can't find store, make sure setStore() was called...");

    if (!_store[ref])
        throw new Error("can't resolve relation, no such collection: " + ref);

    return _store[ref];
};



module.exports = {
    static : {
        setStore : function(store) { _store = store},

        hasOneFrom : function(refName) {
            return ModelReference.extend({
                resolveRef : function(ref) {

                    var store = _resolve(refName);
                    return (store.get(ref) || null);
                }
            })
        },

        hasMany : function(refName) {
            return ModelArrayReference.extend({
                resolveRef : function(refs) {
                    if (_.isEmpty(refs))
                        return [];

                    var store = _resolve(refName);
                    return _.compact(refs.map(function(id) { return store.get(id); }));
                }
            })
        }
    }
};