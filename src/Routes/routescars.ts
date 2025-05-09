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
    CsubirServidor,
    CdevolverArchivoBase64,
    CconvertirBase64toFile,
    CgetDCars,
    CaddDetailCar
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

routesCars.post("/guardarListServidor", [validToken], CsubirServidor)

routesCars.post("/ArchivoBase64", [validToken], CdevolverArchivoBase64)

routesCars.post("/ConvertBase64toFile", [validToken], CconvertirBase64toFile)

export default routesCars