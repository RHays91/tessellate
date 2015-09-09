module.exports = function (app, passport) {
  // These are protected resources --> will not be accessible if user
  // is not logged in with facebook

  // Route to test if user is logged in or not
  app.get('/loggedin', function (req, res){
    if (req.isAuthenticated()){
      res.send(req.user);
    } else {
      res.redirect('/');
    }
  });

  // Logout of our app
  app.get('/logout', function (req, res){
    req.logout();
    res.redirect('/');
  });

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  /* FACEBOOK AUTH ROUTES */
  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  app.get('/auth/facebook',
    passport.authenticate('facebook', {
      scope: ['email', 'user_friends'], 
      display: 'touch' 
    }),
    function (req, res){
      // Request redirected to facebook so this function does not get called
    });

  // On user interaction with facebook login, redirected back to here
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/main.html', //redirect to landing page for now --> will be account/event page once it exists
      failureRedirect: '/'
    })
  );

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


  /**
   * Intermediary to ensure user is logged in.
   * @param  req
   * @param  res
   * @param  {Function} next
   * @return {Boolean}       app flow continues if next returned (user logged in)
   */
  function isLoggedIn (req, res, next){
    if (req.isAuthenticated()){
      return next();
    } else {
      res.send(401);
    }
  };
};