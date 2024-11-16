import { useState, useEffect } from 'react'
import { getPosts, getPost, createPost, updatePost, deletePost } from './api'
import './App.css'

function App() {

  const [posts, setPosts] = useState()
  /*
    function createPost() {
      let postObject = {
        title: "AAAA",
        description: "BBBB",
        content: "CCCC",
        author: "DDDD",
        dateCreated: new Date()
      }
      axios.post("http://localhost:3000/posts", postObject)
    }*/


  useEffect(() => {
    async function loadAllPosts() {
      let data = await getPosts()
      if (data) {
        setPosts(data)
      }
    }
    loadAllPosts()
  }, [])

  return (
    <>
      {JSON.stringify(posts)}
    </>
  )
}

export default App
