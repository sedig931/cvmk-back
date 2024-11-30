
const { Router } = require("express");
const branchRouter = new Router();

const customer = require("./routes/customerRoute.js");
const getCustomer = require("./routes/getCustomerRoute.js");
const payments = require("./routes/paymentMethods.js");
const setPhoto = require("./routes/setPhoto.js");

branchRouter.use("/customer", customer);
branchRouter.use("/payment", payments);

branchRouter.use((req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.send(401);
        // console.log(req.isAuthenticated(), "unAuthorized");
    }
});

branchRouter.use("/setPhoto", setPhoto);
branchRouter.use("/getCustomer", getCustomer);

module.exports = branchRouter;