"use strict";

const {BadRequestError} = require("../expressError");
const jsonschema = require("jsonschema");
const express = require("express");
const router = new express.Router();

const { shipProduct } = require("../shipItApi");

const shipmentsSchema = require("../shipmentsSchema.json");

/** POST /ship
 *
 * VShips an order coming from json body:
 *   { productId, name, addr, zip }
 *
 * Returns { shipped: shipId }
 */

router.post("/", async function (req, res, next) {
  const results = jsonschema.validate(req.body, shipmentsSchema, {
    required: true
  });
  if (!results.valid) {
    const errs = results.errors.map((err) => err.stack);
    throw new BadRequestError(errs);
  } else {
    const { productId, name, addr, zip } = req.body;
    const shipId = await shipProduct({ productId, name, addr, zip });
    return res.json({ shipped: shipId });
  }
});

module.exports = router;
