import { useState, useEffect } from "react";
import styles from "./Home.module.css";

function Home() {
    const [homeNews, setHomeNews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_HOME_NEWS_URL)

                if (!response.ok) {
                    throw new Error("Error al obtener las noticias")
                }

                const homeNewsData = await response.json();
                console.log("Noticias recibidas:", homeNewsData)

                setHomeNews(homeNewsData)
                setLoading(false)
            } catch (error) {
                console.log("Error obteniendo noticias:", error)
                setError(error.message)
                setLoading(false)
            }
        }
        fetchNews()
    }, [])

   
    useEffect(() => {
        if (homeNews.length === 0) return

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                (prevIndex + 1) % homeNews.length
            );
        }, 5000)

        return () => clearInterval(interval)
    }, [homeNews.length])

    return (
        <div>
            {loading && !error ? (
                <p>Cargando noticias...</p>
            ) : error ? (
                <p>Hubo un error: {error}</p>
            ) : homeNews.length === 0 ? (
                <p>No hay noticias disponibles.</p>
            ) : (
                <div className={styles.carousel}>
                    <div className={styles.slides}>
                        {homeNews.map((news, index) => (
                            <div
                                key={news.id}
                                className={`${styles.slide} ${
                                    index === currentIndex ? styles.active : ""
                                }`}
                            >
                                <img
                                    src={news.urlToImage}
                                    alt={news.title}
                                    className={styles.image}
                                />
                                <h2 className={styles.title}>{news.title}</h2>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Home
