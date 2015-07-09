
var traits = {
    Properties : require("./traits/Properties"),
    AttributeProperties : require("./traits/AttributeProperties"),
    InheritanceHelpers : require("./traits/InheritanceHelpers"),
    AttributeGuard : require("./traits/AttributeGuard")
};

var types = {
    EnumValue : require("./types/EnumValue"),
    Boolean : require("./types/Boolean"),
    Number : require("./types/Number"),
    String : require("./types/String")
};

module.exports =  {
    Class : require("./Class"),
    Model : require("./Model"),
    Collection : require("./Collection"),
    Attribute : require("./Attribute"),

    _deps : require("./_deps"),
    extend : require("./extend"),

    traits : traits,
    type : types
};
