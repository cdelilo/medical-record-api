import { Router } from 'express'
import { celebrate, Joi, Segments } from 'celebrate'

import AuthenticateController from '../controllers/AuthenticateController'

const authenticateRouter = Router()
const authenticateController = new AuthenticateController()

const refreshTokenSchema = Joi.string().trim().min(1).max(1024).required()

authenticateRouter.post(
  '/login',
  celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().trim().email().max(254).lowercase().required(),
      password: Joi.string().min(1).max(255).required(),
    }).unknown(false),
  }),
  (req, res) => authenticateController.login(req, res),
)

authenticateRouter.post(
  '/refresh',
  celebrate({
    [Segments.BODY]: Joi.object({
      refreshToken: refreshTokenSchema,
    }).unknown(false),
  }),
  (req, res) => authenticateController.refresh(req, res),
)

authenticateRouter.post(
  '/logout',
  celebrate({
    [Segments.BODY]: Joi.object({
      refreshToken: refreshTokenSchema,
    }).unknown(false),
  }),
  (req, res) => authenticateController.logout(req, res),
)

export default authenticateRouter
