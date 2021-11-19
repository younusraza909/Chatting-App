import styled from "styled-components"
import { Avatar } from "@material-ui/core"
import getReciptentEmail from "../utils/getReciptentEmail"
import { useRouter } from "next/router"

import { useAuthState } from "react-firebase-hooks/auth"
import { useCollection } from "react-firebase-hooks/firestore"
import { auth, db } from "../firebase"
import { collection, setDoc, doc, where, query } from "firebase/firestore"
import { async } from "@firebase/util"

function Chat({ id, users }) {
    const router = useRouter()
    const [user] = useAuthState(auth)
    const [reciptentSnapShot] = useCollection(
        query(collection(db, 'users'), where("email", "==", getReciptentEmail(users, user)))
    )
    const reciptent = reciptentSnapShot?.docs?.[0]?.data()



    const reciptentEmail = getReciptentEmail(users, user)


    const enterChat = () => {
        router.push(`/chat/${id}`)
    }


    return (
        <Container onClick={enterChat}>
            {reciptent ? (
                <UserAvatar src={reciptent?.photoUrl} />
            ) :
                <UserAvatar>{reciptentEmail[0]}</UserAvatar>
            }

            <p>{reciptentEmail}</p>
        </Container>
    )
}

export default Chat



const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 10px;
    word-break: break-word;

    :hover{
        background-color: #e9eaeb;
    }
`


const UserAvatar = styled(Avatar)`
    margin:5px;
    margin-right: 15px;
`
