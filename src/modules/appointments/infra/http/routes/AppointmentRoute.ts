import { Router } from 'express'
import { celebrate, Joi, Segments } from 'celebrate'
import AppointmentController from '../controllers/AppointmentController'
import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticated'

const appointmentRouter = Router()
const appointmentController = new AppointmentController()

const uuidSchema = Joi.string().uuid()

const scheduledAtSchema = Joi.string()
  .pattern(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2})$/,
  )
  .messages({
    'string.pattern.base': 'Must be a valid ISO date with timezone',
  })

appointmentRouter.use(isAuthenticated)

appointmentRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: uuidSchema.required(),
    },
  }),
  (req, res) => appointmentController.show(req, res),
)

appointmentRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: Joi.object({
      patientId: uuidSchema.optional(),
      from: Joi.string().isoDate().optional(),
      to: Joi.string().isoDate().optional(),
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
    }).unknown(false),
  }),
  (req, res) => appointmentController.list(req, res),
)

appointmentRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object({
      patientId: uuidSchema.required(),
      scheduledAt: scheduledAtSchema.required(),
    }).unknown(false),
  }),
  (req, res) => appointmentController.create(req, res),
)

appointmentRouter.patch(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: uuidSchema.required(),
    },
    [Segments.BODY]: Joi.object({
      patientId: uuidSchema.optional(),
      scheduledAt: scheduledAtSchema.optional(),
    })
      .min(1)
      .unknown(false),
  }),
  (req, res) => appointmentController.update(req, res),
)

appointmentRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: uuidSchema.required(),
    },
  }),
  (req, res) => appointmentController.delete(req, res),
)

appointmentRouter.put(
  '/:id/note',
  celebrate({
    [Segments.PARAMS]: {
      id: uuidSchema.required(),
    },
    [Segments.BODY]: Joi.object({
      note: Joi.string().trim().min(1).max(5000).required(),
    }).unknown(false),
  }),
  (req, res) => appointmentController.updateNote(req, res),
)

export default appointmentRouter
