/* eslint-disable @typescript-eslint/no-unused-vars */
import { EmailValidator } from './../protocols'
import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from './../Errors'

interface SutTypes{
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator{
    isValid (email: string): boolean{
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new SignUpController(emailValidatorStub)
  return {
    sut, emailValidatorStub
  }
}

describe('Signup Controller', () => {
  test('Should return codeStatus 400 when no name is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'Qual@meial.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return codeStatus 400 when no email is not provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'Qualquer Nome',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return codeStatus 400 when no password is not provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'Qualquer Nome',
        email: 'Qual@meial.com',
        passwordConfirmation: '123456'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return codeStatus 400 when no passwordConfirmation is not provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'Qualquer Nome',
        email: 'Qual@meial.com',
        password: '123456'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Should return codeStatus 400 an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'Qualquer Nome',
        email: 'invalid@meial.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'Qualquer Nome',
        email: 'any_email@meial.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }

    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@meial.com')
  })

  test('Should return  500 an invalid emailValidator throws a Error', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'Qualquer Nome',
        email: 'invalid@meial.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
