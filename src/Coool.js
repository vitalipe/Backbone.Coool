
var traits = {
    Properties : require("./traits/Properties"),
    AttributeProperties : require("./traits/AttributeProperties"),
    InheritanceHelpers : require("./traits/InheritanceHelpers"),
    AttributeGuard : require("./traits/AttributeGuard"),
    Relations : require("./traits/Relations")
};

var types = {
    EnumValue : require("./types/EnumValue"),
    Boolean : require("./types/Boolean"),
    Number : require("./types/Number"),
    String : require("./types/String"),
    Tuple : require("./types/Tuple"),
    ModelReference : require("./types/ModelReference"),
    ModelArrayReference : require("./types/ModelArrayReference")
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
