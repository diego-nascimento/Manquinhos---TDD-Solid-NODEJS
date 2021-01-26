import { MissingParamError, InvalidParamError } from './../Errors'
import { badRequest, serverError } from './../Helpers/http-helpers'
import { Controller, HttpRequest, EmailValidator } from '../protocols'

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
      if (httpRequest.body.password !== httpRequest.body.passwordConfirmation){
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const isValid = this.EmailValidator.isValid(httpRequest.body.email)

      if (!isValid){
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return serverError()
    }
  }
}
