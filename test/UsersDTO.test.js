import UserDTO from "../src/dto/UserDTO.js";
import { expect } from "chai";

describe("User DTO", () => {


    it("El DTO debe unificar el nombre y apellido en una única propiedad",function(){
        const user = {
            first_name: 'Juan',
            last_name: 'Perez',
            email: 'juan.perez@example.com',
            password: 'hashedpassword',
            role: 'user',
            pets: [],
            __v: 0
        };
        const result = new UserDTO(user);
        expect(result.name).to.equal(`${user.first_name} ${user.last_name}`);
    })
    it("El DTO debe eliminar las propiedades innecesarias como password, first_name, last_name",function(){
        const user = {
            first_name: 'Juan',
            last_name: 'Perez',
            email: 'juan.perez@example.com',
            password: 'hashedpassword',
            role: 'user',
            pets: [],
            __v: 0
        };
        const result = new UserDTO(user);
        expect(result).to.not.have.property('first_name');
        expect(result).to.not.have.property('last_name');
        expect(result).to.not.have.property('password');
        expect(result).to.not.have.property('__v');

    })

})