import {Router} from "express"

const router = Router()

router.use(verifyJWT)



export default router