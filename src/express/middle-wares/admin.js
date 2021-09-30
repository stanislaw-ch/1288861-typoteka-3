'use strict';

module.exports = (req, res, next) => {

  const {user} = req.session;

  if (!user) {
    return res.redirect(`/login`);
  }

  if (user && !user.isAdmin) {
    return res.redirect(`/login`);
  }

  return next();
};
