import { BlogCard } from "../components/BlogCard"
import { useState, useEffect } from "react"
import { getAllPosts } from '../api'


export function Profile() {

    const [post, setPosts] = useState([])
    const [user, setUser] = useState({})

    useEffect(() => {
        async function loadUserData() {

        }
        loadUserData()
    }, [])

    return (
        <>
            Profile
        </>
    )
}