import { Link } from 'react-router-dom'
import Logo from '../../assets/img/logo.png'

import styles from './Navbar.module.css'

import { Context } from '../../context/UserContext'
import { useContext } from 'react'

function Navbar() {
    const { authenticated, logout } = useContext(Context)

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <img src={Logo} alt="Flash Vaga" />
                <h2>FlashVaga</h2>
            </div>
            <ul className={styles.nav_links}>
                <li>
                    <Link to="/">🏠 Início</Link>
                </li>

                {authenticated ? (
                    <>
                        <li>
                            <Link to="/service/myactivities">📝 Minhas atividades</Link>
                        </li>
                        <li>
                            <Link to="/service/myservices">🛠 Meus serviços</Link>
                        </li>
                        <li>
                            <Link to="/user/profile">👤 Perfil</Link>
                        </li>
                        <li className={styles.logout} onClick={logout}>🚪 Sair</li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/login">🔐 Entrar</Link>
                        </li>
                        <li>
                            <Link to="/register">🆕 Cadastrar</Link>
                        </li>
                    </>
                )}
            </ul>
        </aside>
    )
}

export default Navbar
