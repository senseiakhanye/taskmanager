const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URLS, { 
        useNewUrlParser: true, 
        useCreateIndex: true,
        useUnifiedTopology: true }).then( () => {
            console.log("Connected");
        }).catch( (error) => {
            console.log("Error", error);
        });