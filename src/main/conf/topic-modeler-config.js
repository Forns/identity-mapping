/**
 *  topic-modeler.js
 * 
 *  Provides LDA topic modeling for the Node.js backend 
 */

module.exports = function (db) {
  
  /*
  var topicise = function () {
    var documents = new Array(),
        f = {},
        vocab=new Array();
    for (var i = 0; i < sentences.length; i++) {
      if (sentences[i] == "") {
        continue;
      }
      documents[i] = new Array();
      //console.log(sentences[i]);
      var words = sentences[i].split(/[\s,\"]+/);
      //console.log(words);
      if(!words) continue;
      for(var wc=0;wc<words.length;wc++) {
        var w=words[wc].toLowerCase().replace(/[^a-z\'A-Z0-9 ]+/g, '');
        if (w=="" || w.length==1 || stopwords[w] || w.indexOf("http")==0) continue;
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
    var K = parseInt($( "#topics" ).val());
    var alpha = 0.1;  // per-document distributions over topics
    var beta = .01;  // per-topic distributions over words
  
    lda.configure(documents,V,10000, 2000, 100, 10);
    lda.gibbs(K, alpha, beta);
  
    var theta = lda.getTheta();
    var phi = lda.getPhi();
  
    var text = '';
  
    //topics
    var topTerms=20;
    var topicText = new Array();
    for (var k = 0; k < phi.length; k++) {
      text+='<canvas id="topic'+k+'" class="topicbox color'+k+'"><ul>';
      var things = new Array();
      for (var w = 0; w < phi[k].length; w++) {
         things.push(""+phi[k][w].toPrecision(2)+"_"+vocab[w]);
      }
      things.sort().reverse();
      //console.log(things);
      if(topTerms>vocab.length) topTerms=vocab.length;
      topicText[k]='';
      for (var t = 0; t < topTerms; t++) {
        var topicTerm=things[t].split("_")[1];
        var prob=parseInt(things[t].split("_")[0]*100);
        if (prob<2) continue;
        text+=( '<li><a href="javascript:void(0);" data-weight="'+(prob*2)+'" title="'+prob+'%">'+topicTerm +'</a></li>' );     
        console.log(topicTerm+" = " + prob  + "%");
        topicText[k] += ( topicTerm +" ");
      }
      text+='</ul></canvas>';
    }
    $('#topiccloud').html(text);
    
    text='<div class="spacer"> </div>';
    // sentences
    for (var m = 0; m < theta.length; m++) {
      text+='<div class="tweet">';
      text+='<img class="dp" src="'+tweets[m].profile_image_url+'"/>';
      text+=tweets[m].text+'<br/>';
      for (var k = 0; k < theta[m].length; k++) {
        text+=('<div class="box bgcolor'+k+'" style="width:'+parseInt(""+(theta[m][k]*100))+'px" title="'+topicText[k]+'"></div>');
      }
      text+='</div>';
    }
  
    $("#output").html(twttr.txt.autoLink(text));
  
    for (var k = 0; k < phi.length; k++) {
      if(!$('#topic'+k).tagcanvas({
            textColour: $('#topic'+k).css('color'),
          maxSpeed: 0.03,
          initial: [0.1,-0.1],
          decel: 0.98,
          reverse: true,
          weightSize:2,
          weightMode:'size',
          weightFrom:'data-weight',
          weight: true
        })) 
      {
        $('#topic'+k).hide();
      } 
    }
  }
  
  $(document).ready(function(){
    var select = $( "#topics" );
    var slider = $( "<div id='slider'></div>" ).insertAfter( select ).slider({
      min: 2,
      max: 10,
      range: "min",
      value: select[0].selectedIndex+2,
      slide: function( event, ui ) {
        select[0].selectedIndex = ui.value-2;
      }
    });
    $( "#topics" ).change(function() {
      slider.slider( "value", this.selectedIndex + 2 );
    });
  });
  
  function doit() {
    $('#btnTopicise').attr('disabled','disabled');
    $.ajax( 
      {url:'http://search.twitter.com/search.json?rpp=100&include_entities=false&include_rts=false&q='+encodeURIComponent($('#username').val()),
      dataType:'jsonp',
      success:function(data) {
        sentences = new Array();
        tweets=new Array();
        $(data.results).each(function(i,status) {
          sentences.push($("<div/>").html(status.text).text());
          tweets.push(status);
        });
        topicise();
        $('#btnTopicise').removeAttr('disabled');
        
      }
    });
    
  }
  */
  
  return this;
};
