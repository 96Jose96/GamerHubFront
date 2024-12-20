import { useState } from 'react'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import firebaseConfig from '../../firebase/config'
import { initializeApp } from 'firebase/app'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import styles from './Login.module.css'

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

function LoginForm() {
  const urlApi = import.meta.env.VITE_LOGIN_URL
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )

      const idToken = await userCredential.user.getIdToken()
      const saveToken = (token) => {
        localStorage.removeItem('idToken 1')
        localStorage.setItem('idToken', idToken)
      }
      saveToken(idToken)

      const response = await axios.post(urlApi, {
        idToken,
        email: formData.email,
      })

      setMessage(response.data.message)

      navigate('/')

    } catch (error) {

      if (error.response) {
        console.error('Error en la respuesta del backend:', error.response.data)
        setMessage(error.response.data.message || 'Error en el servidor.')
      } else if (error.request) {
        console.error('Error de red o sin respuesta del backend:', error.request)
        setMessage('Error de conexión. Verifica tu red.')
      } else {
        console.error('Error inesperado:', error.message)
        setMessage('Credenciales incorrectas.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className={styles.formcontainer}>
        <h1>Iniciar sesión</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
        <p>{message}</p>
      </div>
    </div>
  )
}


export default LoginForm
