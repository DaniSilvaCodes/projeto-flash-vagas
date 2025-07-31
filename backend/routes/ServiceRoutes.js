const router = require('express').Router()

const ServiceController = require('../controllers/ServiceController')


const verifyToken = require('../helpers/verify-token')
const {imageUpload} = require('../helpers/image-upload')


router.post('/create', verifyToken, imageUpload.array('images'), ServiceController.create)
router.get('/', ServiceController.getAll)
router.get('/myservices', verifyToken, ServiceController.getAllUserServices)
router.get('/myactivities', verifyToken, ServiceController.getAllUserActivities)
router.get('/:id', ServiceController.getServicebyId)
router.delete('/:id', verifyToken, ServiceController.removeServiceById)
router.patch(
  '/:id',
  verifyToken,
  imageUpload.array('images'),
  ServiceController.updateService,
)
router.patch('/connect/:id', verifyToken, ServiceController.connect)
router.patch('/conclude/:id', verifyToken, ServiceController.concludeActivities)


module.exports = router