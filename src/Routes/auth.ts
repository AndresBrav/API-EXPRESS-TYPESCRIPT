import express from 'express'
import { loginUser } from '../Controllers/auth'

const routerLogin = express.Router()

routerLogin.post("/login/iniciar", loginUser)

export default routerLogin