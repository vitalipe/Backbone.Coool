var Attribute = require("../Attribute");

var EMPTY = Object.freeze([]);

module.exports = Attribute.extend({

    default : EMPTY,

    initialize : function() {
        this._super.apply(this, arguments);

        if (Object.isFrozen(this.default) === false)
            this.default = Object.freeze(this.default);
    },

    set : function(val, options) {
        if (!_.isArray(val))
            throw new Error("Attempting to set() an invalid value: \"" + val + "\" on: " + this.model.cid + ":" + this.name);

        if (!Object.isFrozen(val))
            val = Object.freeze(_.clone(val));

        return this._super(val, options);
    },

    parse : function(val) {

        // attempt to convert from string
        if (_.isString(val)) {
            try { val = JSON.parse(val);}
            catch (e) { val = null;}
        }

        if (_.isArray(val))
            return Object.freeze(val);
        else
            return EMPTY;
    }
});