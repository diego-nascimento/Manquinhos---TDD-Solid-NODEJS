import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcryptAdapter'

const salt = 12

jest.mock('bcrypt', () => ({
  async hash (): Promise<string>{
    return await new Promise(resolve => resolve('hash'))
  }
}))

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('BcryptAdapter', () => {
  test('Shoud call bcrypt with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenLastCalledWith('any_value', salt)
  })

  test('Shoud return a hashe on sucess', async () => {
    const sut = makeSut()
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hash')
  })
})
