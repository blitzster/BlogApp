import { Link } from "react-router-dom"


export function About() {
    return (
        <div>
            <h1>About Us</h1>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio quo ea in. Quasi esse nisi nostrum corporis minima nihil assumenda.</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore porro alias quibusdam dolore nam similique repellendus quaerat officia!</p>
            <p>If you are interested in contributing, feel free to create a new blog post by visiting our <Link to={"/createBlog"}>Create Blog</Link>Page.</p>
            <p>Explore our content and join our community of writers and readers.</p>

        </div>
    )
}