
var _ = require('lodash'),
    sorted = require('../lib/sorted');

var enableAutoComplete = true;

function TokenGraph(){
  this.nodes = {};
  this.edges = {};
}

TokenGraph.prototype.hasToken = function( token ){
  return this.nodes.hasOwnProperty( token );
};

TokenGraph.prototype.hasTokenPrefix = function( prefix ){
  if( !this.prefixIndex ){
    console.error( 'prefix index not initalized' );
    return false;
  }

  return this.prefixIndex.hasOwnProperty( prefix );
};

TokenGraph.prototype.getToken = function( token ){
  return this.nodes[ token ];
};

TokenGraph.prototype.getTokenPrefix = function( prefix ){
  if( !this.prefixIndex ){
    console.error( 'prefix index not initalized' );
    return [];
  }

  var tokens = this.prefixIndex[ prefix ] || [];
  if( !tokens.length ){
    return [];
  }

  var ids = [];
  tokens.forEach( function( token ){
    ids = sorted.merge( ids, this.nodes[ token ] || [] );
  }, this);

  return ids;
};

TokenGraph.prototype.addToken = function( id, token ){
  if( !this.nodes.hasOwnProperty( token ) ){ this.nodes[ token ] = []; }
  this.nodes[ token ].push( id );
};

TokenGraph.prototype.setEdge = function( id1, id2, role ){
  var key = id1 + ( role ? ':' + role : '' );
  if( !this.edges.hasOwnProperty( key ) ){ this.edges[ key ] = []; }
  this.edges[ key ].push( id2 );
};

TokenGraph.prototype.sort = function(){

  // sort array
  for( var token in this.nodes ){
    this.nodes[ token ] = _.sortedUniq( _.sortBy( this.nodes[ token ] ) );
  }

  // sort edges
  for( var key in this.edges ){
    this.edges[ key ] = _.sortedUniq( _.sortBy( this.edges[ key ] ) );
  }
};

TokenGraph.prototype.outEdges = function( id, role ){
  return this.edges[ id + ( role ? ':' + role : '' ) ] || [];
};

TokenGraph.prototype.buildPrefixIndex = function(){
  this.prefixIndex = {};
  for( var token in this.nodes ){

    // generate prefixes
    for(var l=1; l<=token.length; l++){
      var prefix = token.substr( 0, l );
      if( !this.prefixIndex.hasOwnProperty( prefix ) ){
        this.prefixIndex[ prefix ] = [];
      }
      this.prefixIndex[ prefix ].push( token );
    }
  }
};

// // convenience function to instantiate graph with preset values
// TokenGraph.from = function( nodes, edges ){
//   var graph = new TokenGraph();
//   graph.nodes = nodes;
//   graph.edges = edges;
//   return graph;
// };

module.exports = TokenGraph;
