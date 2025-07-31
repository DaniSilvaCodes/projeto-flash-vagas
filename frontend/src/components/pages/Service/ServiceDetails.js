import api from '../../../utils/api'

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

import styles from './ServiceDetails.module.css'

/* hooks */
import useFlashMessage from '../../../hooks/useFlashMessage'


function ServiceDetails() {
    const [service, setServices] = useState({})
    const { id } = useParams()
    const { setFlashMessage } = useFlashMessage()
    const [token] = useState(localStorage.getItem('token') || '')

    useEffect(() => {
        api.get(`/services/${id}`).then((response) => {
            setServices(response.data.service)
        })
    }, [id])

    async function connect() {
        let msgType = 'success'

        const data = await api
            .patch(`services/connect/${service._id}`, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`,
                },
            })
            .then((response) => {
                console.log(response.data)
                return response.data
            })
            .catch((err) => {
                console.log(err)
                msgType = 'error'
                return err.response.data
            })
        console.log("Mensagem recebida:", data)
        setFlashMessage(data.message, msgType)
    }

    return (
        <>
            {service.title && (
                <section className={styles.service_details_container}>
                    <div className={styles.servicedetails_header}>
                        <h1>Conhecendo o Serviço:<br></br> <strong>{service.title}</strong></h1>
                        <p>Se tiver interesse, entre em contato!</p>
                    </div>
                    <div className={styles.service_images}>
                        {service.images.map((image, index) => (
                            <img
                                key={index}
                                src={`${process.env.REACT_APP_API}/images/services/${image}`}
                                alt={service.title}
                            />
                        ))}
                    </div>
                    <p>
                        <span className="bold">Descrição:</span> {service.description}
                    </p>
                    <p>
                        <span className="bold">Categoria:</span> {service.category}
                    </p>
                    <p>
                        <span className="bold">Endereço do serviço:</span> {service.location} 
                    </p>
                    <p>
                        <span className="bold">Data de publicação do serviço:</span> {service.date} 
                    </p>
                    {token ? (
                        <button onClick={connect}>Entrar em contato</button>
                    ) : (
                        <p>
                            Você precisa <Link to="/register">criar uma conta</Link> para
                            entrar em contato.
                        </p>
                    )}
                </section>
            )}
        </>
    )
}

export default ServiceDetails
