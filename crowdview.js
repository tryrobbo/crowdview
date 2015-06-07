if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

    
    Template.listWatchSessions.helpers({
      WSList: function() {
        return WatchSessions.find();
      }
    })
        
        Router.route('/', function () {
            this.render('Home');
        });
        
        Router.route('/showall');
        
        Router.route('/display/:_id', {
            template: 'updateWatchSessionFormCustom',
            data: function() { return WatchSessions.findOne(this.params._id); }
    });
    
    
var hooksObject = {after: {
    insert: function() {
        Router.go('/display/'+this.docId );
    }
  },    
 }
    AutoForm.hooks({
  insertWatchSessionFormCustom: hooksObject
});
   
Template.updateWatchSessionFormCustom.rendered = function(){
        $('#shareLink').val(window.location);
        $('[name="Film"]').hide();            
};

Template.filmsearch.events({
    'submit form':function(event, t) {
      event.preventDefault();

      var filmName = t.find('#filmName').value
      filmName.replace(/\s+/g, '+').toLowerCase();

      var json = filmSearch(filmName);
    },

    'click #filmSearchButton': function(event, t){

      event.preventDefault();

      var filmName = t.find('#filmName').value
      filmName.replace(/\s+/g, '+').toLowerCase();

      var json = filmSearch(filmName);
    },

    'click #searchclear':function(event,t) {
      $("#filmName").val("");
      $("#filmName").css({
          background: "white",
          color: "black",
        });
      $("[name='Film']").val("");

      $("#searchResults").empty();

      var table = "<table class='table'><tbody><tr class='movieRow'><td class='poster poster1'><div style='height:50px;'></div></td><td class='title title1'></td><td class='year year1'></td></tr><tr  class='movieRow'><td class='poster poster2'><div style='height:50px;'></div></td><td class='title title2'></td><td class='year year2'></td></tr><tr  class='movieRow'><td class='poster poster3'><div style='height:50px;'></div></td><td class='title title3'></td><td class='year year3'></td></tr></tbody></table>"

      $("#searchResults").append(table);      
    },

    'click .movieRow':function(event,t) {
      // Select Film
      var movieID = event.target.id;
      var url = "http://www.omdbapi.com/?i=" + movieID + "&plot=long&r=json";
      
      var html = "<div class='thumbnail movieCard'>"

      $.post(url, function(data){
        if (data.Poster == "N/A") {
          html += "<img src='http://a-z-animals.com/media/animals/images/original/hamster3.jpg'>"
        }
        else {
          html += "<img src='" + data.Poster + "'>"; 
        }
        html += "<h3>" + data.Title + "</h3>";
        html += "</div>";

        html = createMovieCard(data);

        // $("#chosenFilm").empty().append(html);
        $("#searchResults").empty().append(html);

        $("#filmName").val(data.Title);
        $("#filmName").css({
          background: "#3FC380",
          color: "white",
        });
        $('[name="Film"]').val("");
        $('[name="Film"]').val(data.Title);
      });

      // $("#chosenFilm").empty().append("Movie ID = " + event.target.id + " Chosen");       

    },

    'click .selectButton':function(event,t){
        // Select Movie
        console.log(event.target.id + " selected");
      }
  });

Template.movieCard.rendered = function(){
        
      var movieTitle = $("[name='Film']").val();
      var url = "http://www.omdbapi.com/?t=" + movieTitle + "&plot=long&r=json";
      
      var html = ""

      $.post(url, function(data){
        if (data.Poster == "N/A") {
          html += "<img src='http://a-z-animals.com/media/animals/images/original/hamster3.jpg'>"
        }
        else {
          html += "<img src='" + data.Poster + "'>"; 
        }
        html += "<h3>" + data.Title + "</h3>";
        html += "</div>";

        html = createMovieCard(data);

        // $("#chosenFilm").empty().append(html);
        $("#searchResults").empty().append(html);

        $('[name="Film"]').show();

        $('#filmName').val(movieTitle);
      });
}

Template.movieCard.events({
  'submit form':function(event, t) {
      event.preventDefault();

      var filmName = t.find('#filmName').value
      filmName.replace(/\s+/g, '+').toLowerCase();

      var json = filmSearch(filmName);
    },
    'click #searchclear':function(event,t) {
      $("#filmName").val("");
      $("#filmName").css({
          background: "white",
          color: "black",
        });
      $("[name='Film']").val("");

      $("#searchResults").empty();

      var table = "<table class='table'><tbody><tr class='movieRow'><td class='poster poster1'><div style='height:50px;'></div></td><td class='title title1'></td><td class='year year1'></td></tr><tr  class='movieRow'><td class='poster poster2'><div style='height:50px;'></div></td><td class='title title2'></td><td class='year year2'></td></tr><tr  class='movieRow'><td class='poster poster3'><div style='height:50px;'></div></td><td class='title title3'></td><td class='year year3'></td></tr></tbody></table>"

      $("#searchResults").append(table);      
    },

    'click .movieRow':function(event,t) {
      // Select Film
      var movieID = event.target.id;
      var url = "http://www.omdbapi.com/?i=" + movieID + "&plot=long&r=json";
      
      var html = "<div class='thumbnail movieCard'>"

      $.post(url, function(data){
        if (data.Poster == "N/A") {
          html += "<img src='http://a-z-animals.com/media/animals/images/original/hamster3.jpg'>"
        }
        else {
          html += "<img src='" + data.Poster + "'>"; 
        }
        html += "<h3>" + data.Title + "</h3>";
        html += "</div>";

        html = createMovieCard(data);

        // $("#chosenFilm").empty().append(html);
        $("#searchResults").empty().append(html);

        $("#filmName").val(data.Title);
        $("#filmName").css({
          background: "#3FC380",
          color: "white",
        });
        $('[name="Film"]').val("");
        $('[name="Film"]').val(data.Title);
      });

      // $("#chosenFilm").empty().append("Movie ID = " + event.target.id + " Chosen");       

    },
});

}


/***********************************************************************/
// Search Movies Functions
var filmSearch = function(filmName) {
  console.log("SEARCH " + filmName);
  
  // OMDB API
  var url = "http://www.omdbapi.com/?s=" + filmName;

  // Find Any Film API
  var fafurl = "http://api.findanyfilm.com/search_g.php?apikey=864422500&title=" + filmName;

  // Rovi API
  var roviUrl = "";

  var results = "";

  console.log("POST")
  $.post(url, function(data) {
    data= data["Search"];
    // var json = JSON.parse(data);
    var json = data
    console.log(data);

    if (!json) {
      var error = ":( No results found for '" + filmName + "'";
      $(".title .tile1").empty().append(error);
      return
    }
    parseFilmToHTML(json);
    // $("#searchResults").empty().append(parseFilmToHTML(json));
  });
}

var parseFilmToHTML = function(json) {
  var html = "<table class='table table-hover'><tbody>"

  var counter = 0;
  for (var x = 0; counter < 3 && counter < json.length ; x++) {
    if (json[x].Type != "game") {
      console.log("FOR " + json[x]);
      
      var posterElement = ".poster" + (counter + 1);
      var titleElement = ".title" + (counter + 1);
      var yearElement = ".year" + (counter + 1);

      $(posterElement).attr("id",json[x].imdbID);
      $(titleElement).attr("id",json[x].imdbID);
      $(yearElement).attr("id",json[x].imdbID);

      var url = "http://www.omdbapi.com/?i=" + json[x].imdbID + "&plot=short&r=json";
      
      $.post(url, function(data){
        var poster = data.Poster;
        if (data.Poster == 'N/A') {
          poster = "http://a-z-animals.com/media/animals/images/original/hamster3.jpg"
        }

        var posterElementTemp = "#" + data.imdbID + ".poster";
        var titleElementTemp = "#" + data.imdbID + ".title";
        var yearElementTemp= "#" + data.imdbID + ".year";

        console.log(posterElementTemp);
        console.log(titleElementTemp);
        console.log(yearElementTemp);

        var posterImg = "<img src='" + poster + "'style='height:50px'>";
        var titleDiv = data.Title;
        var yearDiv = data.Year;

        $(posterElementTemp).empty().append(posterImg);
        $(titleElementTemp).empty().append(titleDiv);
        $(yearElementTemp).empty().append(yearDiv);

        $("table").addClass(" table-hover");

      });

      counter++;
    }
  }
}

var createMovieCard = function(movie) {
  var poster = movie.Poster
  if (poster == "N/A") {
    poster = "http://a-z-animals.com/media/animals/images/original/hamster3.jpg";
  }
  var html = "<div id='filmCard'><div class='row'><div class='col-xs-5'><img class='img-responsive' src='" + poster + "'></div><div class='col-xs-7'><h3>" + movie.Title + "<small> - (" + movie.Year + ")</small></h3><span id='imdbRating'>" + movie.imdbRating + "</span><div id='genre'>Genre : " + movie.Genre + "</div></div></div></div>"
  return html
}

/***********************************************************************/

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}


WatchSessions = new Mongo.Collection("watchSessions");
WatchSessions.attachSchema(new SimpleSchema({
  Film: {
    type: String,
    label: "Film",
    max: 200
  },
  People: {
    type: [String],
    label: "People"
  },
  Time: {
    type: Date,
    label: "Time",
    min: 0
  },
    
  }
));



