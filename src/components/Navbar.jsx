import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import logo from '../assets/Logo.png';

function Navbar() {
    const navigate = useNavigate()
    const isAuthenticated = localStorage.getItem('idToken')

    const handleLogout = () => {
        localStorage.removeItem('idToken')
        navigate('/')
    }

    return (
        <div className={styles.navbar}>
            <div className={styles.navbarContent}>
                <div className={styles.logoContainer}>
                    <img src={logo} alt='GamerHub' />
                </div>
                <ul className={styles.usernav}>
                    {!isAuthenticated ? (
                        <>
                            <li><Link to={'/login'}>Iniciar sesión</Link></li>
                            <li><Link to={'/registry'}>Registrarse</Link></li>
                        </>
                    ) : (
                        <li><button onClick={handleLogout}>Cerrar sesión</button></li>
                    )}
                </ul>
            </div>
            <ul className={styles.navigation}>
                <li><Link to={'/'}>Home</Link></li>
                <li><Link to={'/news'}>Noticias</Link></li>
                <li><Link to={'/posts'}>Publicaciones</Link></li>
            </ul>
        </div>
    )
}

export default Navbar
