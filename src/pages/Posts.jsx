import { useState, useEffect } from "react";

function Posts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
               
                const idToken = localStorage.getItem('idToken');

                if (!idToken) {
                    throw new Error('No se encontró el token de autenticación');
                }

                
                const response = await fetch(import.meta.env.VITE_POSTS_URL, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${idToken}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al obtener las publicaciones');
                }

                const postsData = await response.json();
                console.log('Noticias recibidas:', postsData);

                setPosts(postsData);
                setLoading(false);
            } catch (error) {
                console.log('Error obteniendo publicaciones:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div>
            {loading && !error ? (
                <p>Cargando publicaciones...</p>
            ) : error ? (
                <p>Hubo un error: {error}</p>
            ) : (
                <ul>
                    {posts.length === 0 ? (
                        <p>No hay publicaciones disponibles.</p>
                    ) : (
                        posts.map((post) => (
                            <li key={post._id}>
                                <h2>{post.title}</h2>
                                <img src={post.image} alt={post.title} />
                                <p>{post.content}</p>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
}

export default Posts;


