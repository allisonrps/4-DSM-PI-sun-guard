import { Router } from 'express'
import controller from '../controllers/sensor.js'

const router = Router()

router.post('/', controller.create)
router.get('/', controller.retrieveAll)
router.get('/:id', controller.retrieveOne)
router.put('/:id', controller.update)
router.put('/', controller.updateMany)
router.delete('/:id', controller.delete)

export default router