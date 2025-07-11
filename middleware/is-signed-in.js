
const isSignedIn = (req, res, next) => {
  if(req.session.userId) return next();
  res.redirect("/user/sign-in");
};
module.exports = isSignedIn;

