const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg:err.message||"Something went wrong please try again later"
  }
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  if(err && err.code === 11000){
    // return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Email already present" })
    customError.msg = `Duplicate key value ${Object.keys(err.keyValue)}`
    customError.statusCode = 400
  }

  if(err.name === "CastError"){
    customError.msg = `No item found with id ${err.value}`
    customError.statusCode = 404
  }
  //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({issue:customError.msg})
}

module.exports = errorHandlerMiddleware
