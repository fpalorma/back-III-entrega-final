class UserDTO {
    constructor(user) {
        this.name = `${user.first_name} ${user.last_name}`;
        this.email = user.email;
        this.role = user.role;
        this.pets = user.pets;
        // No incluir propiedades innecesarias como password, first_name, last_name,__v
    }
}

export default UserDTO;