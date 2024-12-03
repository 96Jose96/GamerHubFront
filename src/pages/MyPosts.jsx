import { useState, useEffect } from "react"

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
        <div>
            <h1>Mis publicaciones</h1>
            {myPosts.map(post => (
                <div key={post._id}>
                    {editPost === post._id ? (
                        <div>
                            <h2>Editar publicación</h2>
                            <input 
                                type="text" 
                                value={editForm.title} 
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} 
                                placeholder="Title"
                            />
                            <textarea 
                                value={editForm.content} 
                                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })} 
                                placeholder="Content"
                            />
                            <button onClick={saveEdit}>Grabar</button>
                            <button onClick={cancelEdit}>Cancelar</button>
                        </div>
                    ) : (
                        <div>
                            <h2>{post.title}</h2>
                            <p>{post.content}</p>
                            {post.image && <img src={post.image} alt={post.title} />}
                            <button onClick={() => deletePost(post._id)}>Borrar</button>
                            <button onClick={() => setEditPost(post._id)}>Editar</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default MyPosts
