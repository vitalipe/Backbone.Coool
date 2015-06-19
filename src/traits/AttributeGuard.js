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