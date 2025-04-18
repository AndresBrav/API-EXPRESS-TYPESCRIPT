import * as dotenv from 'dotenv';
dotenv.config(); // ¡Esto carga el archivo .env!
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import UserRoutes from '../Routes/routesusers';
import CarsRoutes from '../Routes/routescars'
import LoginRoutes from '../Routes/auth'
import morgan from 'morgan';
// actualizado

import db from '../db/conexion'



class ApiServer {
  private usersPath: string;
  private carsPaht:string
  private app: Application;
  private loginPath:string;
  

  constructor() {
    this.app = express();
    this.usersPath = "/users";
    this.carsPaht="/cars";
    this.loginPath="/api/auth"
    this.middlewares();  // Llama a la función middleware
    this.routes();       // Registra las rutas
    this.dbConnet(); //conexion a la base de datos
    
  }

  private middlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(morgan('dev'))
    // this.app.use(express.static('public'));
  }

  public routes(): void {
    this.app.use(this.loginPath,LoginRoutes)
    this.app.use(this.usersPath, UserRoutes);
    this.app.use(this.carsPaht,CarsRoutes)
  }

  public escuchar(): void {
    const port = process.env.PORT || 4000;
    this.app.listen(port, () => {
      console.log(`API REST iniciada en el puerto ${port}`);
    });
  }

  async dbConnet() {
    //conexion a la base de datos

    try {
      await db.authenticate();
      console.log("base de datos conectada");
    } catch (error) {
      console.log(error);
      console.log('error al conectarse en la base de datos');
    }
  }
}

export default ApiServer;
