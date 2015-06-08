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
