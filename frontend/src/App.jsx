import { useState, useEffect } from 'react'
import { getPosts, getPost, createPost, updatePost, deletePost } from './api'
import './App.css'

function App() {

  const [posts, setPosts] = useState()
  function makePost() {
    let postObject = {
      title: "ZZZZ",
      description: "XXXX",
      content: "YYYY",
      author: "AAAA",
      dateCreated: new Date()
    }
    createPost(postObject)
  }


  // useEffect(() => {
  //   async function loadAllPosts() {
  //     let data = await getPosts()
  //     if (data) {
  //       setPosts(data)
  //     }
  //   }
  //   loadAllPosts()
  // }, [])

  return (
    <>
      <button onClick={makePost}>
        CreatePost
      </button>
    </>
  )
}

export default App
