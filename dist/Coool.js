/*! Backbone.Coool - v0.1.0 [40f0005f484ed7faf5df1925bc22f33615e582d8] - 2015-07-15 */
(function (root, factory) {
    // taken from commonjsStrict.js in https://github.com/umdjs/umd :)
    if (typeof define === 'function' && define.amd) {
        // AMD.
        define(['underscore', 'Backbone'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('underscore'), require('Backbone'));
    } else {
        // Browser globals
        factory(root._, root.Backbone);
    }

})(this, (function(_, Backbone) {
    "use strict";

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Coool = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
    },

    triggerChangeEvent : function(value) {
        var model = this.model;

        model.trigger("change", model);
        model.trigger("change:" + this.name, model, value);
    },

    get : function() {
        return _.has(this.model.attributes, this.name) ? this.model.attributes[this.name] : this.default;
    },

    set : function(value, options) {
        options = (options || {});

        var trigger =  !options.silent && !this.isEqualTo(value);
        this.model.attributes[this.name] = value;

        if (trigger)
            this.triggerChangeEvent(value);
    },

    parse : function(rawValue) { return rawValue;},
    toJSON : function() { return (this.get())},

    isEqualTo : function(otherValue) { return _.isEqual(this.get(), otherValue)}

}, { // static

    defaultValue : function() {
        return this.prototype.default;
    },

    defaultsTo : function(value) {
        return this.extend({ default : value})
    }
});


module.exports = Attribute;
},{"./Class":2,"./traits/Properties":13}],2:[function(require,module,exports){
var _extend = require("./extend");

var Class = function() {
    if (this.initialize)
        this.initialize.apply(this, arguments);
};

Class.extend = _extend;

module.exports = Class;
},{"./extend":8}],3:[function(require,module,exports){

var _extend = require("./extend");

var Collection = Backbone.Collection.extend({});
Collection.extend = _extend;


module.exports = Collection;
},{"./extend":8}],4:[function(require,module,exports){

var traits = {
    Properties : require("./traits/Properties"),
    AttributeProperties : require("./traits/AttributeProperties"),
    InheritanceHelpers : require("./traits/InheritanceHelpers"),
    AttributeGuard : require("./traits/AttributeGuard"),
    Relations : require("./traits/Relations")
};

var types = {
    EnumValue : require("./types/EnumValue"),
    Boolean : require("./types/Boolean"),
    Number : require("./types/Number"),
    String : require("./types/String"),
    Tuple : require("./types/Tuple"),
    ModelReference : require("./types/ModelReference"),
    ModelArrayReference : require("./types/ModelArrayReference")
};

module.exports =  {
    Class : require("./Class"),
    Model : require("./Model"),
    Collection : require("./Collection"),
    Attribute : require("./Attribute"),

    _deps : require("./_deps"),
    extend : require("./extend"),

    traits : traits,
    type : types
};

},{"./Attribute":1,"./Class":2,"./Collection":3,"./Model":5,"./_deps":6,"./extend":8,"./traits/AttributeGuard":10,"./traits/AttributeProperties":11,"./traits/InheritanceHelpers":12,"./traits/Properties":13,"./traits/Relations":14,"./types/Boolean":15,"./types/EnumValue":16,"./types/ModelArrayReference":17,"./types/ModelReference":18,"./types/Number":19,"./types/String":20,"./types/Tuple":21}],5:[function(require,module,exports){
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


    toJSON : function() {
        var json = this._super.call(this);

        _.each(this.__customAttrs, function(attr, name) {
            json[name] = attr.toJSON();
        });

        return json;
    }

});
},{"./Attribute":1,"./_util":7,"./extend":8}],6:[function(require,module,exports){

module.exports =  {
    extend : Backbone.Model.extend,
    mixin : require("./lib/Cocktail.js").mixin
};

},{"./lib/Cocktail.js":9}],7:[function(require,module,exports){

var _isAncestor = function(ThisClass, OtherClass) {
    if(!_.isFunction(OtherClass))
        return false;

    if (_.isUndefined(OtherClass.__parent__))
        return false;

    if (OtherClass.__parent__ === ThisClass)
        return true;

    return _isAncestor(ThisClass, OtherClass.__parent__);
};



module.exports =  {
    isAncestor : _isAncestor
};

},{}],8:[function(require,module,exports){
var deps = require("./_deps");
var util = require("./_util");


var extend = function(target, sources) {
    return _.extend.apply(_, [target].concat(sources))
};

var pluck = function(obj, propName) {
    return _.chain(obj).pluck(propName).compact().value();
};

var getStaticTraits = function(obj) {
    return _.chain(obj).pluck("static").compact().value();
};

var getMixinTraits = function(obj) {
    return _.chain(obj).map(function(trait) { return _.omit(trait, "static");}).compact().value();
};


var _wrapMethods = function(spec, __super) {
    var methods = _.methods(spec);

    _.each(methods, function(name) {
        var method = spec[name];
        var _super = __super[name] || function() {};

        spec[name] = function proxy() {
            if (!this)
                return method.apply(this, arguments);

            var tmp = this._super;
            var result;

            this._super = _super;
            result  = method.apply(this, arguments);
            this._super = tmp;

            return result;
        }
    });
};


var _invokeExtend = function(Class, spec, staticSpec, staticTraits) {
    var invokeExtend = function(extend){extend.call(Class, spec, staticSpec);};
    var extendMethods = pluck(staticTraits, "extend");
    var parentExtendMethods = (Class.__extendMixins || []);

   // apply extend() static function for each trait & parent trait
    _.each(parentExtendMethods, invokeExtend);
    _.each(extendMethods, invokeExtend);

    // store union, so that we can recursively apply extend()
    staticSpec.__extendMixins = _.union(parentExtendMethods, extendMethods);
};

module.exports = function(spec, staticSpec) {
    var Child;
    var constructor;

    var traits = (spec.traits || []).map(_.clone);
    var staticTraits = getStaticTraits(traits);
    var mixinTraits =  getMixinTraits(traits);
    var Parent = this;


    staticSpec = (staticSpec || {});

    // static
    staticSpec = extend(staticSpec, staticTraits);
    delete staticSpec.extend;

    _invokeExtend(this, spec, staticSpec, staticTraits);
    _wrapMethods(spec, this.prototype);

    // wrap constructor, so it's always called with new object or a child Class as context
    if (_.has(spec, "constructor")) {
        constructor = spec.constructor; // ref here, because it should be wrapped with _super...
        spec.constructor = function() {
            return constructor.apply(this instanceof Child || util.isAncestor(Child, this) ? this : Child, arguments);};
    }
    else {
        spec.constructor = function() {
            return Parent.apply(this instanceof Child || util.isAncestor(Child, this) ? this : Child, arguments); };
    }


    staticSpec.__parent__ = Parent;


    Child = deps.extend.call(this, spec, staticSpec);
    deps.mixin(Child, mixinTraits);

    return Child;
};
},{"./_deps":6,"./_util":7}],9:[function(require,module,exports){
//!     (c) 2012 Onsi Fakhouri
//!     Cocktail.js may be freely distributed under the MIT license.
//!     http://github.com/onsi/cocktail

var Cocktail = {};

Cocktail.mixins = {};

Cocktail.mixin = function mixin(klass) {
    var mixins = _.chain(arguments).toArray().rest().flatten().value();
    // Allows mixing into the constructor's prototype or the dynamic instance
    var obj = klass.prototype || klass;

    var collisions = {};

    _.each(mixins, function(mixin) {
        if (_.isString(mixin)) {
            mixin = Cocktail.mixins[mixin];
        }
        _.each(mixin, function(value, key) {
            if (_.isFunction(value)) {
                // If the mixer already has that exact function reference
                // Note: this would occur on an accidental mixin of the same base
                if (obj[key] === value) return;

                if (obj[key]) {
                    // Avoid accessing built-in properties like constructor (#39)
                    collisions[key] = collisions.hasOwnProperty(key) ? collisions[key] : [obj[key]];
                    collisions[key].push(value);
                }
                obj[key] = value;
            } else if (_.isArray(value)) {
                obj[key] = _.union(value, obj[key] || []);
            } else if (_.isObject(value)) {
                obj[key] = _.extend({}, value, obj[key] || {});
            } else if (!(key in obj)) {
                obj[key] = value;
            }
        });
    });

    _.each(collisions, function(propertyValues, propertyName) {
        obj[propertyName] = function() {
            var that = this,
                args = arguments,
                returnValue;

            _.each(propertyValues, function(value) {
                var returnedValue = _.isFunction(value) ? value.apply(that, args) : value;
                returnValue = (typeof returnedValue === 'undefined' ? returnValue : returnedValue);
            });

            return returnValue;
        };
    });

    return klass;
};

var originalExtend;

Cocktail.patch = function patch(Backbone) {
    originalExtend = Backbone.Model.extend;

    var extend = function(protoProps, classProps) {
        var klass = originalExtend.call(this, protoProps, classProps);

        var mixins = klass.prototype.mixins;
        if (mixins && klass.prototype.hasOwnProperty('mixins')) {
            Cocktail.mixin(klass, mixins);
        }

        return klass;
    };

    _.each([Backbone.Model, Backbone.Collection, Backbone.Router, Backbone.View], function(klass) {
        klass.mixin = function mixin() {
            Cocktail.mixin(this, _.toArray(arguments));
        };

        klass.extend = extend;
    });
};

Cocktail.unpatch = function unpatch(Backbone) {
    _.each([Backbone.Model, Backbone.Collection, Backbone.Router, Backbone.View], function(klass) {
        klass.mixin = undefined;
        klass.extend = originalExtend;
    });
};


module.exports = Cocktail;
},{}],10:[function(require,module,exports){
/**
 * Created by vitalipe on 19/06/15.
 */


var _hasAttr = function(model, attrName) {
    return (attrName === model.idAttribute ||  _.has(model.defaults, attrName));
};


module.exports = {

    set : function(key, val) {
        var attrs = {};
        var model = this;

        // normalize args
        if (_.isObject(key))
            attrs = _.clone(key);

        else
            attrs[key] = val;

        // exists ?
        _.each(attrs, function(value, key) {
            if (!_hasAttr(model, key))
                throw new Error("Model Error: called set() with unknown key name: '" + key + "', a typo? ");
        }, this);

    },

    get : function(key) {
        if (!_hasAttr(this, key))
            throw new Error("Model Error: called get() with unknown key name: '" + key + "', a typo? ");

    }


};
},{}],11:[function(require,module,exports){






module.exports = {

    initialize : function() {
        var props = {};
        var self = this;

        _.each(_(self).result("defaults"), function(attr, name) {
            if (_.has(self, name))
                return;

            props[name] = { get : _.partial(self.get, name), set : _.partial(self.set, name)}
        });

        Object.defineProperties(this, props);
    }
};
},{}],12:[function(require,module,exports){
var util = require("../_util");


module.exports = {
  static : {
      isAncestorOf : function(Other) {
          return util.isAncestor(this, Other)
      }
  }
};
},{"../_util":7}],13:[function(require,module,exports){
/**
 * Created by user on 6/3/2015.
 */

module.exports = {

    static : {
        extend : function(spec) {
            var parentSpec = this.prototype;

            if (parentSpec.properties)
                spec.properties =  _.extend({}, parentSpec.properties, spec.properties);
        }
    },

    initialize: function () {
        var props = this.properties || {};

        _(props).each(function(prop) {
            _.defaults(prop, { configurable : true});
        });

        Object.defineProperties(this,  props);
    }

};

},{}],14:[function(require,module,exports){
var ModelReference = require("../types/ModelReference");
var ModelArrayReference = require("../types/ModelArrayReference");

var _store = null;
var _resolve  = function(ref) {

    if (!_.isObject(_store))
        throw new Error("can't find store, make sure setStore() was called...");

    if (!_store[ref])
        throw new Error("can't resolve relation, no such collection: " + ref);

    return _store[ref];
};



module.exports = {
    static : {
        setStore : function(store) { _store = store},

        hasOneFrom : function(refName) {
            return ModelReference.extend({
                resolveRef : function(ref) {

                    var store = _resolve(refName);
                    return (store.get(ref) || null);
                }
            })
        },

        hasMany : function(refName) {
            return ModelArrayReference.extend({
                resolveRef : function(refs) {
                    if (_.isEmpty(refs))
                        return [];

                    var store = _resolve(refName);
                    return _.compact(refs.map(function(id) { return store.get(id); }));
                }
            })
        }
    }
};
},{"../types/ModelArrayReference":17,"../types/ModelReference":18}],15:[function(require,module,exports){
var Attribute = require("../Attribute");

module.exports = Attribute.extend({

    default : false,

    parse : function(rawValue) {
        if (!_.isString(rawValue))
            return Boolean(rawValue);

        rawValue = rawValue.toLowerCase();

        return (rawValue=== "true" || rawValue === "1");
    },

    set : function(val, options) {
        if (!_.isBoolean(val))
            throw new Error("Attempting to set() an invalid value: \"" + val + "\" on: " + this.model.cid + ":" + this.name);

        return this._super(val, options);
    }
});
},{"../Attribute":1}],16:[function(require,module,exports){
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
},{"../Attribute":1}],17:[function(require,module,exports){
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
},{"../Attribute":1}],18:[function(require,module,exports){
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
},{"../Attribute":1}],19:[function(require,module,exports){
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
},{"../Attribute":1}],20:[function(require,module,exports){
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
},{"../Attribute":1}],21:[function(require,module,exports){
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
},{"../Attribute":1}]},{},[4])(4)
});

}));