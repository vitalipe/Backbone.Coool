var deps = require("./_deps");


var extend = function(target, sources) {
    return _.extend.apply(_, [target].concat(sources))
};

var pluck = function(obj, propName) {
    return _.chain(obj).pluck(propName).compact().value();
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
    var traits = (spec.traits || []).map(_.clone);
    var staticTraits = pluck(traits, "static");
    var overrideTraits = pluck(traits, "override");

    staticSpec = (staticSpec || {});

    // static
    staticSpec = extend(staticSpec, staticTraits);
    delete staticSpec.extend;

    _invokeExtend(this, spec, staticSpec, staticTraits);

    // override
    spec = extend(spec, overrideTraits);

    return  deps.extend.call(this, spec, staticSpec);
};