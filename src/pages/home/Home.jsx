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
            )
        }, 7000)

        return () => clearInterval(interval)
    }, [homeNews.length])

    return (
        <div className={styles.carousel}>
        {loading && !error ? (
          <p>Cargando noticias...</p>
        ) : error ? (
          <p>Hubo un error: {error}</p>
        ) : homeNews.length === 0 ? (
          <p>No hay noticias disponibles.</p>
        ) : (
          <div className={styles.carouselContent}>
            <div className={styles.carouselSlides}>
              <div
                className={styles.slides}
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {homeNews.map((news, index) => (
                  <div
                    key={news.id}
                    className={`${styles.slide} ${index === currentIndex ? styles.active : ""}`}
                  >
                    <div className={styles.imageContainer}>
                      <img src={news.urlToImage} alt={news.title} className={styles.image} />
                      <h2 className={styles.title}>{news.title}</h2>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.textContainer}>
              <h1 className={styles.welcomeText}>
                {currentIndex === 0 && "Bienvenido a GamerHub"}
                {currentIndex === 1 && "Una plataforma social para gamers"}
                {currentIndex === 2 && "Mantente al día con nuestras noticias sobre el mundo gamer"}
                {currentIndex === 3 && "Comparte en nuestra sección de publicaciones"}
              </h1>
            </div>
          </div>
        )}
      </div>
    )
}

export default Home
