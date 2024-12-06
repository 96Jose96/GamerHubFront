import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import styles from './MyPosts.module.css'

function MyPosts() {
    const [myPosts, setMyPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [editPost, setEditPost] = useState(null)
    const [editForm, setEditForm] = useState({ title: '', content: '' })

    const fetchMyPosts = async () => {
        const idToken = localStorage.getItem('idToken')
        if (!idToken) {
            console.error('No token found')
            return
        }

        try {
            const response = await fetch(import.meta.env.VITE_MYPOSTS_URL, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    Authorization: `Bearer ${idToken}`
                }
            })

            if (!response.ok) {
                throw new Error('Fetch posts FAILED')
            }

            const data = await response.json()
            setMyPosts(data.posts)
            setLoading(false)
        } catch (error) {
            console.error('Fetch posts FAILED', error)
        }
    };

    const deletePost = async (postId) => {
        const idToken = localStorage.getItem('idToken')
        if (!idToken) {
            console.error('No token found')
            return
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_POST_DELETE_URL}${postId}`, {
                method: 'DELETE',
                headers: {  
                    'content-type': 'application/json',
                    Authorization: `Bearer ${idToken}`
                },
                body: JSON.stringify({ postId })
            })

            if (!response.ok) {
                throw new Error('Delete post FAILED')
            }

            alert('Publicación borrada con éxito')
            fetchMyPosts()
        } catch (error) {
            console.error('Delete post FAILED', error)
        }
    };

    const saveEdit = async () => {
        const idToken = localStorage.getItem('idToken')
        if (!idToken || !editPost) return

        try {
            const response = await fetch(import.meta.env.VITE_POST_UPDATE_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`
                },
                body: JSON.stringify({ 
                    postId: editPost, 
                    title: editForm.title, 
                    content: editForm.content 
                })
            });

            if (!response.ok) {
                throw new Error('Failed to edit post')
            }

            alert('Publicación actualizada con éxito')
            fetchMyPosts()
            cancelEdit()
        } catch (error) {
            console.error('Error editing post:', error)
        }
    };

    const cancelEdit = () => {
        setEditPost(null)
        setEditForm({ title: '', content: '' })
    };

    useEffect(() => {
        fetchMyPosts()
    }, [])

    if (loading) return <p>Loading...</p>

    return (
        <>
    <div className={styles.myPostsContainer}>
        <div className={styles.myPostsTitle}>
            <h2>Mis publicaciones</h2>
            <Link to={'/posts'} className={styles.backLink}>Volver</Link>
        </div>
        {myPosts.map((post) => (
            <div key={post._id} className={styles.postCard}>
                {editPost === post._id ? (
                    <div>
                        <h2>Editar publicación</h2>
                        <input 
                            type="text" 
                            value={editForm.title} 
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} 
                            placeholder="Title"
                            maxLength="80"
                            className={styles.inputTitle}
                        />
                        <textarea 
                            value={editForm.content} 
                            onChange={(e) => setEditForm({ ...editForm, content: e.target.value })} 
                            placeholder="Content"
                            maxLength="200"
                            className={styles.inputText}
                        />
                        <button onClick={saveEdit} className="postButton">Grabar</button>
                        <button onClick={cancelEdit} className="postButton">Cancelar</button>
                    </div>
                ) : (
                    <div>
                        <h2 className={styles.postTitle}>{post.title}</h2>
                        <p className={styles.postContent}>{post.content}</p>
                        {post.image && <img src={post.image} alt={post.title} />}
                        <div>
                            <button onClick={() => deletePost(post._id)} className={styles.postButton}>Borrar</button>
                            <button onClick={() => setEditPost(post._id)} className={styles.postButton}>Editar</button>
                        </div>
                    </div>
                )}
            </div>
        ))}
    </div>
</>

    )
}

export default MyPosts
