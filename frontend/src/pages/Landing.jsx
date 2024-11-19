import { CreateUser } from "../components/CreateUser"
import { Login } from "../components/Login"
import { useState, useSyncExternalStore } from "react"

export function Landing() {

    //View == 0 --> login view
    //View == 1 --> create user view
    const [view, setView] = useState(0)

    return (
        <>
            {!view ?
                <>
                    <Login />
                    <button onClick={() => setView(!view)}>Create new Account</button>
                </> :
                <>
                    <CreateUser />
                    <button onClick={() => setView(!view)}>Login existing account</button>
                </>}
        </>
    )
}