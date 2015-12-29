
Accounts.onCreateUser(function(options, user) {
  user.activate = false;
  
  // We still want the default hook's 'profile' behavior.
  if (options.profile)
    user.profile = options.profile;
  return user;
});

Accounts.validateLoginAttempt(function(attempt){
  if (attempt.user && attempt.user.activate) {
    //new Meteor.Error(401, 'Your account is not activated!');
    return true;
  }
  return false;
  
});

Accounts.registerLoginHandler('phone', function(loginRequest) {
  //there are multiple login handlers in meteor. 
  //a login request go through all these handlers to find it's login hander
  //so in our login handler, we only consider login requests which has admin field
  
  // return undefined too pass
  // return object for ok result

  if(!loginRequest.phoneNo) {
    return undefined;
  }

  var user = Meteor.users.findOne({"profile.phone":loginRequest.phoneNo});
  if(user) {
    return {
      userId: user._id
    }
  }
  return undefined;

});
