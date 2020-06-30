const express = require('express');
const {createLogger, format, transports} = require('winston');


const app = express();
const myformat = format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(a => `${a.timestamp} ${a.level}: ${a.message}`)
  );

const logger = createLogger({
    transports: [
        new transports.Console({
            level:'info',
            format:myformat
        }),
        new transports.File({
            filename:'error.log',
            level:'error',
            format:myformat,
            //maxsize: 500
        }),
        new transports.File({
            filename:'info.log',
            format: myformat
        })
    ]
});
// logger.configure({
//     level: 'error',
//     transports: [
//         new transports.Console()
//     ]
// });

app.get('/', (req, res)=>{
    res.send("Hello World !!");

});
app.listen(4000, ()=>{
    logger.log('info','App listening at 4000');
    logger.info('info log');
    logger.warn('warning log,');
    logger.error('Error log');
});