var Attribute = require("../Attribute");

module.exports = Attribute.extend({

    default : "",

    parse : function(rawValue) {
        return String(rawValue);
    },

    set : function(val, options) {
        if (!_.isString(val))
            throw new Error("Attempting to set() an invalid value: \"" + val + "\" on: " + this.model.cid + ":" + this.name);

        return this._super(val, options);
    }
});