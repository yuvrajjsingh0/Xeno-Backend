import Audience from '../models/Audience'
import {AudienceInput, AudienceOutput} from '../models/Audience'

export const create = async (payload: AudienceInput): Promise<AudienceOutput> => {
    const audience = await Audience.create(payload)
    return audience
}

export const update = async (id: number, payload: Partial<AudienceInput>): Promise<AudienceOutput> => {
    const audience = await Audience.findByPk(id)
    if (!audience) {
        // @todo throw custom error
        throw new Error('not found')
    }
    const updatedAudience = await (audience as Audience).update(payload)
    return updatedAudience
}

export const getById = async (id: number): Promise<AudienceOutput> => {
    const audience = await Audience.findByPk(id)
    if (!audience) {
        // @todo throw custom error
        throw new Error('not found')
    }
    return audience
}

export const deleteById = async (id: number): Promise<boolean> => {
    const deletedAudienceCount = await Audience.destroy({
        where: {id}
    })
    return !!deletedAudienceCount
}

export const getAll = async (): Promise<AudienceOutput[]> => {
    return Audience.findAll();
}