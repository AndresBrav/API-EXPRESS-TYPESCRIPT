import  express from 'express';
// import { Cobtenercarros,Cobteneruncarro,CeliminarCarro,CaniadirCarro,CactualizarCarro,CguardarArchivo,CguardarUnArchivo,CsubirServidor,CdevolverArchivoBase64,CconvertirBase64toFile } from '../controllers/controllercarros';

import validToken,{AuthenticatedRequest} from '../Middlewares/tokenValidator';
import { Cobtenercarros,Cobteneruncarro,CeliminarCarro,CaniadirCarro,CactualizarCarro,CguardarArchivo,CguardarUnArchivo,CsubirServidor } from '../Controllers/controllerCars';
const rutasAutos = express.Router();

// rutasAutos.get("/",(req,res) => {
//     console.log("vamos a probar las rutas de los autos");
// })

rutasAutos.get('/', [validToken],Cobtenercarros);
//rutasAutos.get('/', [validToken],guardarCarrosPdf);

rutasAutos.get('/getOne/:id',[validToken], Cobteneruncarro);

rutasAutos.delete('/delCar/:id',[validToken], CeliminarCarro);

rutasAutos.post('/addCar',[validToken], CaniadirCarro);

rutasAutos.put('/updateCar/:id',[validToken] ,CactualizarCarro);

rutasAutos.post('/guardarPdf/list',[validToken],CguardarArchivo)

rutasAutos.post('/guardarPdf/list/:id',[validToken],CguardarUnArchivo)

rutasAutos.post("/guardarListServidor",[validToken],CsubirServidor)

// rutasAutos.post("/ArchivoBase64",[validToken],CdevolverArchivoBase64)

// rutasAutos.post("/ConvertirBase64toFile",[validToken],CconvertirBase64toFile)

// rutasAutos.post("/guardarUnCarroServidor",[validToken],CsubirUnCarroServidor)



export default rutasAutos