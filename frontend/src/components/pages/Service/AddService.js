import api from '../../../utils/api'

import styles from './AddService.module.css'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useFlashMessage from '../../../hooks/useFlashMessage'

// Componentes
import ServiceForm from '../../form/ServiceForm'

function AddService() {
    const [token] = useState(localStorage.getItem('token') || '')
    const {setFlashMessage} = useFlashMessage()
    const navigate = useNavigate()

    async function registerService(service) {
        let msgType = 'success'
        const formData = new FormData()

        await Object.keys(service).forEach((key) => {
            if (key === 'images') {
                for (let i = 0; i < service[key].length; i++) {
                    formData.append('images', service[key][i])
                }
            } else {
                formData.append(key, service[key])
            }
        }) // <-- fechamento correto aqui

        const data = await api.post('services/create', formData, {
           headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            'Content-Type': 'multipart/form-data', 

           } 
        })
        .then((response) => {
            return response.data
        })
        .catch((err)=>{
            
            msgType = 'error'
            return err.response.data
        })

        setFlashMessage(data.message, msgType)
        if(msgType !== 'error'){
            navigate('/service/myservices')
        }
    }


    return (
        <section className={styles.addservice_header}>
            <div>
                <h1>Cadastre um Serviço</h1>
                <p>Depois ele ficará disponivel a todos </p>
            </div>
            <ServiceForm handleSubmit={registerService} btnText="Publicar serviço" />
        </section>
    )
}

export default AddService