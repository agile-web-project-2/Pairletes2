var mongoose = require('mongoose');
var mlab = require('../mlab-user-pass'); // place 'mlab-user-pass.js' in root project dir
var gracefulShutdown;

// if needs user and pass mongodb://username:password@localhost:27027/database
var dbURI = 'mongodb://'+mlab.user+':'+mlab.pass+'@ds149501.mlab.com:49501/pairletes'
mongoose.connect(dbURI);

/***********************************/
/*      Connection Monitoring      */
/***********************************/
// Monitoring for successful connection through mongoose
mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});
// Checking for connection error
mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});
// Checking for disonnection event
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

/***********************************/
/*   Graceful Connection Shutdown  */
/***********************************/
// close Mongoose connection, passing through an anonymous function to run when closed.
gracefulShutdown = function (msg, callback) {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

/***********************************/
/*      Closing the Connection     */
/***********************************/
// App doesn't auto close the connection so it needs to be closed manually

// listen SIGINT (Operating System)
process.on('SIGINT', function () {
    gracefulShutdown('app termination', function () {
        process.exit(0);
    });
});

// listen SIGUSR2 (nodemon restart interupt)
process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', function () {
        process.kill(process.pid, 'SIGUSR2');
    });
});

// listen SIGTERM (Interupt for Heroku)
process.on('SIGTERM', function() {
    gracefulShutdown('Heroku app shutdown', function () {
        process.exit(0);
    });
});

/*********************************/
/*      IMPORT YOUR MODELS       */
/*********************************/
require('./person.js');
require('./message.js');
