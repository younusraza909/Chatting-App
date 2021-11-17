import '../styles/globals.css'
import Login from "./login"
import Loading from "../components/Loading"

// To Track if user is logged in or not without redux or anything else we can use this hooks
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../firebase"

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth)

  if (loading) return <Loading />

  if (!user) return <Login />

  return <Component {...pageProps} />
}

export default MyApp
