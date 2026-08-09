import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'

import PatientController from '../controllers/PatientController'

const patientRouter = Router()
const patientController = new PatientController()

const patientIdSchema = Joi.string().uuid().required()

const patientFields = {
  name: Joi.string().trim().min(3).max(150),
  phone: Joi.string().pattern(/^\+[1-9]\d{7,14}$/),
  email: Joi.string().email().max(254).lowercase(),
  birthDate: Joi.date().iso().max('now'),
  sex: Joi.string().valid('MALE', 'FEMALE'),
  heightM: Joi.number().min(0.3).max(2.8),
  weightKg: Joi.number().min(0.5).max(500),
}

patientRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: patientIdSchema,
    },
  }),
  (req, res) => patientController.show(req, res),
)

patientRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
    }).unknown(false),
  }),
  (req, res) => patientController.list(req, res),
)

patientRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object({
      name: patientFields.name.required(),
      phone: patientFields.phone.required(),
      email: patientFields.email.required(),
      birthDate: patientFields.birthDate.required(),
      sex: patientFields.sex.required(),
      heightM: patientFields.heightM.required(),
      weightKg: patientFields.weightKg.required(),
    }).unknown(false),
  }),
  (req, res) => patientController.create(req, res),
)

patientRouter.patch(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: patientIdSchema,
    },
    [Segments.BODY]: Joi.object({
      ...patientFields,
    })
      .min(1)
      .unknown(false),
  }),
  (req, res) => patientController.update(req, res),
)

patientRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: patientIdSchema,
    },
  }),
  (req, res) => patientController.delete(req, res),
)

export default patientRouter
