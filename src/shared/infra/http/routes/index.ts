import { Router } from 'express'

import healthyRouter from '@modules/healthy/infra/http/routes/HealthyRoute'
import patientRouter from '@modules/patients/infra/http/routes/PatientRoute'
import appointmentRouter from '@modules/appointments/infra/http/routes/AppointmentRoute'

const routes = Router()

routes.use('/healthy', healthyRouter)
routes.use('/patients', patientRouter)
routes.use('/appointments', appointmentRouter)

export default routes
