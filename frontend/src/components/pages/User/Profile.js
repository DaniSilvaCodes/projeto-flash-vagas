import api from '../../../utils/api';
import Input from '../../form/Input';
import { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import formStyles from '../../form/Form.module.css';
import useFlashMessage from '../../../hooks/useFlashMessage';
import RoundedImage from '../../layout/Roundedimage';

function Profile() {
  const [user, setUser] = useState({});
  const [preview, setPreview] = useState();
  const [token] = useState(localStorage.getItem('token') || '');
  const { setFlashMessage } = useFlashMessage();

  // Busca o usuário autenticado ao carregar
  useEffect(() => {
    api
      .get('/users/checkuser', {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        setUser(response.data);
      });
  }, [token]);

  // Atualiza estado local ao digitar nos inputs
  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  // Captura imagem para preview e envio
  function onFileChange(e) {
    setPreview(e.target.files[0]);
    setUser({ ...user, [e.target.name]: e.target.files[0] });
  }

  // Envia o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    let msgType = 'success';
    const formData = new FormData();

    // Adiciona os campos do usuário ao formData
    Object.keys(user).forEach((key) => {
      if (
        (key === 'password' || key === 'confirmpassword') &&
        user[key] === ''
      ) {
        return; // ignora senhas vazias
      }
      formData.append(key, user[key]);
    });

    const data = await api
      .patch(`/users/edit/${user._id}`, formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        // Se o back-end retornar os dados atualizados
        if (response.data._id) {
          setUser(response.data);
        } else {
          // Fallback: usa os mesmos dados enviados
          setUser((prev) => ({ ...prev, ...user }));
        }

        return response.data;
      })
      .catch((err) => {
        msgType = 'error';
        return err.response.data;
      });

    setFlashMessage(data.message, msgType);
  };

  return (
    <section>
      <div className={styles.profile_header}>
        <h1>Perfil</h1>

        {(user.image || preview) && (
          <RoundedImage
            src={
              preview
                ? URL.createObjectURL(preview)
                : `${process.env.REACT_APP_API}/images/users/${user.image}`
            }
            alt={user.name}
          />
        )}
      </div>

      <form onSubmit={handleSubmit} className={formStyles.form_container}>
        <Input
          text="Imagem"
          type="file"
          name="image"
          handleOnChange={onFileChange}
        />
        <Input
          text="E-mail"
          type="email"
          name="email"
          placeholder="Digite o e-mail"
          handleOnChange={handleChange}
          value={user.email || ''}
        />
        <Input
          text="Nome"
          type="text"
          name="name"
          placeholder="Digite o nome"
          handleOnChange={handleChange}
          value={user.name || ''}
        />
        <Input
          text="Telefone"
          type="text"
          name="phone"
          placeholder="Digite o seu telefone"
          handleOnChange={handleChange}
          value={user.phone || ''}
        />
        <Input
          text="Senha"
          type="password"
          name="password"
          placeholder="Digite a sua senha"
          handleOnChange={handleChange}
        />
        <Input
          text="Confirmação de senha"
          type="password"
          name="confirmpassword"
          placeholder="Confirme a sua senha"
          handleOnChange={handleChange}
        />
        <input type="submit" value="Editar" />
      </form>
    </section>
  );
}

export default Profile;
