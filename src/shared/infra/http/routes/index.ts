import { Router } from 'express'

import healthyRouter from '@modules/healthy/infra/http/routes/HealthyRoute'
import patientRouter from '@modules/patients/infra/http/routes/PatientRoute'

const routes = Router()

routes.use('/healthy', healthyRouter)
routes.use('/patients', patientRouter)

export default routes
