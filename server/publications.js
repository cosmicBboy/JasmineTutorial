Meteor.publish('tutorials', function() {
  return Tutorials.find();
});

Meteor.publish('registrations', function() {
  return TutorialRegistrations.find({ userId: this.userId })
});