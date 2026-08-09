import { Router } from 'express'
import { celebrate, Joi, Segments } from 'celebrate'
import AppointmentController from '../controllers/AppointmentController'

const appointmentRouter = Router()
const appointmentController = new AppointmentController()

const appointmentIdSchema = Joi.string().uuid()

const scheduledAtSchema = Joi.string().isoDate().required()

const appointmentFields = {
  patientId: appointmentIdSchema,
  scheduledAt: Joi.string().isoDate(),
}

appointmentRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: appointmentIdSchema.required(),
    },
  }),
  (req, res) => appointmentController.show(req, res),
)

appointmentRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: Joi.object({
      patientId: appointmentIdSchema.optional(),
      from: Joi.string().isoDate().optional(),
      to: Joi.string().isoDate().optional(),
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
    }).unknown(false),
  }),
  (req, res) => appointmentController.list(req, res),
)

appointmentRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: appointmentIdSchema.required(),
    },
  }),
  (req, res) => appointmentController.delete(req, res),
)

export default appointmentRouter
