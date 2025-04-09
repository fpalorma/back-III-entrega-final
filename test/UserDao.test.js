import Users from "../src/dao/Users.dao.js";
import mongoose from "mongoose";
import assert from "node:assert"
import dotenv from "dotenv"
dotenv.config()


describe("Users DAO", ()=>{
    before( function(){
       mongoose.connect(process.env.MONGO_URL)

        this.UsersDao = new Users()
    })
    beforeEach(function(){
        this.timeout(5000)
    })
    after(function(){
        mongoose.connection.collections.users.drop() //Con esta linea, cada vez que termina el test elimina el usuario creado para poder reutilizarlo en el proxiimo test
    })
    it("El DAO debe poder agregar un elemento a la base de datos", async function(){
        const user = {
            first_name: "User Test Name",
            last_name: "User Test LastName",
            email: "userTest@test.com",
            password: "passwordtest"
        }
        const result = await this.UsersDao.save(user)
        assert.strictEqual(result.first_name, user.first_name)
    })
    it("El DAO debe poder obtener los usuarios en formato arreglo", async function(){
        const result = await this.UsersDao.get();
        assert.strictEqual(Array.isArray(result),true)
    })
    it("Al agregar un nuevo usuario, debe crearse un array vacio de mascotas por defecto",async function(){
        const user = {
            first_name: "User Test Name 2",
            last_name: "User Test LastName 2",
            email: "userTest2@test.com",
            password: "passwordtest2"
        }
        const result = await this.UsersDao.save(user)
        assert.deepStrictEqual(result.pets,[])
    })
    it("El DAO puede obtener el usuario por el email", async function(){
        const email = "userTest2@test.com"
        const result = await this.UsersDao.getBy({email})
        assert.strictEqual(result.email, email)

    })
})