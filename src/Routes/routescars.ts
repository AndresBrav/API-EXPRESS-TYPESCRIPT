import express from 'express';
import validToken, { AuthenticatedRequest } from '../Middlewares/tokenValidator';
import {
    CgetCars,
    CgetOneCar,
    CdelCar,
    CaddCar,
    CupdateCar,
    CsaveFile,
    CsaveOnePdf,
    CuploadServer,
    CuploadServerDB,
    CreturnBase64File,
    CconvertBase64toFile,
    CgetDCars,
    CaddDetailCar,
    CuploadAutomaticServer
} from '../Controllers/controllerCars';

const routesCars = express.Router();

routesCars.get('/', [validToken], CgetCars);

routesCars.get('/getOne/:id', [validToken], CgetOneCar);

routesCars.delete('/delCar/:id', [validToken], CdelCar);

routesCars.post('/addCar', [validToken], CaddCar);

routesCars.put('/updateCar/:id', [validToken], CupdateCar);

/* more details from cars */
routesCars.get('/getAllDetailsCar', [validToken], CgetDCars);

routesCars.post('/addDetailsCar',[validToken],CaddDetailCar)

routesCars.post('/savePdf/list', [validToken], CsaveFile)

routesCars.post('/saveOnePdf/list/:id', [validToken], CsaveOnePdf)

routesCars.post("/uploadListServer", [validToken], CuploadServer)

routesCars.post("/uploadListServerDB", [validToken], CuploadServerDB)

routesCars.post("/uploadAuthomaticServer",[validToken],CuploadAutomaticServer)

routesCars.post("/returnBase64File", [validToken], CreturnBase64File) /* generate b64 from file */

routesCars.post("/ConvertBase64toFile", [validToken], CconvertBase64toFile)

export default routesCars