const { Router } = require("express");
const route = new Router();
const axios = require("axios");

const payments = require('../schemas/paymentsTable.js');

// sand-boox
// const clientID =
//   "AdcTxjZoiYo0W1njgg0NJEzeGlH03cUh6yhIHDnm0JstgYqoKv0CPs_haqndZfJnAtDsX3wsifspNvfO";
// const clinetSec =
//   "ELFxTIiDcq6JTcJzb7CQ2wOpjXB2T68trGOCSMXCXkcSFVi2jV29w_Rt-cHKHvQQ6z3GwnYMkScwO_kr";
// const baseURL = "https://api-m.sandbox.paypal.com";

//live
const clientID =
  "AcjVn3WJfPCPyZQ5E9dS-QLuJA9s070SBaiS-kYu_zXaWhta_zMKpXDPikNOSbuZ4Acy9GKGm0Qnss9O";
const clinetSec =
  "EPL-4M36oqsPaAljXnPas85XXc3dqsGlcLmBXZTDpp_fw_kVlrAhq7eiRj2DRGlm1fxpVV5De22unnJY";

const baseURL = "https://api-m.paypal.com";

async function generateAccessToken() {
  const response = await axios({
    url: `${baseURL}/v1/oauth2/token`,
    method: "post",
    data: "grant_type=client_credentials",
    auth: {
      username: clientID,
      password: clinetSec,
    },
  });
  return response.data.access_token;
}
route.post("/paypal", async (req, res) => {
  try {
    const accessToken = await generateAccessToken();
    // console.log("here...");

    const response = await axios({
      url: `${baseURL}/v2/checkout/orders`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      data: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            items: [
              {
                name: "cv as pdf file",
                description: "make perfect cv desgine",
                quantity: "1",
                unit_amount: { currency_code: "USD", value: "3.75" },
              },
            ],
            amount: {
              currency_code: "USD",
              value: "3.75",
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: "3.75",
                },
              },
            },
          },
        ],
        application_context: {
          return_url: `https://samdtc931.com/capPporder`,
          cancel_url: "https://samdtc931.com/",
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          brand_name: "samdtc",
        },
      }),
    });

    const approveRef = response.data.links.find(
      (link) => link.rel === "approve"
    ).href;

    res.send({ approveRef: approveRef });
  } catch (err) {
    res.send(err);
  }
});
route.post("/paypalCapture", async (req, res) => {
  try {
    const accessToken = await generateAccessToken();

    const { token } = req.body;

    const response = await axios({
      url: `${baseURL}/v2/checkout/orders/${token}/capture`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    });

    const id = response.data.id;
    const status = response.data.status;
    const payer = [response.data.payer];
    await payments.create({ id, status, payer });
    res.send(response.data);
  } catch (err) {
    throw err;
  }
});

module.exports = route;
