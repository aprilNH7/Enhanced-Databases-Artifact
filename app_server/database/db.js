require('dotenv').config();
const mongoose = require('mongoose');
const dbURL = process.env.MONGODB_URI || `mongodb://localhost/travlr`;

mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

const connect = () => {
    mongoose.connect(dbURL, { autoIndex: true }).then(() => {
        console.log('Database connection successful');
    }).catch(err => {
        console.log('Database connection error: ' + err);
        setTimeout(connect, 5000);
    });
};

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to ' + dbURL);
});

mongoose.connection.on('error', err => {
    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

const gracefulShutdown = (msg, callback) => {
    mongoose.connection.close(() => {
        console.log(`Mongoose disconnected through ${msg}`);
        callback();
    });
};

process.on('SIGINT', gracefulShutdown.bind(null, 'app termination'));
process.on('SIGTERM', gracefulShutdown.bind(null, 'Heroku app shutdown'));
process.on('SIGUSR2', gracefulShutdown.bind(null, 'nodemon restart'));

connect();
