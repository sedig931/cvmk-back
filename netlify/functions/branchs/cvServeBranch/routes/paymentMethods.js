const { Router } = require("express");
const route = new Router();
const axios = require("axios");

const payments = require('../schemas/paymentsTable.js');

const clientID =
  "AdcTxjZoiYo0W1njgg0NJEzeGlH03cUh6yhIHDnm0JstgYqoKv0CPs_haqndZfJnAtDsX3wsifspNvfO";
const clinetSec =
  "ELFxTIiDcq6JTcJzb7CQ2wOpjXB2T68trGOCSMXCXkcSFVi2jV29w_Rt-cHKHvQQ6z3GwnYMkScwO_kr";

const baseURL = "https://api-m.sandbox.paypal.com";

async function generateAccessToken() {
  const response = await axios({
    url: "https://api-m.sandbox.paypal.com/v1/oauth2/token",
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
      url: "https://api-m.sandbox.paypal.com/v2/checkout/orders",
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
                unit_amount: { currency_code: "USD", value: "50" },
              },
            ],
            amount: {
              currency_code: "USD",
              value: "50",
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: "50",
                },
              },
            },
          },
        ],
        application_context: {
          return_url: `http://samdtc.netlify.app/capPporder`,
          cancel_url: "http://samdtc.netlify.app/",
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          brand_name: "samdc",
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
      url: `https://api-m.sandbox.paypal.com/v2/checkout/orders/${token}/capture`,
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
