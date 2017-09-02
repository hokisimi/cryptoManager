module.exports = function(){

  const route = require('express').Router();
  const conn = require('../config/db')();

  route.get('', function(req, res){

    res.redirect('/yield');
  });

  return route;
}
