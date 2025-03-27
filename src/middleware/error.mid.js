import EErrors from "../utils/errors/enums.js";

export default (error, req, res, next)=>{
    switch (error.code) {
        case EErrors.INVALID_TYPES_ERROR:
            res.status(400).send({status: "Error", error:error.name, cause:error.cause})
            
            break;
        case EErrors.INVALID_PARAMS:
            res.status(400).json({status: "Error", error:error.name, cause: error.cause})
            
            break;
    
        default:
            res.send({status: "error", error: "Unhandled error"})
            break;
    }
}