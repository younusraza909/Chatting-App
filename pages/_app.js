import '../styles/globals.css'
import Login from "./login"

// To Track if user is logged in or not without redux or anything else we can use this hooks
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../firebase"

function MyApp({ Component, pageProps }) {
  const [user] = useAuthState(auth)

  if (!user) return <Login />

  return <Component {...pageProps} />
}

export default MyApp
