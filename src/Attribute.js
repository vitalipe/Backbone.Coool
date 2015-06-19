var Class = require("./Class");
var Properties  = require("./traits/Properties");


module.exports = Class.extend({

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

    parse : _.identity,
    toJSON : _.identity

}, { // static

    defaultValue : function() {
        return this.prototype.default;
    },

    defaultsTo : function(value) {
        return this.extend({ default : value})
    }
});