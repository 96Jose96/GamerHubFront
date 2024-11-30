import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate()
    
    const isAuthenticated = localStorage.getItem('idToken')

    const handleLogout = () => {
        localStorage.removeItem('idToken')

        navigate('/')
    }

    return (
        <nav>
            <ul>
                <li><Link to={'/'}>Home</Link></li>
                <li><Link to={'/news'}>Noticias</Link></li>
                <li><Link to={'/posts'}>Publicaciones</Link></li>
            </ul>

            <ul>
                {!isAuthenticated ? (
                    <>
                        <li><Link to={'/login'}>Iniciar sesión</Link></li>
                        <li><Link to={'/registry'}>Registrarse</Link></li>
                    </>
                ) : (
                    <li><button onClick={handleLogout}>Cerrar sesión</button></li>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
