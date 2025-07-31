import api from '../../../utils/api'

import styles from './Dashboard.module.css'

import { useState, useEffect } from 'react'

import { Link } from "react-router-dom"


import Roundedimage from '../../layout/Roundedimage'

// hooks
import useFlashMessage from '../../../hooks/useFlashMessage'

function MyServices() {
    const [services, setServices] = useState([])
    const [token] = useState(localStorage.getItem('token') || '')
    const { setFlashMessage } = useFlashMessage()

    useEffect(() => {
        api.get('services/myservices', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            }
        })
            .then((response) => {
                setServices(response.data.services)
            })
    }, [token])

    async function removeService(id) {
        let msgType = 'success'

        const data = await api
            .delete(`/services/${id}`, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`,
                },
            })
            .then((response) => {
                const updatedServices = services.filter((service) => service._id !== id)
                setServices(updatedServices)
                return response.data
            })
            .catch((err) => {
                console.log(err)
                msgType = 'error'
                return err.response.data
            })

        setFlashMessage(data.message, msgType)
    }

    async function concludeService(id) {
        let msgType = 'success'

        const data = await api
            .patch(`/services/conclude/${id}`, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`,
                },
            })
            .then((response) => {
                return response.data
            })
            .catch((err) => {
                console.log(err)
                msgType = 'error'
                return err.response.data
            })

        setFlashMessage(data.message, msgType)

    }

    return (
        <section>
            <div className={styles.serviceslist_header}>
                <h1>Meus serviços</h1>
                <Link to="/service/add" >Publicar serviço</Link>
            </div>
            <div className={styles.petslist_container}>
                {services.length > 0 &&
                    services.map((service) => (
                        <div className={styles.servicelist_row} key={service._id}>
                            <Roundedimage
                                src={`${process.env.REACT_APP_API}/images/services/${service.images[0]}`}
                                alt={service.title}
                                width="px75"
                            />
                            <span className='bold'>{service.title}</span>
                            <div className={styles.actions}>
                                {service.available ?
                                    (<>
                                        {service.worker && <button className={styles.conclude_btn} onClick={() =>
                                            concludeService(service._id)
                                        } >Aceitar serviço</button>}
                                        <Link to={`/service/edit/${service._id}`}>Editar</Link>
                                        <button onClick={() =>
                                            removeService(service._id)
                                        }>Excluir</button>
                                    </>)
                                    : <p>Você aceitou o serviço</p>}
                            </div>
                        </div>
                    ))
                }

                {services.length === 0 && (
                    <p>Não há serviços cadastrados</p>
                )}
            </div>

        </section>
    )
}

export default MyServices