



var _isAncestorOf = function(OtherClass) {
    if(!_.isFunction(OtherClass))
        return false;

    if (_.isUndefined(OtherClass.__parent__))
        return false;

    if (OtherClass.__parent__ === this)
        return true;

    return _isAncestorOf.call(this, OtherClass.__parent__);
};



module.exports = {
  static : {
      isAncestorOf : _isAncestorOf
  }
};