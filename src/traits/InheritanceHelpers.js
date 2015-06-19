var util = require("../_util");


module.exports = {
  static : {
      isAncestorOf : function(Other) {
          return util.isAncestor(this, Other)
      }
  }
};