
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const errorhandler = require('errorhandler');
const path = require('path');

const app = express();
require('./models'); //calls index.js to setup DB.
require('./config/passport');

const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.json')[env];
console.log(`Environment: ${env}`);

const isProd = process.env.NODE_ENV === 'production';

// Settings -----------------------------------------------------------------------
// process.env.TZ = 'GMT-3';
process.env.TZ = 'America/Buenos_Aires';
// app.set('tz', process.env.TZ || 'GMT-3');
app.set('tz', process.env.TZ || 'America/Buenos_Aires');
console.log("TimeZone: " + process.env.TZ + " -> " + new Date());
app.set('port', process.env.PORT || 3000);

// Middlewares(functions) ---------------------------------------------------------
app.use(morgan('dev')); //logger DEV.
app.use(express.json()); //Json for WS.
//FOR ANGULAR:
app.use(express.static(path.join(__dirname, '../frontend/dist/frontend')));
app.use(cors());
app.use(session({ secret: config.jwtsecret, cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

//Routes ---------------------------------------------------------------------------
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/friend', require('./routes/friend.routes'));
app.use('/api/voting-table', require('./routes/voting-table.routes'));
app.use('/api/election', require('./routes/election.routes'));
app.use('/api/scpl/client', require('./routes/scpl_client.routes'));
app.use('/api/ping', require('./routes/ping.routes'));

// FOR ANGULAR: Catch all other routes and return the index file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/frontend/index.html'));
    
  });

//Others:
if (!isProd) {
    //app.use(errorhandler());
}

//exec if there is no route.
app.use((req, res, next) => {
    var err = new Error('API Not Found.');
    err.status = 404;
    next(err);
});

//error handlers response
//dev error handler will print stacktrace.
app.use((err, req, res, next) => {
    if (!isProd)
        console.log(err.stack);
    res.status(err.status || 500);
    res.json({ 'errors': { message: err.message, error: isProd ? {} : err } });
});

//Boot -----------------------------------------------------------------------------
app.listen(app.get('port'), () => {
    console.log('Server on port:', app.get('port'));
});