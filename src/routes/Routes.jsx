import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import News from '../pages/News'
import RegistryForm from '../pages/RegistryForm'
import LoginForm from '../pages/Login'
import Posts from '../pages/Posts'
import CreatePost from '../pages/PostForm'
import MyPosts from '../pages/MyPosts'

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