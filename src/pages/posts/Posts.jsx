import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from './Posts.module.css'


function Posts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [authMessage, setAuthMessage] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const idToken = localStorage.getItem('idToken')

                if (!idToken) {
                    setAuthMessage('Se necesita registro.')
                    setTimeout(() => {
                        navigate('/')
                    }, 2000)
                    return
                }

                const response = await fetch(import.meta.env.VITE_POSTS_URL, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${idToken}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al obtener las publicaciones')
                }

                const postsData = await response.json();
                console.log('Publicaciones recibidas:', postsData)

                
                const sortedPosts = postsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

                setPosts(sortedPosts)
                setLoading(false)
            } catch (error) {
                console.log('Error obteniendo publicaciones:', error)
                setError(error.message)
                setLoading(false)
            }
        };

        fetchPosts();
    }, [navigate]);

    return (
        <>
  {authMessage && authMessage ? (
    <p>{authMessage}</p>
  ) : (
    <>
      <div>
        <Link to={'/posts/create'}>Crear publicación</Link>
        <Link to={'/posts/myposts'}>Ir a mis publicaciones</Link>
      </div>
      <div>
        {loading && !error ? (
          <p>Cargando publicaciones...</p>
        ) : error ? (
          <p>Hubo un error: {error}</p>
        ) : (
          <ul className={styles.postList}>
            {posts.length === 0 ? (
              <p>No hay publicaciones disponibles.</p>
            ) : (
              posts.map((post) => (
                <li key={post._id} className={styles.postCard}>
                  <h2 className={styles.postTitle}>{post.title}</h2>
                  <p className={styles.postContent}>{post.content}</p>
                  <p className={styles.postAuthor}>Autor: {post.author}</p>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </>
  )}
</>

    );
}

export default Posts
