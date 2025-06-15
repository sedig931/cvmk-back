const { Router } = require("express");
const route = new Router();
const customer = require("../schemas/customer.js");

route.get("/activeCustomer", async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.send(err);
  }
});

route.get("/customer/:id", async (req, res) => {
  try {
    res.send(await customer.findById(req.params.id));
  } catch (err) {
    res.send(err);
  }
});

route.post("/searchFrame", async (req, res) => {
  try {
    const { frameName } = req.body;
    let frameFound;
    let { frames } = await customer.findById({ _id: req.user._id });
    if (frames.find((frame) => frame.frameName === frameName)) {
      frameFound = true;
    } else {
      frameFound = false;
    }
    res.send({ frameFound: frameFound });
  } catch (err) {
    res.send(err);
  }
});

route.post("/addFrame", async (req, res) => {
  try {
    const { framName, frameInfo } = req.body;
    let { frames } = await customer.findById({ _id: req.user._id });
    if (frames.findIndex((frame) => frame.frameName === framName) === -1) {
      frames.push({ frameName: framName, frameInfo: frameInfo });
      let { freelimit } = await customer.findById({ _id: req.user._id });
      await customer.updateOne({ _id: req.user._id }, { frames: frames, freelimit: ++freelimit });
    } else {
      frames[frames.findIndex((frame) => frame.frameName === framName)] = {
        frameName: framName,
        frameInfo: frameInfo,
      };
      await customer.updateOne({ _id: req.user._id }, { frames: frames });
    }
    res.send(200);
  } catch (err) {
    res.send(err);
  }
});

route.post("/deleteFrame", async (req, res) => {
  try {
    let { frameNum } = req.body;
    let { frames } = await customer.findById({ _id: req.user._id });

    frames = frames.filter(frame => frame.frameName !== `frame_${frameNum}`)
    await customer.updateOne({ _id: req.user._id }, { frames: frames });

    res.sendStatus(200);
  } catch (err) {
    res.send(err);
  }
});

module.exports = route;
