import chai from "chai";
import supertest from "supertest";
const expect = chai.expect
const request = supertest("http://localhost:8080")

describe("testing adpotMe", () => {
    describe("Test Sessions", () => {
        let cookie = {
            name: null,
            value: null
        }
        it("POST debe crear un usuario", async function () {
            const userMock = {
                first_name: "Federico",
                last_name: "Palorma",
                email: "federico@palorma.com",
                password: "coder123"
            }
            const { statusCode, ok, _body } = await request.post("/api/sessions/register").send(userMock)
            expect(statusCode).to.be.equal(200)
            expect(ok).to.be.equal(true)
            expect(_body).to.have.property("status", "success")
        })

        it("POST loguear un usuario", async function () {
            const userMock = {
                email: "federico@palorma.com",
                password: "coder123"
            }
            const { statusCode, ok, _body, headers } = await request.post("/api/sessions/login").send(userMock)
            const cookieResult = headers["set-cookie"][0];

            cookie.name = cookieResult.split("=")[0];
            cookie.value = cookieResult.split("=")[1].split(";")[0]

            expect(cookie.name).to.be.equal("coderCookie")
            expect(cookie.value).to.be.ok
            expect(statusCode).to.be.equal(200)
            expect(ok).to.be.equal(true)
            expect(_body).to.have.property("status", "success")
        })
        it("Current debe devolver el usuario logeado", async function(){
            const { statusCode, ok, _body, headers } = await request.get("/api/sessions/current").set("Cookie",`${cookie.name}=${cookie.value}`);
            expect(statusCode).to.be.equal(200)
            expect(ok).to.be.equal(true)
            expect(_body).to.have.property("status", "success")
            expect(_body.payload).to.have.property("email", "federico@palorma.com")
        })
    })
    describe("Test de auth sin proteccion", ()=>{
        let cookie = {
            name: null,
            value: null
        }
        it("POST en unprotected login debe loguear",async function(){
            const mockUser = {
                first_name: "Mauricio",
                last_name: "Espinosa",
                email: "correomau@correo.com",
                password: "123"
            }
            const { statusCode, ok, _body, headers } = await request.post("/api/sessions/unprotectedLogin").send(mockUser)
            const cookieResult = headers["set-cookie"][0];
            
            cookie.name = cookieResult.split("=")[0];
            cookie.value = cookieResult.split("=")[1].split(";")[0]

            expect(cookie.name).to.be.equal("unprotectedCookie")
            expect(cookie.value).to.be.ok
        })
    })
})