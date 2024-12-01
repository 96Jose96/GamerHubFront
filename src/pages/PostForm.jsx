import { useState } from "react";
import axios from 'axios'
import { Navigate, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function CreatePost() {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: ''
    })

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const urlApi = 'http://localhost:8080/posts/create'             //import.meta.env.VITE_POST_CREATE_URL

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        console.log('Request payload:', formData);
        


        try {
            const idToken = localStorage.getItem('idToken')
            const response = await axios.post(
                urlApi,
                {...formData},
                {headers: {
                    Authorization: `Bearer ${idToken}`
                }}
            )
    
            console.log('Server response:', response.data)
            setMessage('¡Publicación creada con éxito')
            setFormData({ title: '', content: '', image: '' })
            navigate('/posts')
        } catch (error) {
            console.error('Post create FAILED', error)
            setMessage(error.response?.data?.message || 'Ocurrió un error. Intentalo de nuevo.')
        } finally {
            setLoading(false)
        }
    }


    return (
        <>
        <div>
            <Link to={'/posts'}>Volver</Link>
        </div>
        <div>
      <h1>Crear Publicación</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Contenido:</label>
          <textarea
            name="content"
            id="content"
            rows="5"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="image">URL de Imagen:</label>
          <input
            type="text"
            name="image"
            id="image"
            value={formData.image}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Publicando..." : "Crear Publicación"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
        
        </>
    )
}

export default CreatePost