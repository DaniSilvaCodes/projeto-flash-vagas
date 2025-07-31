import api from '../../utils/api'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

import styles from './Home.module.css'


function Home() {
  const [services, setServices] = useState([])
  const [searchText, setSearchText] = useState('')
  const [searchCategory, setSearchCategory] = useState('')
  const [searchCity, setSearchCity] = useState('')
  const [filteredServices, setFilteredServices] = useState([])

  const categories = [
    '', // opção em branco para forçar a escolha
    'Montagem',
    'Manutenção Residencial',
    'Serviços Elétricos',
    'Serviços Hidráulicos',
    'Limpeza e Conservação',
    'Reformas e Construções',
    'Jardinagem',
    'Pintura',
    'Informática e Tecnologia',
    'Design e Criação',
    'Aulas e Reforço Escolar',
    'Tradução e Revisão de Textos',
    'Serviços de Beleza e Estética',
    'Eventos e Festas',
    'Transporte e Frete',
    'Serviços Administrativos',
    'Consultorias',
    'Saúde e Bem-estar',
    'Cuidados com Animais',
    'Serviços Jurídicos',
    'Serviços Contábeis',
    'Marketing e Publicidade',
    'Desenvolvimento Web e Apps'
  ]

  useEffect(() => {
    api.get('/services').then((response) => {
      // Filtra somente serviços disponíveis
      const availableServices = response.data.services.filter(service => service.available !== false)
      setServices(availableServices)
      setFilteredServices(availableServices)
    })
  }, [])

  function handleSearch() {
    const filtered = services
      .filter(service => service.available !== false)
      .filter((service) => {
        const matchesText =
          service.title.toLowerCase().includes(searchText.toLowerCase()) ||
          service.description.toLowerCase().includes(searchText.toLowerCase())

        const matchesCategory =
          searchCategory === '' || service.category === searchCategory

        const matchesCity =
          searchCity === '' || service.location.toLowerCase().includes(searchCity.toLowerCase())

        return matchesText && matchesCategory && matchesCity
      })

    setFilteredServices(filtered)
  }

  return (
    <section className={styles.service_home_session}>
      <div className={styles.service_home_header}>
        <h1>Bem-vindo ao FlashVaga</h1>
        <p>Facilitando o acesso aos melhores prestadores de serviço!</p>

        <div className={styles.search_container}>
          <input
            type="text"
            placeholder="Buscar por título ou descrição..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className={styles.search_input}
          />

          <input
            type="text"
            placeholder="Buscar por cidade..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className={styles.search_input}
          />

          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className={styles.search_select}
          >
            <option value="">Todas as categorias</option>
            {categories.filter(cat => cat !== '').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <button onClick={handleSearch} className={styles.search_button}>
            Pesquisar
          </button>

          <button onClick={() => {
            setSearchText('')
            setSearchCategory('')
            setSearchCity('')
            setFilteredServices(services)
          }} className={styles.clear_button}>
            Limpar Filtros
          </button>
        </div>
      </div>

      <h3>Veja os detalhes de cada serviço</h3>
      <div className={styles.service_container}>
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div className={styles.service_card} key={service._id}>
              <div
                style={{
                  backgroundImage: `url(${process.env.REACT_APP_API}/images/services/${service.images[0]})`,
                }}
                className={styles.service_card_image}
              ></div>
              <h3>{service.title}</h3>
              <p>
                <span className="bold">Descrição:</span>{' '}
                <span className={styles.description}>{service.description}</span>
              </p>
              <p>
                <span className="bold">Categoria:</span> {service.category}
              </p>
              <p>
                <span className="bold">Cidade:</span> {service.location}
              </p>
              {service.available ? (
                <Link to={`/service/${service._id}`}>Mais detalhes</Link>
              ) : (
                <p className={styles.worker_text}>Serviço indisponível!</p>
              )}
            </div>
          ))
        ) : (
          <p>Não há serviços cadastrados ou disponíveis no momento!</p>
        )}
      </div>
    </section>
  )
}

export default Home
