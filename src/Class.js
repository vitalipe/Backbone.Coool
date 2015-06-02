var _extend = require("./extend");

var Class = function() {
    if (this.initialize)
        this.initialize.apply(this, arguments);
};

Class.extend = _extend;

module.exports = Class;