const { Router, json } = require("express");
const route = new Router();
const customer = require("../schemas/customer.js");
const fs = require("fs");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
    // req.send(file);
  },
});
const upload = multer({ storage });

route.post("/setUserFramePhoto", upload.single("photo"), async (req, res) => {
  try {
    const { cvNum } = req.body;
    const photoName = req.file.filename;
    let customer1 = await customer.findById({ _id: req.user._id });

    // check if frame allready had photo..
    if (
      customer1.framePhotoNames.find(
        (photoNameInfo) => photoNameInfo.frameNum === cvNum
      )
    ) {
      const fileName4delete =
        customer1.framePhotoNames[
          customer1.framePhotoNames.findIndex(
            (photoNameInfo) => photoNameInfo.frameNum === cvNum
          )
        ].photoName;
      customer1.framePhotoNames[
        customer1.framePhotoNames.findIndex(
          (photoNameInfo) => photoNameInfo.frameNum === cvNum
        )
      ].photoName = photoName;
      fs.unlinkSync(`uploads/cvmk/${fileName4delete}`);
    } else {
      customer1.framePhotoNames.push({
        frameNum: cvNum,
        photoName: photoName,
      });
    }
    await customer.updateOne(
      { _id: req.user._id },
      { framePhotoNames: customer1.framePhotoNames }
    );

    res.send(201);
  } catch (err) {
    throw err;
  }
});

module.exports = route;
