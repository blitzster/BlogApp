import { getPost } from "../api";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function ReadBlog() {
    const [post, setPost] = useState({});
    let params = useParams();
    const navigate = useNavigate();
    let id = params.id;

    useEffect(() => {
        async function loadPost() {
            let data = await getPost(id);
            let date = new Date(data.dateCreated);
            data.dateCreated = date.toString();
            setPost(data);
        }
        loadPost();
    }, [id]); // Make sure to include `id` as a dependency so it updates when the URL changes.

    return (
        <>
            <button onClick={() => navigate(-1)}>Back</button>
            {post.image && (
                <img
                    src={`http://localhost:3000${post.image}`} // Use the correct base URL
                    alt={post.title}
                    className="post-image-full"
                />
            )}
            <h1>{post.title}</h1>
            <h2>{post.description}</h2>
            <h3>{post.dateCreated?.slice(4, 15)}</h3>
            <p>{post.content}</p>
        </>
    );
}
