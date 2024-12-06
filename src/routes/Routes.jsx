import { Routes, Route } from 'react-router-dom'
import Home from '../pages/home/Home.jsx'
import News from '../pages/news/News.jsx'
import RegistryForm from '../pages/registry/RegistryForm.jsx'
import LoginForm from '../pages/login/Login.jsx'
import Posts from '../pages/posts/Posts.jsx'
import CreatePost from '../pages/postForm/PostForm.jsx'
import MyPosts from '../pages/myPosts/MyPosts.jsx'

function Paths() {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/news' element={<News />} />
            <Route path='/registry' element={<RegistryForm />} />
            <Route path='/login' element={<LoginForm />} />
            <Route path='/posts' element={<Posts />} />
            <Route path='/posts/create' element={<CreatePost/>} />
            <Route path='/posts/myposts' element={<MyPosts />} />
        </Routes>
    )
}

export default Paths