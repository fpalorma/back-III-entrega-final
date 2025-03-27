import {basename} from "./index.js"

export const swaggerOptions = {
definition:{
    openapi: "3.0.0",
    info: {
        title: "API documentation for AdoptMe",
        version: "1.0.0",
        description: "API doc for AdoptMe"
    }
},
apis: [basename + "/docs/**/*.yaml"]
}
