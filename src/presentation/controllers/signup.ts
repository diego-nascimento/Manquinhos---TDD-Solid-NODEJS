import { badRequest } from './../Helpers/http-helpers'
import { MissingParamError } from './../Errors/MissingParamError'
import { HttpRequest } from './../protocols/http'

export class SignUpController {
  handle (httpRequest: HttpRequest): any {
    const requiredField = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredField){
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
