export const generatePetErrorInfo = (pet)=>{
    return `One or more properties were incomplete or invalid.
    List of required props:
    * name: needs to be a String, received ${pet.name}
    * specie: needs to be a String, received ${pet.specie}
    * birthDate: needs to be a valid date (YYYY-MM-DD), received ${pet.birthDate}
    `
}