import '../styles/globals.css'
import { useEffect } from "react";
import Login from "./login"
import Loading from "../components/Loading"

// To Track if user is logged in or not without redux or anything else we can use this hooks
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../firebase"
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth)

  useEffect(() => {
    if (user) {
      const ref = collection(db, 'users')
      setDoc(doc(ref, user.uid), {
        email: user.email,
        lastSeen: serverTimestamp(),
        photoUrl: user.photoURL
      }, { merge: true })
    }
  }, [user])
  if (loading) return <Loading />

  if (!user) return <Login />

  return <Component {...pageProps} />
}

export default MyApp
