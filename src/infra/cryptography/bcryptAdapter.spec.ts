import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcryptAdapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string>{
    return await new Promise(resolve => resolve('hash'))
  }
}))

describe('BcryptAdapter', () => {
  test('Shoud call bcrypt with correct values', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenLastCalledWith('any_value', salt)
  })

  test('Shoud return a hashe on sucess', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hash')
  })
})
