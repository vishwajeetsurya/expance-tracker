const router = require("express").Router()
const authController = require("./../controllers/auth.controller")

router
    .post("/register", authController.registerUser)
    .post("/login", authController.loginUser)

module.exports = router