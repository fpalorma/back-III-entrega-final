import Users from "../src/dao/Users.dao.js";
import mongoose from "mongoose";
import dotenv from "dotenv"
import { expect } from "chai";
import assert from "node:assert"


dotenv.config()
mongoose.connect(process.env.MONGO_URL)

describe("Users DAO", ()=>{
    before(function(){
    
        this.UsersDao = new Users()
    })
    beforeEach(function(){
        this.timeout(5000)
        mongoose.connection.collections.users.drop() //Con esta linea, cada vez que termina el test elimina el usuario creado para poder reutilizarlo en el proxiimo test
    })
    
    it("El DAO debe poder obtener los usuarios en formato arreglo", async function(){
        const user = {
            first_name: "User Test Name 2",
            last_name: "User Test LastName 2",
            email: "userTest2@test.com",
            password: "passwordtest2"
        }
        const createUser = await this.UsersDao.save(user)
        const result = await this.UsersDao.get();
        expect(result).to.be.an("array")
    })
    it("El DAO debe poder agregar un elemento a la base de datos", async function(){
        const user = {
            first_name: "User Test Name",
            last_name: "User Test LastName",
            email: "userTest@test.com",
            password: "passwordtest"
        }
        const result = await this.UsersDao.save(user)
        expect(result).to.have.property('first_name')
    })
    it("Al agregar un nuevo usuario, debe crearse un array vacio de mascotas por defecto",async function(){
        const user = {
            first_name: "User Test Name 2",
            last_name: "User Test LastName 2",
            email: "userTest2@test.com",
            password: "passwordtest2"
        }
        const result = await this.UsersDao.save(user)
        expect(result).to.have.property("pets")
        expect(result.pets).to.be.deep.equal([])
    })
    it("El DAO puede obtener el usuario por el email", async function(){
        const user = {
            first_name: "User Test Name 2",
            last_name: "User Test LastName 2",
            email: "userTest2@test.com",
            password: "passwordtest2"
        }
        const createUser = await this.UsersDao.save(user)

        const result = await this.UsersDao.getBy({email:"userTest2@test.com"})
        expect(result).to.have.property("email")
        expect(result.email).to.equal("userTest2@test.com")

    })
    it("El dao debe actualizar un usuario correctamente", async function(){
        const user = {
            first_name: "User Test Name3",
            last_name: "User Test LastName3",
            email: "userTest3@test.com",
            password: "passwordtest3"
        }
        const createUser = await this.UsersDao.save(user)
        const newData = {first_name: "Mario"}
        const updatedUser = await this.UsersDao.update(createUser._id, newData)
        expect(updatedUser.first_name).to.be.equal("Mario")
    })
    it("El dao debe eliminar un usuario correctamente", async function(){
        const user = {
            first_name: "User Test Name3",
            last_name: "User Test LastName3",
            email: "userTest3@test.com",
            password: "passwordtest3"
        }
        const createUser = await this.UsersDao.save(user)
        const deleteUser = await this.UsersDao.delete(createUser._id);
        const foundUser = await this.UsersDao.getBy({email:"userTest3@test.com"})
        expect(foundUser).to.be.equal(null)
    })
})