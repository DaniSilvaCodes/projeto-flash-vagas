import api from '../../../utils/api'

import { useState, useEffect } from 'react'

import styles from './Dashboard.module.css'

import RoundedImage from '../../layout/Roundedimage'

function MyActivities() {
  const [services, setServices] = useState([])
  const [token] = useState(localStorage.getItem('token') || '')

  useEffect(() => {
    api
      .get('/services/myactivities', {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        setServices(response.data.services)
      })
  }, [token])

  return (
    <section>
      <div className={styles.serviceslist_header}>
        <h1>Minhas atividades</h1>
      </div>
      <div className={styles.serviceslist_container}>
        {services.length > 0 &&
          services.map((service) => (
            <div key={service._id} className={styles.servicelist_row}>
              <RoundedImage
                src={`${process.env.REACT_APP_API}/images/services/${service.images[0]}`}
                alt={service.title}
                width="px75"
              />
              <span className="bold">{service.title}</span>
              <div className={styles.contacts}>
                <p>
                  <span className="bold">Ligue para:</span> {service.user.phone}
                </p>
                <p>
                  <span className="bold">Fale com:</span> {service.user.name}
                </p>
              </div>
              <div className={styles.actions}>
                {service.available ? (
                  <p>Aguardando solicitação</p>
                ) : (
                  <p>Sua solicitação de serviço foi aceita</p>
                )}
              </div>
            </div>
          ))}
        {services.length === 0 && <p>Ainda não há serviços solicitados!</p>}
      </div>
    </section>
  )
}

export default MyActivities
