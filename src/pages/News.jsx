import { useState, useEffect } from "react";

function News() {
    const [homeNews, setHomeNews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchNews = async () => {
            try {
                
                const response = await fetch(import.meta.env.VITE_NEWS_URL)
                
                if (!response.ok) {
                    throw new Error('Error al obtener las noticias')
                }

                const homeNewsData = await response.json()
                console.log('Noticias recibidas:', homeNewsData)

                setHomeNews(homeNewsData)

                setLoading(false)
            } catch (error) {
                console.log('Error obteniendo noticias:', error)
                setError(error.message)
                setLoading(false)
            }
        }
        fetchNews();
    }, [])

    return (
        <div>
            
            {loading && !error ? (
                <p>Cargando noticias...</p>
            ) : error ? (
                <p>Hubo un error: {error}</p>
            ) : (
                <ul>
                    {homeNews.length === 0 ? (
                        <p>No hay noticias disponibles.</p>
                    ) : (
                        homeNews.map((news) => (
                            <li key={news.id}>
                                <h2>{news.title}</h2>
                                <img src={news.urlToImage} alt={news.title} />
                                <p>{news.description}</p>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
}

export default News;
