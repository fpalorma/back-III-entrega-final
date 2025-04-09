import { createHash,passwordValidation } from "../src/utils/index.js";
import { expect } from "chai";

describe("Bcrypt", () => {
    it("'El método createHash debe poder encriptar una contraseña",async function(){
        const password = "123456";
        const hash = await createHash(password);
        expect(hash).to.not.equal(password);
    })
    it("El método passwordValidation debe poder comparar una contraseña con un hash",async function(){
        const password = "123456";
        const hash = await createHash(password);
        const result = await passwordValidation({password:hash},password);
        expect(result).to.be.true;

    })
    it("El método passwordValidation debe fallar si la contraseña hasheada se altera", async function(){
        const password = "123456";
        const hash = await createHash(password);
        const alteredHash = hash + "1";
        const result = await passwordValidation({password:alteredHash},password);
        expect(result).to.be.false;
    })
})