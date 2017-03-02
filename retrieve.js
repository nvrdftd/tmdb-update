'use strict';

var https = require('https');
var assert = require('assert');
var config = require('./config');
const host = 'api.themoviedb.org'
const key = config.key;

function tvData() {
  this.airing = function(cb) {

      var options = {
        protocol: 'https:',
        host: host,
        path: '/3/tv/on_the_air?api_key=' + key
      };

      var req = https.get(options, function(res) {
        res.on('data', function(chunk) {
          var arr = JSON.parse(chunk).results;
          cb(arr);
        });
      });
  };

  this.videos = function(tvId, cb) {

    var options = {
      protocol: 'https:',
      host: host,
      path: '/3/tv/' + tvId + '/videos?api_key=' + key
    }

    var req = https.get(options, function(res) {
      res.on('data', function(chunk) {
        var doc = JSON.parse(chunk);
        cb(doc);
      });
    });
  };

  this.credits = function(tvId, cb) {

    var options = {
      protocol: 'https:',
      host: host,
      path: '/3/tv/' + tvId + '/credits?api_key=' + key
    }

    var req = https.get(options, function(res) {
      let data = '';
      res.on('data', function(chunk) {
        data += chunk;
      });
      res.on('end', function() {
        cb(JSON.parse(data));
      })
    });
  };
}

function movieData() {
  this.playing = function(cb) {

      var options = {
        protocol: 'https:',
        host: host,
        path: '/3/movie/now_playing?api_key=' + key
      };

      var req = https.get(options, function(res) {
        res.on('data', function(chunk) {
          var arr = JSON.parse(chunk).results;
          cb(arr);
        });
      });
  };

  this.upcoming = function(cb) {

      var options = {
        protocol: 'https:',
        host: host,
        path: '/3/movie/upcoming?api_key=' + key
      };

      var req = https.get(options, function(res) {
        res.on('data', function(chunk) {
          var arr = JSON.parse(chunk).results;
          cb(arr);
        });
      });
  };

  this.videos = function(movieId, cb) {

    var options = {
      protocol: 'https:',
      host: host,
      path: '/3/movie/' + movieId + '/videos?api_key=' + key
    }

    var req = https.get(options, function(res) {
      res.on('data', function(chunk) {
        var doc = JSON.parse(chunk);
        cb(doc);
      });
    });
  };

  this.credits = function(movieId, cb) {

    var options = {
      protocol: 'https:',
      host: host,
      path: '/3/movie/' + movieId + '/credits?api_key=' + key
    }

    var req = https.get(options, function(res) {
      var data = '';
      res.on('data', function(chunk) {
        data += chunk;
      });
      res.on('end', function() {
        cb(JSON.parse(data));
      });
    });
  };
}

module.exports.tvData = tvData;
module.exports.movieData = movieData;
