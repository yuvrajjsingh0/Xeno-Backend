import * as communicationLogDal from '../db/dal/CommunicationLog'
import {CommunicationLogInput, CommunicationLogOutput} from '../db/models/CommunicationLog'

export const create = (payload: CommunicationLogInput): Promise<CommunicationLogOutput> => {
    return communicationLogDal.create(payload)
}
export const update = (id: number, payload: Partial<CommunicationLogInput>): Promise<CommunicationLogOutput> => {
    return communicationLogDal.update(id, payload)
}
export const getById = (id: number): Promise<CommunicationLogOutput> => {
    return communicationLogDal.getById(id)
}
export const deleteById = (id: number): Promise<boolean> => {
    return communicationLogDal.deleteById(id)
}
export const getAll = (): Promise<CommunicationLogOutput[]> => {
    return communicationLogDal.getAll()
}
export const getByAudienceId = (audienceId: number): Promise<CommunicationLogOutput[]> => {
    return communicationLogDal.getByAudienceId(audienceId)
}