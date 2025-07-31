import api from '../../../utils/api'

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import styles from './AddService.module.css'

import ServiceForm from '../../form/ServiceForm'

/* hooks */
import useFlashMessage from '../../../hooks/useFlashMessage'

function EditService() {
  const [service, setService] = useState({})
  const [token] = useState(localStorage.getItem('token') || '')
  const { id } = useParams()
  const { setFlashMessage } = useFlashMessage()

  useEffect(() => {
    api
      .get(`/services/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        setService(response.data.service)
      })
  }, [token, id])

  async function updateService(service) {
    let msgType = 'success'

    const formData = new FormData()

    const serviceFormData = await Object.keys(service).forEach((key) => {
      if (key === 'images') {
        for (let i = 0; i < service[key].length; i++) {
          formData.append(`images`, service[key][i])
        }
      } else {
        formData.append(key, service[key])
      }
    })

    formData.append('service', serviceFormData)

    const data = await api
      .patch(`services/${service._id}`, formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          'Content-Type': 'multipart/form-data',
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

    setFlashMessage(data.message, msgType)
  }

  return (
    <section>
      <div className={styles.addservice_header}>
        <h1>Editando o serviço: {service.title}</h1>
        <p>Depois da edição os dados serão atualizados no sistema</p>
      </div>
      {service.title && (
        <ServiceForm handleSubmit={updateService} serviceData={service} btnText="Editar" />
      )}
    </section>
  )
}

export default EditService


