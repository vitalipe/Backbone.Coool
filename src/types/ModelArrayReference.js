var Attribute = require("../Attribute");

module.exports = Attribute.extend({

    default : [],
    get : function() { return this.resolveRef(this._super()) ;},
    set : function(value, options) {
        var refs = [];
        var cid = this.model.cid;
        var name = this.name;

        value.forEach(function(val) {
            val =  _.has(val, "id") ? val.id : val;

            if (_.isObject(val))
                throw new Error("Attempting to set() an invalid value: \"" + val + "\" on: " + cid + ":" + name);

            refs.push(val);
        });

        return this._super(refs, options);
    },

    isEqualTo : function(values) {
        values = values.map(function(val) { return (_.has(val, "id") ? val.id : val); });

        return _.isEqual(Attribute.prototype.get.call(this), values);
    }
});