import chai from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv"
import Users from "../src/dao/Users.dao.js";




dotenv.config()
mongoose.connect(process.env.MONGO_URL)

const expect = chai.expect
const request = supertest("http://localhost:8080")

describe("Testing AdoptMe", () => {
    let idPet = null
    describe("Test de mascotas", () => {
        it("Post /api/pets crear una mascota", async function () {
            const petMock = {
                name: "Bandido",
                specie: "Cat",
                birthDate: "2023-02-15"
            }
            const { statusCode, ok, _body } = await request.post('/api/pets').send(petMock)
            expect(statusCode).to.be.equal(200)
            expect(ok).to.be.equal(true)
            expect(_body).to.have.property("status", "success")
            expect(_body.payload).to.have.property("adopted", false)
            idPet = _body.payload._id
        })
        it("Si se crea una mascota sin el nombre, debe devolver satusCode 400", async function () {
            const petMock = {
                name: "",
                specie: "Cat",
                birthDate: "2023-02-15"
            }
            const { statusCode, ok, _body } = await request.post('/api/pets').send(petMock)
            expect(statusCode).to.be.equal(400)

        })
        it("Metodo GET, la resp debe tener campos status y payload. Además ser de tipo array", async function () {
            const { statusCode, ok, _body } = await request.get('/api/pets')
            expect(statusCode).to.be.equal(200)
            expect(ok).to.be.equal(true)
            expect(_body).to.have.property("status", "success")
            expect(_body).to.have.property("payload")
            expect(Array.isArray(_body.payload)).to.be.true
        })
        it("PUT debe poder actualizar una mascota determinada", async function () {
            if (!idPet) throw new Error("No se ha creado una mascota")
            const updatePet = {
                name: "Pimpim"
            }
            const { statusCode, ok, _body } = await request.put(`/api/pets/${idPet}`).send(updatePet)
            expect(statusCode).to.be.equal(200)
            expect(ok).to.be.equal(true)
            expect(_body).to.have.property("status", "success")
            const { statusCode: statusCodeGet, ok: okGet, _body: _bodyGet } = await request.get(`/api/pets/${idPet}`)
            expect(statusCodeGet).to.be.equal(200)
            expect(_bodyGet.payload.name).to.be.equal(updatePet.name, "Pimpim")
        })
        it("Delete debe eliminar una mascota determinada", async function () {
            if (!idPet) throw new Error("No se ha creado una mascota")
            const { statusCode, ok, _body } = await request.delete(`/api/pets/${idPet}`)
            const { statusCode: statusCodeGet, ok: okGet, _body: _bodyGet } = await request.get(`/api/pets/${idPet}`)
            expect(statusCodeGet).to.be.equal(404)
            expect(okGet).to.be.equal(false)

        })
    })
    describe("Test endpoint adoption", () => {
         before(function(){
            
                this.UsersDao = new Users()
            })
        beforeEach(async function () {
            this.timeout(5000);
            await mongoose.connection.collections.users.deleteMany({ email: "johndoe@example.com" });
        });
        it("Metodo Get sin parametros debe traer todas las adopciones, en formato array, con payload y status", async function () {
            const { statusCode, ok, _body } = await request.get('/api/adoptions')
            expect(statusCode).to.be.equal(200)
            expect(ok).to.be.equal(true)
            expect(_body).to.have.property("status", "success")
            expect(_body).to.have.property("payload")
            expect(Array.isArray(_body.payload)).to.be.true
        })
        it("Método Get con parámetros debe traer la adopción solicitada", async function () {
            const idAdoption = "67e2cf35d8520640a9668371"
            const { statusCode, ok, _body } = await request.get(`/api/adoptions/${idAdoption}`)
            expect(statusCode).to.be.equal(200)
            expect(ok).to.be.equal(true)
            expect(_body.payload._id).to.be.equal(idAdoption)
        })
        it("Método POST debe devolver error si la mascota ya fue adoptada", async function () {
            const userID = "67c9cc688d5d54e04e0fb7fc"
            const petID = "67a257dc6324b8ac78ce5af6"
            const { statusCode, ok, _body } = await request.post(`/api/adoptions/${userID}/${petID}`)
            expect(statusCode).to.be.equal(400)
            expect(ok).to.be.equal(false)
            expect(_body.error).to.be.equal("Pet is already adopted")
        })
        it("Método POST debe crear una adopción y devolver un mensaje", async function () {
            const petMock = {
                name: "Roco",
                specie: "Dog",
                birthDate: "2023-02-15",
                adopted: false
            }
            const userMock = {
                first_name: "John",
                last_name: "Doe",
                email: "johndoe@example.com",
                password: "coder123",
                role: "user",
                pets: []
            };
            const { _body:petBody} = await request.post("/api/pets").send(petMock)
            const { _body:userBody} = await request.post("/api/sessions/register").send(userMock)
            const { statusCode, ok, _body } = await request.post(`/api/adoptions/${userBody.payload}/${petBody.payload._id}`)
            expect(statusCode).to.be.equal(200)
            expect(ok).to.be.equal(true)
            expect(_body).to.have.property("status", "success")
            expect(_body).to.have.property("message", "Pet adopted")


        })
    })
})