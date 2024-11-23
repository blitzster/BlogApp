import { useState } from "react";
import { createPost } from "../api";
import axios from "axios";

export function CreateBlog() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [imagePath, setImagePath] = useState("");

    async function handleImageUpload(e) {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await axios.post("/api/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setImagePath(response.data.filePath);
        } catch (err) {
            console.error("Error uploading image", err);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        let submitObject = {
            title,
            description,
            content,
            image: imagePath, // Add image path to the payload
            author: null,
            dateCreated: new Date(),
        };
        await createPost(submitObject);
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>Blog Post Title</label>
            <input onChange={(e) => setTitle(e.target.value)} required maxLength={100} name="title" />
            <label>Blog Description</label>
            <input onChange={(e) => setDescription(e.target.value)} required maxLength={200} name="description" />
            <label>Blog Content</label>
            <textarea onChange={(e) => setContent(e.target.value)} required maxLength={5000} name="content" />
            <label>Upload Image</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <button type="submit">Submit</button>
        </form>
    );
}
