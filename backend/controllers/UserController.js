
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const { get } = require('mongoose')


module.exports = class UserController {
    static async register(req, res) {

        const { name, email, phone, password, confirmpassword } = req.body

        let image = ''

        if (req.file) {
            image = req.file.filename
        }

        //Validações 
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatorio' })
            return
        }

        if (!email) {
            res.status(422).json({ message: 'O email é obrigatorio' })
            return
        }

        if (!phone) {
            res.status(422).json({ message: 'O telefone é obrigatorio' })
            return
        }

        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatoria' })
            return
        }

        if (!confirmpassword) {
            res.status(422).json({ message: 'A confirmação de senha é obrigatoria' })
            return
        }

        if (password !== confirmpassword) {
            res.status(422).json({ message: 'A senha e a confirmação de senha precisam ser iguais!' })
            return
        }

        // Verificar se o usuário já existe
        const userExists = await User.findOne({ email: email })

        if (userExists) {
            res.status(422).json({ message: 'Por favor, utilize outro email!' })
            return
        }

        //Criar uma senha com criptografia
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        //Criar Usuário
        const user = new User({
            name: name,
            email: email,
            phone: phone,
            password: passwordHash,
        })

        try {
            const newUser = await user.save()
            await createUserToken(newUser, req, res)
        } catch (error) {
            res.status(500).json({ message: error })
        }

    }

    static async login(req, res) {
        const { email, password } = req.body

        if (!email) {
            res.status(422).json({ message: 'O email é obrigatorio' })
            return
        }
        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatoria' })
            return
        }

        // Verificar se o usuário já existe
        const user = await User.findOne({ email: email })

        if (!user) {
            res.status(422).json({ message: 'Não há usuário cadastrado com esse email!' })
            return
        }

        //Verificar se a senha é igual a senha inserida no bd
        const checkPassaword = await bcrypt.compare(password, user.password)

        if (!checkPassaword) {
            res.status(422).json({ message: 'A senha está incorreta!' })
            return
        }
        await createUserToken(user, req, res)
    }

    //Identificar o usuário atual logado
    static async checkUser(req, res) {

        let currentUser

        if (req.headers.authorization) {
            const token = getToken(req)
            const decoded = jwt.verify(token, 'nossosecret')

            currentUser = await User.findById(decoded.id)
            currentUser.password = undefined

        } else {
            currentUser = null
        }
        res.status(200).send(currentUser)

    }

    //Usuário por Id
    static async getUserById(req, res) {

        const id = req.params.id
        const user = await User.findById(id).select("-password")

        if (!user) {
            res.status(422).json({ message: 'Usuário não encontrado!' })
            return
        }
        res.status(200).json({ user })
    }

    //Editar usuário
    static async editUser(req, res) {
        const id = req.params.id;

        // verifica se o usuário existe
        const token = getToken(req);
        const user = await getUserByToken(token);

        const { name, email, phone, password, confirmpassword } = req.body;

        if (req.file) {
            user.image = req.file.filename;
        }

        // Validações
        if (!name) {
            return res.status(422).json({ message: 'O nome é obrigatorio' });
        }
        user.name = name; // ✅ agora o nome será atualizado

        if (!email) {
            return res.status(422).json({ message: 'O email é obrigatorio' });
        }

        const userExists = await User.findOne({ email: email });

        if (user.email !== email && userExists) {
            return res.status(422).json({ message: 'Por favor, utilize outro email!' });
        }
        user.email = email;

        if (!phone) {
            return res.status(422).json({ message: 'O telefone é obrigatorio' });
        }
        user.phone = phone;

        if (password !== confirmpassword) {
            return res.status(422).json({ message: 'As senhas não conferem!' });
        } else if (password && password === confirmpassword) {
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(password, salt);
            user.password = passwordHash;
        }

        try {
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $set: user },
                { new: true }
            );

            res.status(200).json({
                message: 'Usuário atualizado com sucesso!',
                ...updatedUser._doc, // ✅ envia os dados atualizados ao front-end
            });
        } catch (err) {
            return res.status(500).json({ message: err });
        }
    }

}