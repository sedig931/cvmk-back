const mongoose = require('mongoose');

mongoose
    .connect("mongodb+srv://sedig931:mongodbsiddigA5735354@salesclustor.0bmk5.mongodb.net/market_project?retryWrites=true&w=majority&appName=SalesClustor")
    .then(() => console.log('Connect to DB'))
    .catch((err) => console.log(err));
