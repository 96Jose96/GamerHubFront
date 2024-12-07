import { useState, useEffect } from "react";
import styles from './News.module.css';

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
        fetchNews()
    }, [])

    return (
        <div>
            {loading && !error ? (
                <p>Cargando noticias...</p>
            ) : error ? (
                <p>Hubo un error: {error}</p>
            ) : (
                <div className={styles.newsGrid}>
                    {homeNews.length === 0 ? (
                        <p>No hay noticias disponibles.</p>
                    ) : (
                        homeNews.map((news) => (
                            <a 
                                key={news.id} 
                                href={news.url} 
                                target="_blank" 
                                className={styles.newsCard}
                            >
                                <img
                                    src={news.urlToImage}
                                    alt={news.title}
                                    className={styles.newsImage}
                                />
                                <div className={styles.cardContent}>
                                    <h2 className={styles.newsTitle}>{news.title}</h2>
                                    <span className={styles.newsDescription}>
                                        {news.description}
                                    </span>
                                </div>
                            </a>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

export default News
