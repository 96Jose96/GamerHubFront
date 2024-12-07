import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import logo from '../assets/Logo.png';
import { useState } from 'react';

function Navbar() {
    const navigate = useNavigate()
    const isAuthenticated = localStorage.getItem('idToken')

    const handleLogout = () => {
        localStorage.removeItem('idToken')
        navigate('/')
    }

    const [openMenu, setOpenMenu] = useState(false)

    const toggleMenu = () => {
        setOpenMenu(!openMenu)
    }

    const closeMenu = () => {
        setOpenMenu(false)
    }

    return (
        <div className={styles.navbar}>
            <div className={styles.logoContainer}>
                <img src={logo} alt="GamerHub" />
            </div>
            <input
                type="checkbox"
                id="menuToggle"
                className={styles.menuToggle}
                checked={openMenu}
                onChange={toggleMenu}
            />
            <label htmlFor="menuToggle" className={styles.menuIcon}>
                &#9776;
            </label>
            <div className={`${styles.navContent} ${openMenu ? styles.open : ''}`}>
                <ul className={styles.navigation} onClick={closeMenu}>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/news">Noticias</Link></li>
                    <li><Link to="/posts">Publicaciones</Link></li>
                </ul>
                <ul className={styles.usernav} onClick={closeMenu}>
                    {!isAuthenticated ? (
                        <>
                            <li><Link to="/login">Iniciar sesión</Link></li>
                            <li><Link to="/registry">Registrarse</Link></li>
                        </>
                    ) : (
                        <li><button onClick={handleLogout}>Cerrar sesión</button></li>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default Navbar;
