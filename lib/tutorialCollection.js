Tutorials = new Meteor.Collection("tutorials", {
  //START HERE FOR TUTORIAL
  transform: function(doc) {
    return new Tutorial(doc._id, doc.name, doc.capacity, doc.currentCapacity, doc.owner);
  }
});

Tutorials.allow({
  insert: function(userId, doc) {
    //the user must be logged in, and the document must be owned by the user
    return (userId && doc.owner === Meteor.userId() && Roles.userIsInRole(userId, "admin"));
  }
});

Tutorial = function (id, name, capacity, currentCapacity, owner) {
  this._id =  id;
  this._name = name;
  this._capacity = capacity;
  this._currentCapacity = currentCapacity;
  this._owner = owner;
};

Tutorial.prototype = {
  get id() {
    return this._id;
  },
  get owner() {
    return this._owner;
  },
  get name() {
    return this._name;
  },
  set name(value) {
    this._name = value;
  },
  get currentCapacity() {
    return this._currentCapacity;
  },
  set currentCapacity(value) {
    this._currentCapacity = value;
  },
  get capacity() {
    return this._capacity;
  },
  set capacity(value) {
    this._capacity = value;
  },
  save: function(callback) {
    if (!this.name) {
      throw new Meteor.Error("Name is not defined!")
    }

    if (!this.capacity) {
      throw new Meteor.Error("Capacity has to be defined or bigger than zero!")
    }

    var doc = {
        name: this.name,
        capacity: this.capacity
    };

    doc.owner = Meteor.userId()

    //remember the context since in callback 
    //'this' is a different context
    var that = this;
    Tutorials.insert(doc, function(error, result){
      that._id = result;

      if (callback != null) {
        callback.call(that, error, result);
      }
    });
  },
  registerStudent: function(studentId) {
    if (this.currentCapacity >= this.capacity) {
      throw "Capacity of the tutorial has been reached!";
    }

    // check for existing registrations
    if (TutorialRegistrations.findOne({studentId: studentId}) != null) {
      throw "Student already registered!";
    }

    var that = this;
    TutorialRegistrations.insert({ tutorialId: this._id, studentId: studentId }, function (err, id) {
      if (!err) {
        that._currentCapacity += 1;
      }
    });
  },
  removeRegistration: function(studentId) {
    var tutorialRegistration = TutorialRegistrations.findOne({tutorialId: this.id, userId: studentId});

    if (tutorialRegistration == null) {
      throw "Student not registered!";
    }

    TutorialRegistrations.remove({tutorialId: this.id, userId: studentId});
    Tutorials.update( {_id: this.id}, { $inc: { currentCapacity: -1 } });
  }
};

if (Meteor.isServer) {
  Meteor.methods({
    removeTutorial: function(id) {
      //if not current user or administrator, deny access
      if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), "admin")) {
        throw new Meteor.Error(403, "Access Denied");
      }
      //if tutorial has 1 or more registrations
      if (TutorialRegistrations.find({tutorialId: id}).count() > 0) {
        throw new Meteor.Error(406, "Tutorial has registrations");
      }
      Tutorials.remove(id);
    }
  });
}
