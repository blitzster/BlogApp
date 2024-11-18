import { useState } from "react"
import { createPost } from "../api"


export function CreateBlog() {

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [content, setContent] = useState("")

    async function handleSubmit() {
        let submitObject = {
            title: title,
            description: description,
            content: content,
            author: null,
            dateCreated: new Date()
        }

        await createPost(submitObject)
    }


    return (
        <form onSubmit={handleSubmit}>
            <label>Blog Post Title</label>
            <input onChange={(e) => setTitle(e.target.value)} required maxLength={100} name="title" />
            <label>Blog Description</label>
            <input onChange={(e) => setDescription(e.target.value)} required maxLength={200} name="description" />
            <label>Blog Content</label>
            <textarea onChange={(e) => setContent(e.target.value)} required maxLength={5000} name="content" />
            <button type="submit">Submit</button>
        </form>
    )
}