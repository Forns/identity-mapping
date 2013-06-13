/**
 * topic-modeler.js
 * 
 * Provides LDA topic modeling for the Node.js backend
 * 
 * Credit to Awais Athar for the conversion to js
 * http://chaoticity.com/lda-based-topic-modelling-in-javascript/
 */

module.exports = function (db, lda) {
  var $TM = {};
  
  $TM.getTopics = function (sentences) {
    var documents = new Array(),
        f = {},
        vocab = new Array();
    for (var i = 0; i < sentences.length; i++) {
      if (sentences[i] == "") {
        continue;
      }
      documents[i] = new Array();
      var words = sentences[i].split(/[\s,\"]+/);
      if(!words) continue;
      for(var wc=0;wc<words.length;wc++) {
        var w=words[wc].toLowerCase().replace(/[^a-z\'A-Z0-9 ]+/g, '');
        if (w=="" || w.length==1 || w.indexOf("http")==0) continue;
        if (f[w]) { 
          f[w]=f[w]+1;      
        } 
        else if(w) { 
          f[w]=1; 
          vocab.push(w); 
        };    
        documents[i].push(vocab.indexOf(w));
      }
    }
      
    var V = vocab.length;
    var M = documents.length;
    var K = 3; // Assume 3 topics, for now
    var alpha = 0.1;  // per-document distributions over topics
    var beta = .01;  // per-topic distributions over words
  
    lda.configure(documents,V,10000, 2000, 100, 10);
    lda.gibbs(K, alpha, beta);
  
    var theta = lda.getTheta();
    var phi = lda.getPhi();
  
    // Topic calculation
    var topTerms=20;
    var topicText = [];
    var topicProbs = [];
    for (var k = 0; k < phi.length; k++) {
      topicText[k] = [];
      topicProbs[k] = [];
      var things = new Array();
      for (var w = 0; w < phi[k].length; w++) {
         things.push(""+phi[k][w].toPrecision(2)+"_"+vocab[w]);
      }
      things.sort().reverse();
      if(topTerms>vocab.length) topTerms=vocab.length;
      for (var t = 0; t < topTerms; t++) {
        var topicTerm=things[t].split("_")[1];
        var prob=parseInt(things[t].split("_")[0]*100);
        if (prob<2) continue;
        topicProbs[k][t] = prob;
        topicText[k][t] = topicTerm;
      }
    }
    
    return {topics: topicText, probabilities: topicProbs}
  }
  
  this.$TM = $TM;
  
  return this;
};
