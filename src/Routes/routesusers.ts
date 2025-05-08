import express, { Request, Response, Router } from 'express';
import {
    CgetUsers,
    CgetOneUser,
    CdelUser,
    CaddUser,
    CupdateUser
} from '../Controllers/controllerUsers'; 
import jwt from "jsonwebtoken";  
import { loginUser } from '../Controllers/auth';
import validToken, { AuthenticatedRequest } from '../Middlewares/tokenValidator';

const routesUsers: Router = express.Router();

routesUsers.get('/getUsers', [validToken], CgetUsers);

routesUsers.get('/getUsers/:id', [validToken], CgetOneUser);

routesUsers.delete('/delUsers/:id', [validToken], CdelUser);

routesUsers.post('/addUser', [validToken], CaddUser);

routesUsers.put('/update/:id', [validToken], CupdateUser);

export default routesUsers;