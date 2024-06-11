import User from '../models/User'
import {UserInput, UserOutput} from '../models/User'

export const create = async (payload: UserInput): Promise<UserOutput> => {
    const user = await User.create(payload)
    return user
}

export const update = async (id: number, payload: Partial<UserInput>): Promise<UserOutput> => {
    const user = await User.findByPk(id)
    if (!user) {
        // @todo throw custom error
        throw new Error('not found')
    }
    const updatedUser = await (user as User).update(payload)
    return updatedUser
}

export const getById = async (id: number): Promise<UserOutput> => {
    const user = await User.findByPk(id)
    if (!user) {
        // @todo throw custom error
        throw new Error('not found')
    }
    return user
}

export const deleteById = async (id: number): Promise<boolean> => {
    const deletedUserCount = await User.destroy({
        where: {id}
    })
    return !!deletedUserCount
}

export const getAll = async (): Promise<UserOutput[]> => {
    return User.findAll();
}

export const getUserByEmail = async (email: string): Promise<UserOutput> => {
    const user = await User.findOne({
        where: {
            email: email
        }
    });

    if(!user){
        throw new Error('not found')
    }

    return user;
}