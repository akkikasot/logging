const express = require('express');
require('winston-mongodb');
require('dotenv/config');
const {createLogger, format, transports} = require('winston');


const app = express();
// customized format for the logs
const myformat = format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(a => `${a.timestamp} ${a.level}: ${a.message}`)
  );
// logger and different type of transport
const logger = createLogger({
    transports: [
        new transports.Console({
            level:'info',
            format:myformat
        }),
        new transports.File({
            filename:'error4.log',
            level:'error',
            format:myformat,
            handleExceptions: true // handling uncaughtexception
            //maxsize: 500
        }),
        new transports.MongoDB({
            level:'error',
            db: process.env.MongoDB,
            collection: 'error3_log',
            handleExceptions: true,
            options: {
                useUnifiedTopology: true
            }
           // format: format.combine(format.timestamp(), format.json())
        })
    ],
    //for handling uncaughtexception method 1
    exceptionHandlers: [
        new transports.File({
             filename: 'exceptions.log' 
            })
      ]
});
  //for handling uncaughtexception method 2
logger.exceptions.handle(
    new transports.File({ filename: 'exceptionshandle.log' })
  );
//console.log(undefinedVariable); // To reproduce uncaughtexception

//TO make configure the log level
/*logger.configure({
    level: 'error',
    transports: [
        new transports.Console()
    ]
});*/

//TRY-CATCH Block
app.get('/', (req, res, next)=>{
    try {
        res.status(200).jsonv({
            code:200,
            message:'Success'
        })
    } catch (error) {
       // logger.error(`error: ${error.message}`)
        next(error.message)
    }
});

app.use(function(err,req, res, next){
    logger.error(err);
    res.status(500).send('Something has broke!');
})
app.listen(4000, ()=>{
    logger.log('info','App listening at 4000');
    logger.warn('warning log,');
    logger.error('Error log');
});