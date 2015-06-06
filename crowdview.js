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
    
}
    

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



