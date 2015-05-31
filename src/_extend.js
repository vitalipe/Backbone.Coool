
module.exports = function(spec, staticSpec) {
    var self = this;
    var invokeExtend = function(extend){extend.call(self, spec, staticSpec);};
    var traits = (spec.traits || []).map(_.clone);
    var staticTraits = _.chain(traits).pluck("static").compact().value();
    var parentExtendTraits = (this.prototype.__extendMixins || []);
    var extendTraits = _.chain(staticTraits).pluck("extend").compact().value();

    staticSpec = (staticSpec || {});

    // apply static traits
    staticTraits.unshift({});
    staticProps = _.extend( staticSpec, _.extend.apply(_, staticTraits));
    delete staticProps.extend;

    // apply extend for each trait & parent trait
    _.each(parentExtendTraits, invokeExtend);
    _.each(extendTraits, invokeExtend);

    spec.__extendMixins = _.union(parentExtendTraits, extendTraits);


    return  Backbone.Model.extend.call(this, spec, staticSpec);
};