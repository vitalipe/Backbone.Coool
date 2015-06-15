
var traits = {
    Properties : require("./traits/Properties"),
    AttributeProperties : require("./traits/AttributeProperties"),
    InheritanceHelpers : require("./traits/InheritanceHelpers")
};


module.exports =  {
    Class : require("./Class"),
    Model : require("./Model"),
    Collection : require("./Collection"),

    _deps : require("./_deps"),
    extend : require("./extend"),

    traits : traits
};
