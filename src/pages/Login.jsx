import { useState } from 'react'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import firebaseConfig from '../firebase/config'
import { initializeApp } from 'firebase/app'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

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
  
  const navigate = useNavigate();

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

      console.log('Datos enviados al backend:', {
        idToken,
        email: formData.email,
      })

      const response = await axios.post(urlApi, {
        idToken,
        email: formData.email,
      })

      console.log('Respuesta del backend:', response.data)
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
        setMessage('Ocurrió un error inesperado. Inténtalo de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="App">
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default LoginForm
