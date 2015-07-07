var Class = require("./Class");
var Properties  = require("./traits/Properties");


var Attribute = Class.extend({

    traits : [Properties],
    default : undefined,

    properties : {
        model : {
            get : function() {
                if (!this.__model)
                    throw new Error("Looks like there is no model for this attribute, did you forget to call _super() from initialize ?");

                return this.__model;
            }
        },

        name :  {
            get : function() {
                if (!this.__name)
                    throw new Error("Looks like there is no name for this attribute, did you forget to call _super() from initialize ?");

                return this.__name;
            }
        }
    },

    constructor : function(data) {
        // this make it possible to omit the .extend() call when extending.
        // e,g Range({from : 0, to : 10} is the same as Range.extend({from : 0, to : 10}
        if (this instanceof Attribute === false)
            return this.extend(data || {});

        return this._super.apply(this, arguments);
    },

    initialize : function(model, name) {
        this.__model = model;
        this.__name = name;
        this.__value = this.default;
    },

    triggerChangeEvent : function(value) {
        var model = this.model;

        model.trigger("change", model);
        model.trigger("change:" + this.name, model, value);
    },

    get : function() {
        return this.__value;
    },

    set : function(value, options) {
        options = (options || {});

        var trigger =  !options.silent && !_.isEqual(value, this.__value);
        this.__value = value;

        if (trigger)
            this.triggerChangeEvent(value);
    },

    parse : function(rawValue) { return rawValue;},
    toJSON : function(value) { return (_.isUndefined(value) ?   this.__value : value)}

}, { // static

    defaultValue : function() {
        return this.prototype.default;
    },

    defaultsTo : function(value) {
        return this.extend({ default : value})
    }
});


module.exports = Attribute;