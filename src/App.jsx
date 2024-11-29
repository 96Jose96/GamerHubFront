import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import Ruta from '../components/RutaPrueba'
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

import './App.css';
// Configuración de Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};
// Inicializar Firebase


console.log(firebaseConfig)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
function App() {
  const urlApi = import.meta.env.VITE_API_URL;
  console.log(urlApi)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    profileimage: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      // Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const idToken = await userCredential.user.getIdToken();
      // Verificar datos antes de enviarlos al backend
      console.log('Datos enviados al backend:', {
        idToken,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        profileimage: formData.profileimage,
      });
      // Hacer solicitud al backend
      const response = await axios.post(urlApi, {
        idToken,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        profileimage: formData.profileimage,
      });

      
      // Mostrar mensaje de éxito
      console.log('Respuesta del backend:', response.data);
      setMessage(response.data.message);
    } catch (error) {
      // Manejo detallado de errores
      if (error.response) {
        // Error en la respuesta del backend
        console.error('Error en la respuesta del backend:', error.response.data);
        setMessage(error.response.data.message || 'Error en el servidor.');
      } else if (error.request) {
        // Error de red o sin respuesta del backend
        console.error('Error de red o sin respuesta del backend:', error.request);
        setMessage('Error de conexión. Verifica tu red.');
      } else {
        // Otro tipo de error
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
export default App;
