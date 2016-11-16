var app=angular.module("quote-gen", []);

app.controller("MainController", MainController);
app.service("QuoteService", QuoteService);
app.constant("BaseURI", "//quotesondesign.com/wp-json/posts");
app.filter("HTMLFilter", HTMLFilter);
app.filter("Html", Html);
app.service("TweetService", TweetService);
/*
app.config(['$httpProvider', function($httpProvider){
  if(!$httpProvider.defaults.headers.get) {
    $httpProvider.defaults.headers.get = {};
  }
  //$httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
  //$httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
  //$httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
  
}]);
*/
MainController.$inject = ["QuoteService", "TweetService", "$filter"];

function MainController(QuoteService, TweetService, $filter) {
  ctrl = this;
  ctrl.quote = "";
  ctrl.author = "";
  
 
  
  ctrl.getNewQuote = function() {
     //console.log("Getting new Quote");
     QuoteService.getQuote().then(function(data){
      //console.log("Successful response");
      //console.log(data.data[0]);
      var quotes = data.data;
      ctrl.quote = quotes[0].content;
      ctrl.author = quotes[0].title;
      //console.log(quotes[0].content);
    
    }).catch(function(error){
       
       console.log(error);
     });
  };
  
  ctrl.getNewQuote();
  
  ctrl.share = function() {
    var text = $filter('HTMLFilter')(ctrl.quote);
    var text2 = $filter('Html')(text);
    TweetService.tweet(text2 + "\n" + "- " + ctrl.author);
  }
  
}

QuoteService.$inject = ["$http", "BaseURI"];

function QuoteService($http, BaseURI) {
  var service = this;
  
  service.getQuote = function() {
    $http.defaults.cache = false;
   // $http.defaults.headers['Cache-Control'] = 'no-cache';
    //$http.defaults.headers['Pragma'] = 'no-cache';
    //$http.defaults.headers['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    var rand = Math.round(Math.random() * 1000)
    return $http.get(BaseURI + "?filter[orderby]=rand&filter[posts_per_page]=1&Date="+rand);
    
  };
  
}

function HTMLFilter() {
  return function(text) {
    return text ? String(text).replace(/<[^>]+>/gm, '') : text;
  };
}

Html.$inject = ['$sce'];

function Html($sce) {
  return function(text) {
    return $sce.trustAsHtml(text);
  }
}

function TweetService() {
  var service = this;
  
  service.tweet = function(obj) {
    
    var text = encodeURIComponent(obj);
    
    window.open('//twitter.com/intent/tweet?text='+text,'_blank',"height=350,width=500");
  }
}