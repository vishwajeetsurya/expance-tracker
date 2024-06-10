const accountController = require("../controllers/account.controller");
const router = require("express").Router();

router
    .post("/credit", accountController.credit)
    .post("/debit", accountController.debit);

module.exports = router