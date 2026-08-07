import { Router } from 'express'

import healthyRouter from '@modules/healthy/infra/http/routes/healthy.routes'

const routes = Router()

routes.use('/healthy', healthyRouter)

export default routes
