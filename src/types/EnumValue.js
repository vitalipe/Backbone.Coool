var Attribute = require("../Attribute");

module.exports = Attribute.extend({

    enum : {},
    valueAttribute : "value",

    parse : function(rawValue) {
        var name = this.valueAttribute;

        return _.find(this.enum, function(option) { return rawValue === option[name] || rawValue === option;});
    },

    set : function(val, options) {
        if (!_.contains(this.enum, val))
            return;

        return this._super(val, options);
    },

    toJSON : function() {
        var name = this.valueAttribute;
        var value = this.get();

        return _.has(value, name) ? value[name] : value;
    }
});