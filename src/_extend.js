var backboneExtend = Backbone.Model.extend;


module.exports = function(spec, staticSpec) {
    return backboneExtend.call(this, spec, staticSpec);
};