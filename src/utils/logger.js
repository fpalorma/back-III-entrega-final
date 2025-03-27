import winston from "winston";
import { option } from "../config/commander.js";

const customLevelsOptions = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4
    },
    colors: {
        error: "red",
        warn: "yellow",
        info: "green",
        http: "magenta",
        debug: "blue"
    }
}


const loggerProduction = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({ level: "http" }),

        new winston.transports.File({ filename: "comgined.log", level: "warn" })
    ]
})
const loggerDevelopment = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({ level: "debug", format: winston.format.combine(winston.format.colorize({colors:customLevelsOptions.colors}), winston.format.simple()) }),
    ]
})

export const addLogger = (req, res, next) => {
    req.logger = option.logger === "PRODUCTION" ? loggerProduction : loggerDevelopment
    req.logger.http(`${req.method} ${req.url} ${new Date().toLocaleTimeString()}`)
    next()
}