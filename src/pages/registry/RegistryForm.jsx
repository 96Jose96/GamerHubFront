import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import firebaseConfig from '../../firebase/config';
import axios from 'axios';
import styles from '../login/Login.module.css'

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

function RegistryForm() {    
    const urlApi = import.meta.env.VITE_REGISTRY_URL

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        profileimage: '',
    })

    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
  
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }
 
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            )

            const idToken = await userCredential.user.getIdToken()
      
            const response = await axios.post(urlApi, {
                idToken,
                username: formData.username,
                email: formData.email,
                password: formData.password,
            })

            setMessage(response.data.message)

            if (response.data.message === 'Usuario registrado con éxito') {
                setMessage('Usuario registrado con éxito')
                setTimeout(() => {
                    navigate('/login')
                }, 2000)
            } else {
              setMessage('No se pudo completar el registro.')
            }
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.message || 'Error en el servidor.')
            } else if (error.request) {
                setMessage('Error de conexión. Verifica tu red.')
            } else {
                setMessage('Ocurrió un error inesperado. Inténtalo de nuevo.')
            }
        } finally {
            setLoading(false)
        }
    }
    return (
        <div>
            <div className={styles.formcontainer}>
                <h1>Registrar Usuario</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        className={styles.input}
                        type="text"
                        name="username"
                        placeholder="Nombre de usuario"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        className={styles.input}
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        className={styles.input}
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" disabled={loading} className={styles.button}>
                        {loading ? 'Registrando...' : 'Registrar'}
                    </button>
                </form>
                <p>{message}</p>
            </div>
        </div>
    )
}

export default RegistryForm
