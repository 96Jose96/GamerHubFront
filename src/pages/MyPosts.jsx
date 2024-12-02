import { useState, useEffect  } from "react";

function MyPosts() {
    const [myPosts, setMyPosts] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchMyPosts = async () => {
        const idToken = localStorage.getItem('idToken')
        if (!idToken) {
            console.error('No token found')
            return 
        }

        try {
            const response = await fetch()
        } catch (error) {

        }
    }
} 