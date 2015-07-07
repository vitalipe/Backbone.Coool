var Attribute = require("../Attribute");

module.exports = Attribute.extend({

    default : false,
    alwaysParse : true, // if true, will parse on each set()

    parse : function(rawValue) {
        if (!_.isString(rawValue))
            return Boolean(rawValue);

        rawValue = rawValue.toLowerCase();

        return (rawValue=== "true" || rawValue === "1");
    },

    set : function(val, options) {
        if (this.alwaysParse)
            val = this.parse(val);

        return this._super(val, options);
    }
});