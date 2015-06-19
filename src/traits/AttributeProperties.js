





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