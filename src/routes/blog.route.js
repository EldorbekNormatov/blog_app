
const {Router} = require("express")
const {create, getAll, getOne, upd, del} = require("../controller/blog")

const router = Router()

router.post("/blog", create)
router.get("/getall", getAll)
router.get("/getone", getOne)
router.put("/upd", upd)
router.delete("/del", del)

module.exports = router