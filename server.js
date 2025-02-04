const app = require('./src/app');
const process = require('process');

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    console.log(`Click here to open: http://localhost:${process.env.PORT}`);
    
});

process.on('SIGINT', () => {
    server.close(() => {
        console.log('Server closed');
    });
});