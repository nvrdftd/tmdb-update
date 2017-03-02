'use strict';

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var retrieve = require('./retrieve');
var tvData = new retrieve.tvData();
var movieData = new retrieve.movieData();
var config = require('./config');
const host = config.host, port = config.port, username = config.username, password = config.password;

function insertData() {

  // update airing collection
  MongoClient.connect(`mongodb://${username}:${password}@${host}:${port}/tv`, function(err, db) {
    assert.equal(err, null);
    var airing = db.collection('airing');

    airing.deleteMany({}, function(err, r) {
      assert.equal(err, null);
      tvData.airing(function(docs) {
        airing.insertMany(docs, function(err, r) {
          assert.equal(err, null);
          db.close();
        });
      });
    });
  });

  // update playing collection
  MongoClient.connect(`mongodb://${username}:${password}@${host}:${port}/movie`, function(err, db) {
    assert.equal(err, null);
    var playing = db.collection('playing');

    playing.deleteMany({}, function(err, r) {
      assert.equal(err, null);
      movieData.playing(function(docs) {
        playing.insertMany(docs, function(err, r) {
          assert.equal(err, null);
          db.close();
        });
      });
    });
  });

  // update upcoming collection
  MongoClient.connect(`mongodb://${username}:${password}@${host}:${port}/movie`, function(err, db) {
    assert.equal(err, null);
    var upcoming = db.collection('upcoming');

    upcoming.deleteMany(function(err, r) {
      assert.equal(err, null);
      movieData.playing(function(docs) {
        upcoming.insertMany(docs, function(err, r) {
          assert.equal(err, null);
          db.close();
        });
      });
    });
  });
}

function insertTvVideos() {
  // update videos collection for tv db
  MongoClient.connect(`mongodb://${username}:${password}@${host}:${port}/tv`, function(err, db) {
    assert.equal(err, null);
    var videos = db.collection('videos');
    var airing = db.collection('airing');

    videos.deleteMany(function(err, r) {
      assert.equal(err, null);
      airing.distinct('id', function(err, arrOfId) {
        assert.equal(err, null);
        var count = 0;
        arrOfId.forEach(function(id) {
          tvData.videos(id, function(doc) {
            videos.insert(doc, function(err, r) {
              assert.equal(err, null);
              if (arrOfId.length === ++count) {
                db.close();
              }
            });
          });
        });
      });
    });
  });
}

function insertMovieVideos() {

  // update videos collection for movie db
  MongoClient.connect(`mongodb://${username}:${password}@${host}:${port}/movie`, function(err, db) {
    assert.equal(err, null);
    var videos = db.collection('videos');
    var playing = db.collection('playing');

    videos.deleteMany(function(err, r) {
      assert.equal(err, null);
      playing.distinct('id', function(err, arrOfId) {
        assert.equal(err, null);
        var count = 0;
        arrOfId.forEach(function(id) {
          movieData.videos(id, function(doc) {
            videos.findOneAndUpdate(
              {id: id },
              doc,
              { upsert: true }, function(err, r) {
              assert.equal(err, null);
              if (arrOfId.length === ++count) {
                db.close();
              }
            });
          });
        });
      });
    });
  });

  // update videos collection for movie db
  MongoClient.connect(`mongodb://${username}:${password}@${host}:${port}/movie`, function(err, db) {
    assert.equal(err, null);
    var videos = db.collection('videos');
    var upcoming = db.collection('upcoming');

    upcoming.distinct('id', function(err, arrOfId) {
      assert.equal(err, null);
      var count = 0;
      arrOfId.forEach(function(id) {
        movieData.videos(id, function(doc) {
          videos.findOneAndUpdate(
            {id: id },
            doc,
            { upsert: true }, function(err, r) {
            assert.equal(err, null);
            if (arrOfId.length === ++count) {
              db.close();
            }
          });
        });
      });
    });
  });
}


function insertTvCredits() {
  // update videos collection for tv db
  MongoClient.connect(`mongodb://${username}:${password}@${host}:${port}/tv`, function(err, db) {
    assert.equal(err, null);
    var credits = db.collection('credits');
    var airing = db.collection('airing');

    credits.deleteMany(function(err, r) {
      assert.equal(err, null);
      airing.distinct('id', function(err, arrOfId) {
        assert.equal(err, null);
        var count = 0;
        arrOfId.forEach(function(id) {
          tvData.credits(id, function(doc) {
            credits.insert(doc, function(err, r) {
              assert.equal(err, null);
              if (arrOfId.length === ++count) {
                db.close();
              }
            });
          });
        });
      });
    });
  });
}

function insertMovieCredits() {

  // update videos collection for movie db
  MongoClient.connect(`mongodb://${username}:${password}@${host}:${port}/movie`, function(err, db) {
    assert.equal(err, null);
    var credits = db.collection('credits');
    var playing = db.collection('playing');

    credits.deleteMany(function(err, r) {
      assert.equal(err, null);
      playing.distinct('id', function(err, arrOfId) {
        assert.equal(err, null);
        var count = 0;
        arrOfId.forEach(function(id) {
          movieData.credits(id, function(doc) {
            credits.findOneAndUpdate(
              {id: id },
              doc,
              { upsert: true }, function(err, r) {
              assert.equal(err, null);
              if (arrOfId.length === ++count) {
                db.close();
              }
            });
          });
        });
      });
    });
  });


}


// limitation of 40 queries to TMDb in 10 sec
insertData();
setTimeout(insertTvVideos, 20000);
setTimeout(insertMovieVideos, 40000);
setTimeout(insertTvCredits, 60000);
setTimeout(insertMovieCredits, 800000);
