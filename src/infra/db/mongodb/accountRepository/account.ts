import { AddAccountRepository } from './../../../../data/protocols/addAccountRepository'
import { AddAccountModel } from '../../../../domain/usecases/addAccount'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../Helpers/mongodb-helpers'

export class AccountMongoRepository implements AddAccountRepository{
  async add (accountData: AddAccountModel): Promise<AccountModel>{
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(
      accountData
    )
    const account = result.ops[0]
    const { _id, ...accountWithoutID } = account
    return Object.assign({}, accountWithoutID, { id: _id })
  }
}
