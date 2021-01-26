import { EmailValidator } from './../protocols/EmailValidator'
import { SignUpController } from './signup'
import { MissingParamError } from '../Errors/MissingParamError'
import { InvalidParamError } from '../Errors/InvalidParamError'

interface SutTypes{
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator{
    isValid (email: string): boolean{
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
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
})
