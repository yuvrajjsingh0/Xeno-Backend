import Visit from '../models/Visit'
import {VisitInput, VisitOutput} from '../models/Visit'

export const create = async (payload: VisitInput): Promise<VisitOutput> => {
    const visit = await Visit.create(payload)
    return visit
}

export const update = async (id: number, payload: Partial<VisitInput>): Promise<VisitOutput> => {
    const visit = await Visit.findByPk(id)
    if (!visit) {
        // @todo throw custom error
        throw new Error('not found')
    }
    const updatedVisit = await (visit as Visit).update(payload)
    return updatedVisit
}

export const getById = async (id: number): Promise<VisitOutput> => {
    const visit = await Visit.findByPk(id)
    if (!visit) {
        // @todo throw custom error
        throw new Error('not found')
    }
    return visit
}

export const deleteById = async (id: number): Promise<boolean> => {
    const deletedVisitCount = await Visit.destroy({
        where: {id}
    })
    return !!deletedVisitCount
}

export const getAll = async (): Promise<VisitOutput[]> => {
    return Visit.findAll();
}