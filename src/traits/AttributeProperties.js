





module.exports = {

    static : {
        extend : function(spec, staticSpec) {

            // allow inheritance of "defaults"
            spec.defaults = _.extend({}, _(this.prototype).result("defaults"), _(spec).result("defaults"));
        }
    },

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