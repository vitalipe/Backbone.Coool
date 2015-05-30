var _extend = require("./_extend");

var Class = function() {
    if (this.initialize)
        this.initialize.apply(this, arguments);
};

Class.extend = _extend;

module.exports = Class;