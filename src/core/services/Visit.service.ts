import * as visitDal from '../db/dal/Visit'
import {VisitInput, VisitOutput} from '../db/models/Visit'

export const create = (payload: VisitInput): Promise<VisitOutput> => {
    return visitDal.create(payload)
}
export const update = (id: number, payload: Partial<VisitInput>): Promise<VisitOutput> => {
    return visitDal.update(id, payload)
}
export const getById = (id: number): Promise<VisitOutput> => {
    return visitDal.getById(id)
}
export const deleteById = (id: number): Promise<boolean> => {
    return visitDal.deleteById(id)
}
export const getAll = (): Promise<VisitOutput[]> => {
    return visitDal.getAll()
}