Template.tutorials.helpers({
  canDelete: function() {
    return this.currentCapacity == 0;
  },
  canRegister: function() {
    return this.currentCapacity < this.capacity && TutorialRegistrations.find({tutorialId: this._id}).count() == 0;
  },
  tutorialModel: function() {
    return new Tutorial(this._id, this.name, this.capacity, this.currentCapacity);
  }
});

Template.tutorials.events({
  "click .registerForTutorial": function(e) {
    e.preventDefault();
    this.registerStudent();
  }
});