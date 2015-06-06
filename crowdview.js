if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
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