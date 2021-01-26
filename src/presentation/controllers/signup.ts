
import { MissingParamError, InvalidParamError } from './../Errors'
import { badRequest, serverError } from './../Helpers/http-helpers'
import { Controller, HttpRequest, EmailValidator } from '../protocols'
import { AddAccount } from '../../domain/usecases/addAccount'

export class SignUpController implements Controller{
  private readonly EmailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (EmailValidator: EmailValidator, addAccount: AddAccount){
    this.EmailValidator = EmailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): any {
    try {
      const requiredField = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredField){
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation){
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const isValid = this.EmailValidator.isValid(email)

      if (!isValid){
        return badRequest(new InvalidParamError('email'))
      }
      this.addAccount.add({
        name, email, password
      })
    } catch (error) {
      return serverError()
    }
  }
}
