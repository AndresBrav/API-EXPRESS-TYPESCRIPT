import { Request, Response } from 'express';
// import verifyToken, { AuthenticatedRequest } from "../Middlewares/verifyToken";  // Import verifyToken
import { AuthenticatedRequest } from '../Middlewares/tokenValidator';
import User, { UsersInstance } from '../Models/modelUser';
import {
    getUsers,
    getOneUser,
    UserExists,
    delUser,
    addUser,
    updateUser,
    validateData
} from '../Services/servicesUsers';
import { addUserBD } from '../types/user.types';
import ResError from '../util/resError';
import ResSuccess from '../util/resSuccess';

const CgetUsers = async (req: AuthenticatedRequest, res: Response) => {
    const listUsers: UsersInstance[] = await getUsers(req);
    // console.log(!listUsers)
    if (listUsers.length === 0) {
        res.send('you do not have permissions to access users');
    } else {
        res.send(listUsers);
    }
};

const CgetOneUser = async (req: AuthenticatedRequest, res: Response) => {
    // const data = req.body
    const { id } = req.params;

    const loginUser = req.DatosToken?.u;
    // console.log("we are going to get users ...............")
    // console.log(loginUser)

    const user: UsersInstance | null = await getOneUser(id, loginUser);
    // console.log("the user .length is ........")
    // console.log(user)

    if (user) {
        console.log('user exists');
        const exists = await UserExists(id);
        try {
            if (exists) {
                res.json(user);
            } else {
                res.json({ msg: `the user with  id:${id} does not exist` });
            }
        } catch (error) {
            res.send(error);
            //res.end();
        }
    } else {
        // console.log("user doesn't exists");
        res.json({ msg: "you don't have permission to get the user" });
    }
};

const CdelUser = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const loginUser = req.DatosToken?.u;
    const isDeleted = await delUser(id, loginUser);

    if (isDeleted) {
        res.json({
            msg: `user with id: ${id} has been deleted`
        });
    } else {
        res.json({
            msg: `you don't have permissions to delete the user`
        });
    }
};

const CaddUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { login, clave, sts, tipo } = req.body;
        const correctData: boolean = validateData(login, clave, sts, tipo); //let's verify that everything is correct
        if (correctData) {
            const user: addUserBD = { login, clave, sts, tipo };

            const added = await addUser(user);
            // const added = true

            if (added) {
                res.json({
                    msg: 'user was succefully added'
                });
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ msg: error.message });
        }
    }
};

const CupdateUser = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { login, clave, sts, tipo } = req.body;

    const resp: ResError | ResSuccess = await updateUser(id, login, clave, sts, tipo);

    if (resp instanceof Error) {
        // throw resp
        res.status(resp.statuscode)
            .json({
                msg: 'user was not updated',
                resp: resp.response()
            })
            .end();
    } else {
        res.status(resp.statuscode)
            .json({
                msg: 'user was updated',
                resp: resp.response()
            })
            .end();
    }
};

export { CgetUsers, CgetOneUser, CdelUser, CaddUser, CupdateUser };
