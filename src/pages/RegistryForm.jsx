import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import firebaseConfig from '../firebase/config';

import axios from 'axios';


console.log(firebaseConfig)

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
function RegistryForm() {
    

  const urlApi = import.meta.env.VITE_REGISTRY_URL;
  console.log(urlApi)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    profileimage: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
 
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const idToken = await userCredential.user.getIdToken();
      
      console.log('Datos enviados al backend:', {
        idToken,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        profileimage: formData.profileimage,
      });
      
      const response = await axios.post(urlApi, {
        idToken,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        profileimage: formData.profileimage,
      });

      
     
      console.log('Respuesta del backend:', response.data);
      setMessage(response.data.message);

      if (response.data.message === 'User registry correct') {
        navigate('/login');
      } else {
        setMessage('No se pudo completar el registro.');
      }


    } catch (error) {
      
      if (error.response) {
        
        console.error('Error en la respuesta del backend:', error.response.data);
        setMessage(error.response.data.message || 'Error en el servidor.');
      } else if (error.request) {
        
        console.error('Error de red o sin respuesta del backend:', error.request);
        setMessage('Error de conexión. Verifica tu red.');
      } else {
      
        console.error('Error inesperado:', error.message);
        setMessage('Ocurrió un error inesperado. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
    
    <div className="App">
      <h1>Registrar Usuario</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          value={formData.username}
          onChange={handleChange}
          required
        />
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
        <input
          type="text"
          name="profileimage"
          placeholder="URL de imagen de perfil (opcional)"
          value={formData.profileimage}
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
      <p>{message}</p>
    </div>

    
    </>
    
  );
}
export default RegistryForm
