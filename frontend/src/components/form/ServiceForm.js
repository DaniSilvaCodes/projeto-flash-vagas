import { useState } from 'react'

import formStyles from './Form.module.css'

import Input from './Input'
import Select from './Select'

function ServiceForm({ handleSubmit, serviceData, btnText }) {
    const [service, setService] = useState(serviceData || {})
    const [preview, setPreview] = useState([])
    const categorys = [ 
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
  'Desenvolvimento Web e Apps'] //Categorias de serviços

    function onFileChange(e) {
        setPreview(Array.from(e.target.files))
        setService({ ...service, images: [...e.target.files] })
    }
    function handleChange(e) {
        setService({ ...service, [e.target.name]: e.target.value })

    }
    function handleCategory(e) {
        const selectedCategory = e.target.options[e.target.selectedIndex].text
        setService({ ...service, category: selectedCategory })
    }

    function submit(e) {
        e.preventDefault()
        console.log(service)
        handleSubmit(service)
    }

    return (
        <form onSubmit={submit} className={formStyles.form_container}>
            <div className={formStyles.preview_service_images}>
                {preview.length > 0
                    ? preview.map((image, index) =>
                        <img src={URL.createObjectURL(image)} alt={service.title} key={`${service.title} + ${index}`} />
                    )
                    : service.images && service.images.map((image, index) =>
                        <img src={`${process.env.REACT_APP_API}/images/services/${image}`}
                            alt={service.title} key={`${service.title} + ${index}`} />


                    )}
            </div>
            <Input
                text="Imagens do Serviço"
                type="file"
                name="images"
                handleOnChange={onFileChange}
                multiple={true}
            />
            <Input
                text="Titulo do serviço"
                type="text"
                name="title"
                placeholder="Digite o titulo"
                handleOnChange={handleChange}
                value={service.title || ''}
            />
            <Input
                text="Descrição do serviço"
                type="text"
                name="description"
                placeholder="Descreva o serviço"
                handleOnChange={handleChange}
                value={service.description || ''}
            />
            <Input
                text="Valor do serviço"
                type="number"
                name="value"
                placeholder="Valor do serviço"
                handleOnChange={handleChange}
                value={service.value || ''}
            />
            <Input
                text="Local onde mora"
                type="text"
                name="location"
                placeholder="Informe a Cidade e o Estado"
                handleOnChange={handleChange}
                value={service.location || ''}
            />
            <Input
                text="Data de divulgação do serviço"
                type="text"
                name="date"
                placeholder="Exemplo: 10/08/25"
                handleOnChange={handleChange}
                value={service.date || ''}
            />
            <Select
                name="Área de atuação"
                text="Selecione a área de atuação"
                options={categorys}
                handleOnChange={handleCategory}
                value={service.category || ''}
            />
            <input type='submit' value={btnText} />

        </form>
    )
}

export default ServiceForm