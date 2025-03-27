import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv"
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import { faker } from '@faker-js/faker';
import errorHandlerMid from "./middleware/error.mid.js"
import { addLogger } from './utils/logger.js';
import cluster from "node:cluster"
import { cpus } from 'node:os';
import { swaggerOptions } from './utils/swagger.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from "swagger-ui-express"
import cors from 'cors'

dotenv.config()
const app = express();
const PORT = process.env.PORT || 8080;
const connection = mongoose.connect(process.env.MONGO_URL)
app.use(cors())
app.use(express.json());
app.use(cookieParser());
app.use(addLogger)

const specs = swaggerJSDoc(swaggerOptions)
app.use('/apidocs',swaggerUiExpress.serve,swaggerUiExpress.setup(specs))

app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);

app.get("/operacionsencilla", (req, res) => {
    let sum = 0;
    for (let index = 0; index < 1000000; index++) {
        sum += index
    }
    req.send({sum})
})
app.get("/operacioncompleja", (req, res) => {
    let sum = 0;
    for (let index = 0; index < 5e8; index++) {
        sum += index
    }
    req.send({sum})
})

app.get("/api/test/user", (req,res)=>{
    let first_name = faker.person.firstName();
    let last_name = faker.person.lastName();
    let email = faker.internet.email();
    let password = faker.internet.password()
    res.send({first_name, last_name, email, password})
})

app.get("/mockingpets", (req, res) => {
    const pets = []
    const speciesList = ["dog", "cat", "bird", "fish", "spider", "snake"]
    for (let index = 0; index < 100; index++) {
        pets.push({
            name: faker.person.firstName(),
            specie: faker.helpers.arrayElement(speciesList),
            birthDate: faker.date.birthdate({ min: 1, max: 15, mode: "age" }).toISOString().split("T")[0]
        })
    }
    res.send({ status: "success", payload: pets })
})
app.use(errorHandlerMid)

if(cluster.isPrimary){
    console.log("Soy un cluster primario");
    for (let index = 0; index < cpus().length; index++) {
        cluster.fork()
        
    }

    cluster.on("exit", (worker)=>{
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork()
    })
}else{
    console.log(`Soy el cluster ${cluster.worker.id} con ${process.pid}`);
    app.listen(PORT, () => console.log(`Listening on ${PORT}`))
}
