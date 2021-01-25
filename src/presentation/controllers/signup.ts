import { badRequest } from './../Helpers/http-helpers'
import { MissingParamError } from './../Errors/MissingParamError'
import { HttpRequest } from './../protocols/http'
import { Controller } from '../protocols/controllers'

export class SignUpController implements Controller{
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredField = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredField){
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
