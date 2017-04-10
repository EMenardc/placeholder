
// plugin for token
var sorted = require('../lib/sorted');

module.exports.findToken = function( token, isPrefix ){

  // find document ids which contain this token
  var docIds;
  if( true === isPrefix ){
    docIds = this.graph.getTokenPrefix( token ) || [];
  } else {
    docIds = this.graph.getToken( token ) || [];
  }

  // fetch a sorted uniq set of all child document ids
  var children = [];

  docIds.forEach( function( docId ){
    var childIds = this.graph.outEdges( docId ) || [];
    children = sorted.merge( children, childIds );
  }, this);

  return {
    matches: docIds,
    children: children
  };
};
