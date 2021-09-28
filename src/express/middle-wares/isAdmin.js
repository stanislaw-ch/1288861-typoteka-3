'use strict';

module.exports = (req, res, next) => {

  const {user} = req.session;

  if (!user.isAdmin) {
    return res.redirect(`/`);
  }
  return next();
};
