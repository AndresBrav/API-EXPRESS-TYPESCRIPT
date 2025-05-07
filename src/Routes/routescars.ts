import express from 'express';
// import { Cobtenercarros,Cobteneruncarro,CeliminarCarro,CaniadirCarro,CactualizarCarro,CguardarArchivo,CguardarUnArchivo,CsubirServidor,CdevolverArchivoBase64,CconvertirBase64toFile } from '../controllers/controllercarros';

import validToken, { AuthenticatedRequest } from '../Middlewares/tokenValidator';
import {
    Cobtenercarros,
    Cobteneruncarro,
    CeliminarCarro,
    CactualizarCarro,
    CguardarArchivo,
    CguardarUnArchivo,
    CsubirServidor,
    CdevolverArchivoBase64,
    CconvertirBase64toFile,
    CaniadirCarroNuevo,
    CgetDCars,
    CaniadirDetailCar
} from '../Controllers/controllerCars';

const rutasAutos = express.Router();


// rutasAutos.get("/",(req,res) => {
//     console.log("vamos a probar las rutas de los autos");
// })

rutasAutos.get('/', [validToken], Cobtenercarros);
//rutasAutos.get('/', [validToken],guardarCarrosPdf);

rutasAutos.get('/getOne/:id', [validToken], Cobteneruncarro);

rutasAutos.delete('/delCar/:id', [validToken], CeliminarCarro);

rutasAutos.post('/addCar', [validToken], CaniadirCarroNuevo);

rutasAutos.put('/updateCar/:id', [validToken], CactualizarCarro);

/* mas detalles de los autos */
rutasAutos.get('/getAllDetailsCar', [validToken], CgetDCars);

rutasAutos.post('addDetailsCar',[validToken],CaniadirDetailCar)

rutasAutos.post('/guardarPdf/list', [validToken], CguardarArchivo)

rutasAutos.post('/guardarPdf/list/:id', [validToken], CguardarUnArchivo)

rutasAutos.post("/guardarListServidor", [validToken], CsubirServidor)

rutasAutos.post("/ArchivoBase64", [validToken], CdevolverArchivoBase64)

rutasAutos.post("/ConvertBase64toFile", [validToken], CconvertirBase64toFile)

// rutasAutos.post("/guardarUnCarroServidor",[validToken],CsubirUnCarroServidor)



export default rutasAutos