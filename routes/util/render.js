module.exports = function(res, view, data = {}) {
  res.render('index', { views: [view], ...data });
};
