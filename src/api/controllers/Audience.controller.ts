import { RequestHandler } from 'express';
import * as audienceService from '../../core/services/Audience.service';
import * as communicationLogService from '../../core/services/CommunicationLog.service';
import { channel } from '../utils/rabbitmq';

export const createAudience: RequestHandler = (req, res, next) => {
    const { title, numUsers, rules } = req.body;
    if (!title || !numUsers || !rules) {
      return res.status(400).send({error: 'Title, Number of Users, and Rules are required'});
    }
    channel.sendToQueue('audienceQueue', Buffer.from(JSON.stringify({ title, numUsers, rules })));
    res.status(200).send({message: 'Audience data sent to queue'});
}

export const getAudiences: RequestHandler = async (req, res, next) => {
    res.status(200).send(await audienceService.getAll());
}

export const getAudienceById: RequestHandler = async (req, res, next) => {
    res.status(200).send(await audienceService.getById(Number(req.params.id)));
}

export const startCampaign: RequestHandler = async (req, res, next) => {
    channel.sendToQueue('communicationQueue', Buffer.from(JSON.stringify({ audienceId: req.params.id })));
    res.status(200).send({message: 'communication data sent to queue'});
}

export const getCampaignLogs: RequestHandler = async (req, res, next) => {
    res.status(200).send(await communicationLogService.getByAudienceId(Number(req.params.id)));
}