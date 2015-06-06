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
        $('#shareLink').val(window.location);};

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

        $("#chosenFilm").empty().append(html);
      });

      // $("#chosenFilm").empty().append("Movie ID = " + event.target.id + " Chosen");       
    },

    'click .selectButton':function(event,t){
        // Select Movie
        console.log(event.target.id + " selected");
      }
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
      $("#searchResults").empty().append(error);
      return
    }
    
    $("#searchResults").empty().append(parseFilmToHTML(json));
  });
}

var parseFilmToHTML = function(json) {
  var html = "<table class='table table-hover'><tbody>"

  var counter = 0;
  for (var x = 0; counter < 5 && counter < json.length ; x++) {
    if (json[x].Type != "game") {
      html += "<tr class='movieRow' id='"+ json[x].imdbID +"'>"

      console.log("FOR " + json[x]);
      
      var url = "http://www.omdbapi.com/?i=" + json[x].imdbID + "&plot=short&r=json";
      
      $.ajax({
        type: "POST",
        url: url,
        async:false,
        success: function(data) {
          if (data.Poster == "N/A") {
            html += "<td id='"+ json[x].imdbID +"'>" + "<img src='http://a-z-animals.com/media/animals/images/original/hamster3.jpg' style='height:50px;'>" + "</td>";
          }
          else {
            var poster = data.Poster;
            var jpg = "._SX40_CR0,0,40,54_.jpg";
            poster = poster.substring(0,poster.length-10);
            poster += jpg;
            html += "<td id='"+ json[x].imdbID +"'>" + "<img src='" + poster + "' style='height:50px;'>" + "</td>";  
          }
          html += "<td id='"+ json[x].imdbID +"'>" + json[x].Title + "</td>";
          html += "<th id='"+ json[x].imdbID +"'>" + json[x].Year + "</th>";
        
          html += "</tr>"
        }
      });

      counter++;
    }
  }

  html += "</tbody></table>";
  console.log(html);

  return html
}

var createMovieCard = function(movie) {
  var poster = movie.Poster
  if (poster == "N/A") {
    poster = "http://a-z-animals.com/media/animals/images/original/hamster3.jpg";
  }
  var html = "<div id='filmCard'><div class='row'><div class='col-sm-6'><img style='width:100%' id ='poster' src='" + poster + "' align=left></div><div class='col-sm-6'><div id='title'><h1>" + movie.Title + "<small> (" + movie.Year + ") </small></h1></div><div><b>Rating : </b><span id='imdbRating'>" + movie.imdbRating + "</span></div><div id='genre'><b>Genre : </b>" + movie.Genre + "</div><div id='plot'><b>Plot : </b>" + movie.Plot + "</div><div><button id='" + movie.imdbID + "' class='btn btn-success btn-lg selectButton'>Select</button></div></div></div>"
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



