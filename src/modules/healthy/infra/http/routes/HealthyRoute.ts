import { Router } from 'express'

import HealthyController from '../controllers/HealthyController'

const healthyRouter = Router()
const healthyController = new HealthyController()

healthyRouter.get('/', (req, res) => healthyController.index(req, res))

export default healthyRouter
