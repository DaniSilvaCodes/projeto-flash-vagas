const Service = require('../models/Service')

// helpers
const getToken = require("../helpers/get-token")
const getUserByToken = require("../helpers/get-user-by-token")
const ObjectId = require('mongoose').Types.ObjectId
const mongoose = require('mongoose')



module.exports = class ServiceController {

    static async create(req, res) {
        const { title, description, category, value, location, date } = req.body

        const images = req.files;

        const available = true

        // imagens upload

        // validações
        if (!title) {
            res.status(422).json({ message: 'O titulo  é obrigatorio!' })
            return
        }

        if (!description) {
            res.status(422).json({ message: 'A descrição é obrigatorio!' })
            return
        }

        if (!category) {
            res.status(422).json({ message: 'A categoria é obrigatorio!' })
            return
        }

        if (!value) {
            res.status(422).json({ message: 'O valor é obrigatorio!' })
            return
        }

        if (!location) {
            res.status(422).json({ message: 'O local é obrigatorio!' })
            return
        }

        if (images.length === 0) {
            res.status(422).json({ message: 'A Imagem é obrigatoria!' })
            return
        }

        if (!date) {
            res.status(422).json({ message: 'A data é obrigatoria!' })
            return
        }

        // Dono do service
        const token = getToken(req)
        const user = await getUserByToken(token)

        //Criar service
        const service = new Service({
            title,
            description,
            category,
            value,
            location,
            date,
            available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone,
            }
        })

        images.map((image) => {
            service.images.push(image.filename)
        })

        try {
            const newService = await service.save()
            res.status(201).json({ message: 'Serviço cadastrado com sucesso!', newService, })

        } catch (error) {
            res.status(500).json({ message: error })
        }

    }

    //Mostrar todos services
    static async getAll(req, res) {
        const services = await Service.find().sort('-createdAt')

        res.status(200).json({
            services: services,
        })
    }

    //Services do usuário
    static async getAllUserServices(req, res) {

        //Pegar usuário pelo Token
        const token = getToken(req)
        const user = await getUserByToken(token)

        const services = await Service.find({ 'user._id': user._id }).sort('-createdAt')
        res.status(200).json({
            services,
        })

    }

    //Mostrar todas as atividades de serviços prestados pelo usuário
    static async getAllUserActivities(req, res) {
        const token = getToken(req)
        const user = await getUserByToken(token)

        const services = await Service.find({ 'worker._id': user._id }).sort('-createdAt')

        res.status(200).json({ services })
    }


    //Serviço por Id
    static async getServicebyId(req, res) {
        const id = req.params.id

        //Verificar se Id é valido
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido!' })
            return
        }

        //Verificar se service existe
        const service = await Service.findOne({ _id: id })
        if (!service) {
            res.status(404).json({ message: 'Serviço não encontrado!' })
        }

        // Retorna o service
        res.status(200).json({
            service: service,
        })

    }

    //Remover serviço
    static async removeServiceById(req, res) {
        const id = req.params.id

        //Verificar se Id é valido
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido!' })
            return
        }

        //Verificar se service existe
        const service = await Service.findOne({ _id: id })
        if (!service) {
            res.status(404).json({ message: 'Serviço não encontrado!' })
            return
        }

        //Verificar se o usuário logado é dono do Service
        const token = getToken(req)
        const user = await getUserByToken(token)

        //testes 
        // console.log(service.user._id)
        // console.log(user._id)

        if (service.user._id.toString() != user._id.toString()) {
            res.status(422).json({ message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde!' })
            return
        }

        await Service.findByIdAndDelete(id)
        res.status(200).json({ message: 'Serviço removido com sucesso!' })
    }

    //Atualizar service
    static async updateService(req, res) {

        const id = req.params.id
        const { title, description, category, value, location, date, available } = req.body
        const images = req.files

        const updateData = {}

        //Verificar se service existe
        const service = await Service.findOne({ _id: id })
        //console.log('service:', service)
        if (!service) {
            res.status(404).json({ message: 'Serviço não encontrado!' })
            return
        }

        //Verificar se o usuário logado é dono do Service
        const token = getToken(req)
        const user = await getUserByToken(token)

        if (service.user._id.toString() != user._id.toString()) {
            res.status(422).json({ message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde!' })
            return
        }

        // validações
        if (!title) {
            res.status(422).json({ message: 'O titulo  é obrigatorio!' })
            return
        } else {
            updateData.title = title
        }

        if (!description) {
            res.status(422).json({ message: 'A descrição é obrigatoria!' })
            return
        } else {
            updateData.description = description
        }

        if (!category) {
            res.status(422).json({ message: 'A categoria é obrigatoria!' })
            return
        } else {
            updateData.category = category
        }

        if (!value) {
            res.status(422).json({ message: 'O valor é obrigatorio!' })
            return
        } else {
            updateData.value = value
        }

        if (!location) {
            res.status(422).json({ message: 'O local é obrigatorio!' })
            return
        } else {
            updateData.location = location
        }

        if (images.length > 0) {
            updateData.images = []
            images.map((image) => {
                updateData.images.push(image.filename)
            })
        }

        if (!date) {
            res.status(422).json({ message: 'A data é obrigatoria!' })
            return
        } else {
            updateData.date = date
        }

        await Service.findByIdAndUpdate(id, updateData)
        res.status(200).json({ message: 'Serviço atualizado com sucesso!' })

    }

    static async connect(req, res) {
        const id = req.params.id

        //Verificar se service existe
        const service = await Service.findOne({ _id: id })

        if (!service) {
            res.status(404).json({ message: 'Serviço não encontrado!' })
            return
        }

        //Vericar se o User registrou o Pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        if (service.user._id.equals(user._id)) {
            res.status(422).json({ message: 'Você não pode ser cliente de um serviço que registrou!' })
            return
        }

        //Verficar se user já solicitou contato anteriomente
        if (service.worker) {
            if (service.worker._id.equals(user._id)) {
                res.status(422).json({ message: 'Você já solicitou contato com esse serviço!' })
                return
            }
        }

        //Adicionar worker para service
        service.worker = {
            _id: user._id,
            name: user.name,
            image: user.image
        }

        await Service.findByIdAndUpdate(id, service)
        res.status(200).json({
            message: `Você solicitou o serviço, entre em contato com ${service.user.name}, pelo telefone ${service.user.phone} `

        })
    }

    static async concludeActivities(req, res) {
        const id = req.params.id

        //Verificar se service existe
        const service = await Service.findOne({ _id: id })

        if (!service) {
            res.status(404).json({ message: 'Serviço não encontrado!' })
            return
        }

        //Verificar se o usuário logado é dono do Service
        const token = getToken(req)
        const user = await getUserByToken(token)

        if (service.user._id.toString() != user._id.toString()) {
            res.status(422).json({ message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde!' })
            return
        }

        service.available = false
        await Service.findByIdAndUpdate(id, service)
        res.status(200).json({ message: 'A conexão com o cliente foi concluída com sucesso.' })
    }

}