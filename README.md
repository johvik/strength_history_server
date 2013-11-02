Strength History Server
=======================
[![Build Status](https://travis-ci.org/johvik/strength_history_server.png?branch=master)](https://travis-ci.org/johvik/strength_history_server) [![Coverage Status](https://coveralls.io/repos/johvik/strength_history_server/badge.png)](https://coveralls.io/r/johvik/strength_history_server)

A simple server for Strength History to store your data online.

To setup your own server you need a MongoDB and a `config.js` file.
The easiest way to do this is to rename `sample_config.js` which includes all the needed configuration values.
Then start it with `npm start`.

API
---
The server has a RESTful API which can be used to access data.

###Routes
Note that the following description assumes that a valid request was made and that no error occurred.

####Exercise
`DELETE /exercise/:_id` Returns a JSON object with _id.

`GET /exercise/latest/:_id` Returns the latest Workout Data including an exercise with _id.

`GET /exercise` Returns a JSON array with Exercise.

`GET /exercise/:_id` Returns Exercise with _id.

`POST /exercise` Returns the created Exercise.

`PUT /exercise/:_id` Returns the updated Exercise.

####History Data
`GET /historydata` Returns a JSON array with Weight and Workout Data.

`GET /historydata/pages` Returns the number of pages available.

`GET /historydata/pages/:page` Returns a JSON array with Weight and Workout Data at page.

####Sync
`GET /sync` Returns a JSON array with Sync.

####User
`GET /logout` Redirects to /.

`GET /logout?no_redirect` Returns 200 without redirecting.

`POST /login` Returns 200 on success.

`POST /signup` Returns 200 on success.

####Weight
`DELETE /weight/:_id` Returns a JSON object with _id.

`GET /weight/latest` Returns the latest Weight.

`GET /weight` Returns a JSON array with Weight.

`GET /weight/:_id` Returns Weight with _id.

`POST /weight` Returns the created Weight.

`PUT /weight/:_id` Returns the updated Weight.

####Workout
`DELETE /workout/:_id` Returns a JSON object with _id.

`GET /workout/latest/:_id` Returns the latest Workout Data including a workout with _id.

`GET /workout` Returns a JSON array with Workout.

`GET /workout/:_id` Returns Workout with _id.

`POST /workout` Returns the created Workout.

`PUT /workout/:_id` Returns the updated Workout.

####Workout Data
`DELETE /workoutdata/:_id` Returns a JSON object with _id.

`GET /workoutdata` Returns a JSON array with Workout Data.

`GET /workoutdata/:_id` Returns Workout Data with _id.

`POST /workoutdata` Returns the created Workout Data.

`PUT /workoutdata/:_id` Returns the updated Workout Data.

###Data types
####Exercise
`_id` : ObjectId,

`name` : String,

`standardIncrease` : Array ObjectId,

`sync` : Number

####Weight
`_id` : ObjectId,

`time` : Number,

`weight` : Number,

`sync` : Number

####Workout
`_id` : ObjectId,

`name` : String,

`exercises` : Array ObjectId,

`sync` : Number

####Workout Data
`_id` : ObjectId,

`time` : Number,

`workout` : ObjectId,

`data` : Array {

&nbsp;&nbsp;`exercise` : ObjectId,

&nbsp;&nbsp;&nbsp;&nbsp;`sets` : Array {

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`weight` : Number,

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`reps` : Number
        }
    },

`sync` : Number

###Other types
####Sync
`table` : String,

`hash` : Number,

`counter` : Number

####User
`email` : String,

`password` : String

* * *
Make sure you have a look at all the other components of Strength History:
- [Strength History Android](https://github.com/johvik/strength_history_android) - Android application
- [Strength History Server](https://github.com/johvik/strength_history_server) - Server and API
- [Strength History Web](https://github.com/johvik/strength_history_web) - Web client
