import { Router } from 'express'
import controller from '../controllers/sensor.js'

const router = Router()

router.post('/', controller.create)

router.get('/', controller.retrieveAll)
router.get('/:id', controller.retrieveOne)

router.put('/:id', controller.update)
router.put('/', controller.updateMany)

router.delete('/:id', controller.delete)

// Rotas para filtragem por data
router.get('/temperatura', controller.retrieveTemperaturaByDate); // Para dados de temperatura
router.get('/umidade', controller.retrieveUmidadeByDate);         // Para dados de umidade
router.get('/uv', controller.retrieveUvByDate);                   // Para dados de UV

export default router