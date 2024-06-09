import { sequelize } from '../../utils/utils'
import CommunicationLog from '../models/CommunicationLog'
import {CommunicationLogInput, CommunicationLogOutput} from '../models/CommunicationLog'
import Customer from '../models/Customer'

export const create = async (payload: CommunicationLogInput): Promise<CommunicationLogOutput> => {
    const communicationLog = await CommunicationLog.create(payload)
    return communicationLog
}

export const update = async (id: number, payload: Partial<CommunicationLogInput>): Promise<CommunicationLogOutput> => {
    const communicationLog = await CommunicationLog.findByPk(id)
    if (!communicationLog) {
        // @todo throw custom error
        throw new Error('not found')
    }
    const updatedCommunicationLog = await (communicationLog as CommunicationLog).update(payload)
    return updatedCommunicationLog
}

export const getById = async (id: number): Promise<CommunicationLogOutput> => {
    const communicationLog = await CommunicationLog.findByPk(id)
    if (!communicationLog) {
        // @todo throw custom error
        throw new Error('not found')
    }
    return communicationLog
}

export const deleteById = async (id: number): Promise<boolean> => {
    const deletedCommunicationLogCount = await CommunicationLog.destroy({
        where: {id}
    })
    return !!deletedCommunicationLogCount
}

export const getAll = async (): Promise<CommunicationLogOutput[]> => {
    return CommunicationLog.findAll();
}

export const getByAudienceId = async (audience_id: number): Promise<CommunicationLogOutput[]> => {
    const communicationLog = await CommunicationLog.findAll({
        where: {
            audience_id: audience_id
        },
        include: [
            {
                model: sequelize.models['Customer']
            }
        ]
    });
    if (!communicationLog) {
        // @todo throw custom error
        throw new Error('not found')
    }
    return communicationLog
}