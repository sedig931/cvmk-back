const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://sedig931_db_user:hVChDuC9zi0OnGyo@cvmkclustor.p5k1hma.mongodb.net/cvMakerProject?appName=cvMKClustor",
  )
  .then(() => console.log("Connect to DB"))
  .catch((err) => console.log(err));
