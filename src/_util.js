
var _isAncestor = function(ThisClass, OtherClass) {
    if(!_.isFunction(OtherClass))
        return false;

    if (_.isUndefined(OtherClass.__parent__))
        return false;

    if (OtherClass.__parent__ === ThisClass)
        return true;

    return _isAncestor(ThisClass, OtherClass.__parent__);
};



module.exports =  {
    isAncestor : _isAncestor
};
