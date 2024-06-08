import * as audienceDal from '../db/dal/Audience'
import {AudienceInput, AudienceOutput} from '../db/models/Audience'

export const create = (payload: AudienceInput): Promise<AudienceOutput> => {
    return audienceDal.create(payload)
}
export const update = (id: number, payload: Partial<AudienceInput>): Promise<AudienceOutput> => {
    return audienceDal.update(id, payload)
}
export const getById = (id: number): Promise<AudienceOutput> => {
    return audienceDal.getById(id)
}
export const deleteById = (id: number): Promise<boolean> => {
    return audienceDal.deleteById(id)
}
export const getAll = (): Promise<AudienceOutput[]> => {
    return audienceDal.getAll()
}