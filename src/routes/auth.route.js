// const { Router } = require("express");
const {Router} = require("express");
const { register, login} = require("../controller/authLogin")

const router = Router()

router.post("/reg", register)
router.post("/log", login)

module.exports = router
