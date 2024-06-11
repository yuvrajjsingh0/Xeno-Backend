import * as userDal from '../db/dal/User'
import {UserInput, UserOutput} from '../db/models/User'

export const create = (payload: UserInput): Promise<UserOutput> => {
    return userDal.create(payload)
}
export const update = (id: number, payload: Partial<UserInput>): Promise<UserOutput> => {
    return userDal.update(id, payload)
}
export const getById = (id: number): Promise<UserOutput> => {
    return userDal.getById(id)
}
export const deleteById = (id: number): Promise<boolean> => {
    return userDal.deleteById(id)
}
export const getAll = (): Promise<UserOutput[]> => {
    return userDal.getAll()
}
export const getByEmail = (email: string): Promise<UserOutput> => {
    return userDal.getUserByEmail(email)
}