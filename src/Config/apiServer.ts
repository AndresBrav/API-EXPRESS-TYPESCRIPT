import * as dotenv from "dotenv";
dotenv.config(); // ¡this charge the file .env!
import express, { Application, Request, Response } from "express";
import cors from "cors";
import UserRoutes from "../Routes/routesusers";
import CarsRoutes from "../Routes/routescars";
import LoginRoutes from "../Routes/auth";
import morgan from "morgan";
import db from "../db/conexion";
import "../Jobs/scheduler"; //import the scheduler.ts

class ApiServer {
  private usersPath: string;
  private carsPaht: string;
  private app: Application;
  private loginPath: string;

  constructor() {
    this.app = express();
    this.usersPath = "/users";
    this.carsPaht = "/cars";
    this.loginPath = "/api/auth";
    this.middlewares(); // Call the middleware function
    this.routes(); // Register the routes
    this.dbConnet(); //Data Base connection
  }

  private middlewares(): void {
    // this.app.use(cors({ origin: 'http://localhost:5173' }));
    this.app.use(cors({ origin: "http://localhost:3000" }));
    this.app.use(express.json());
    this.app.use(morgan("dev"));
    // this.app.use(express.static('public'));
  }

  public routes(): void {
    this.app.use(this.loginPath, LoginRoutes);
    this.app.use(this.usersPath, UserRoutes);
    this.app.use(this.carsPaht, CarsRoutes);
  }

  public escuchar(): void {
    const port = process.env.PORT || 4000;
    this.app.listen(port, () => {
      console.log(`API REST startid in the port ${port}`);
    });
  }

  async dbConnet() {
    //Data Base connection

    try {
      await db.authenticate();
      console.log("Connected data base");
      console.log("hello you can start");
    } catch (error) {
      console.log(error);
      console.log("error when connecting to the database");
    }
  }
}

export default ApiServer;
