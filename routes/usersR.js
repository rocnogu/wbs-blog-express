import Router from 'express';
import {register, login, logout, verify, userPage, delUser} from "../controllers/usersC.js"

const usersRoutes = Router();

usersRoutes.post("/register", register);
usersRoutes.post("/login", login)

usersRoutes.get("/logout", logout)
usersRoutes.get("/verify", verify)
usersRoutes.get("/userPage", userPage)
usersRoutes.delete("/delete", delUser)

export default usersRoutes;