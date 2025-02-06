/* eslint-disable no-undef */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;
require('dotenv').config();
const port = process.env.PORT || 5001;
const mongoDBurl = process.env.MONGODBURL;

/*********************************Routes*********************************/
const AuthRoutes = require('./routes/auth');
const UserRoutes = require('./routes/users');
const AppRoutes = require('./routes/app');
const TransRoutes = require('./routes/translations');

/******************************************************************/
const app = express();
app.use(cors());
app.use(express.json());
app.use(compression());
app.use(morgan('combined'));

mongoose.connect(mongoDBurl);

/*********************************Prometheus*********************************/
// Create a new registry
const register = new client.Registry();

register.setDefaultLabels({
    app: 'tms_app'
});

collectDefaultMetrics({ register });

// Create custom metrics
const httpRequestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    registers: [register],
});

// Define a default route
app.get('/', (req, res) => {
    const end = httpRequestDuration.startTimer();
    res.send('Hello, Prometheus!');
    end({ method: req.method, route: req.route.path, status_code: res.statusCode });
});

// Expose the /metrics endpoint to Prometheus
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

// Middleware to track request duration
app.use((req, res, next) => {
    const end = httpRequestDuration.startTimer();
    res.on('finish', () => {
        end({ method: req.method, route: req.route ? req.route.path : req.path, status_code: res.statusCode });
    });
    next();
});

/*********************************Authentification*********************************/
app.use('/auth', AuthRoutes);

/*********************************user*********************************/
app.use('/user', UserRoutes);

/*********************************apps*********************************/
app.use('/app', AppRoutes);

/*********************************translations*********************************/
app.use('/trans', TransRoutes);

/******************************************************************/
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});