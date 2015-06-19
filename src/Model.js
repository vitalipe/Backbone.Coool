var _extend = require("./extend");
var Attribute = require("./Attribute");
var util = require("./_util");

var BaseModel = Backbone.Model.extend({});
BaseModel.extend = _extend;

var isAttribute = function(Attr) {
    return util.isAncestor(Attribute, Attr);
};

var __extend = {
    static : {
        extend : function(spec) {

            // inherit defaults & custom attr definitions from parent
            spec.__customAttrClasses = _.extend({}, this.prototype.__customAttrClasses);
            spec.defaults = _.extend({}, _(this.prototype).result("defaults"), _(spec).result("defaults"));

            _.each(spec.defaults, function(Attr, name) {
                if (!isAttribute(Attr))
                    return;

                spec.__customAttrClasses[name] = Attr;
                spec.defaults[name] = Attr.defaultValue();
            });
        }
    }
};

module.exports = BaseModel.extend({

    traits : [__extend],

    initialize : function() {
        this.__customAttrs = {};

        _(this.__customAttrClasses).each(function (Attr, name) {
            this.__customAttrs[name] = new Attr(this, name);
        }, this);
    },

    get : function(key) {
        var customAttr = this.__customAttrs[key];

        if (customAttr)
            return customAttr.get();
        else
            return this._super(key);
    },

    set : function(key, val, options) {
        var attrs = {};
        var self = this;

        // normalize args
        if (_.isObject(key)) {
            attrs = _.clone(key);
            options = val;
        }
        else {
            attrs[key] = val;
        }

        // handle custom attributes
        _.chain(this.__customAttrs).pick(_.keys(attrs)).each(function(attr, name) {
            attr.set(attrs[name], options);
            self.attributes[name] = attrs[name];
            delete attrs[name];
        });

        // now delegate normal
        return this._super.call(this, attrs, options);
    },

    parse : function(rawData) {

        var data = this._super.call(this, rawData);

        _.each(this.__customAttrs, function(attr, name) {
            if (_.has(rawData, name))
                data[name] = attr.parse(rawData[name]);
        });

        return data;
    },


    toJSON : function(attrs) {
        var json = this._super.call(this, attrs);

        attrs = (attrs || {});

        _.each(this.__customAttrs, function(attr, name) {
            json[name] = attr.toJSON(attrs[name]);
        });

        return json;
    }

});