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