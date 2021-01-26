import { ServerError } from './../Errors/ServerError'
import { InvalidParamError } from './../Errors/InvalidParamError'
import { EmailValidator } from './../protocols/EmailValidator'
import { badRequest } from './../Helpers/http-helpers'
import { MissingParamError } from './../Errors/MissingParamError'
import { HttpRequest } from './../protocols/http'
import { Controller } from '../protocols/controllers'

export class SignUpController implements Controller{
  private readonly EmailValidator: EmailValidator

  constructor (EmailValidator: EmailValidator){
    this.EmailValidator = EmailValidator
  }

  handle (httpRequest: HttpRequest): any {
    try {
      const requiredField = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredField){
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const isValid = this.EmailValidator.isValid(httpRequest.body.email)

      if (!isValid){
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: new ServerError()
      }
    }
  }
}
