var Attribute = require("../Attribute");

module.exports = Attribute.extend({

    default : null,

    resolveRef : function(id) { throw new Error("Not Implemented!")},
    get : function() { return this.resolveRef(this._super()); },
    set : function(val, options) {
        if (_.has(val, "id"))
            val = val.id;

        if (_.isObject(val))
            throw new Error("Attempting to set() an invalid value: \"" + val + "\" on: " + this.model.cid + ":" + this.name);

        return this._super(val, options);
    },

    isEqualTo : function(other) {
        if (_.has(other, "id"))
            other = other.id;

        return _.isEqual(Attribute.prototype.get.call(this), other);
    }
});