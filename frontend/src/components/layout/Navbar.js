import { Link } from 'react-router-dom'

import Logo from '../../assets/img/logo.png'

import styles from './Navbar.module.css'

// Contexto do usuário
import { Context } from '../../context/UserContext'
import { useContext } from 'react'

function Navbar() {

    const { authenticated, logout } = useContext(Context)

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbar_logo}>
                <img src={Logo} alt='Flash Vaga' />
                <h2>FlashVaga</h2>
            </div>
            <ul>
                <li>
                    <Link to="/" >Inicio</Link>
                </li>
                {authenticated ? (
                    <>
                        <li>
                            <Link to="/service/myactivities" >Minhas atividades</Link>
                        </li>
                        <li>
                            <Link to="/service/myservices" >Meus serviços</Link>
                        </li>
                        <li>
                            <Link to="/user/profile" >Perfil</Link>
                        </li>
                        <li onClick={logout} className={styles.navbar_button}>Sair</li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/login" >Entrar</Link>
                        </li>
                        <li>
                            <Link to="/register" >Cadastrar</Link>
                        </li>
                    </>
                )}

            </ul>
        </nav>
    )
}

export default Navbar