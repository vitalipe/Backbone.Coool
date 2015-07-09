var Attribute = require("../Attribute");

var clamp = function(min, max, value) {
    return Math.min(Math.max(value, min), max);
};

module.exports = Attribute.extend({

    default : 0,

    min : Number.NEGATIVE_INFINITY,
    max : Number.POSITIVE_INFINITY,

    alwaysClamp : false,

    parse : function(rawValue) {
        if (!_.isString(rawValue) && !_.isNumber(rawValue))
            return NaN;

        return clamp(this.min, this.max, Number(rawValue));
    },

    set : function(val, options) {
        if (!_.isNumber(val))
            throw new Error("Attempting to set() an invalid value: \"" + val + "\" on: " + this.model.cid + ":" + this.name);

        if (this.alwaysClamp)
            val = clamp(this.min, this.max, val);

        return this._super(val, options);
    },

    toJSON : function(value) {
        return clamp(this.min, this.max, this._super(value));
    }
});