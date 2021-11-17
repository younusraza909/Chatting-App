import styled from "styled-components"
import { Avatar } from "@material-ui/core"
import getReciptentEmail from "../utils/getReciptentEmail"

import { useAuthState } from "react-firebase-hooks/auth"
import { useCollection } from "react-firebase-hooks/firestore"
import { auth, db } from "../firebase"
import { collection, setDoc, doc, where, query } from "firebase/firestore"

function Chat({ id, users }) {
    const [user] = useAuthState(auth)
    const [reciptentSnapShot] = useCollection(
        query(collection(db, 'users'), where("email", "==", getReciptentEmail(users, user)))
    )
    const reciptent = reciptentSnapShot?.docs?.[0]?.data()

    const reciptentEmail = getReciptentEmail(users, user)

    return (
        <Container>
            {reciptent ? (
                <UserAvatar src={reciptent?.photoURL} />
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
    padding: 15px;
    word-break: break-word;

    :hover{
        background-color: #e9eaeb;
    }
`


const UserAvatar = styled(Avatar)`
    margin:5px;
    margin-right: 15px;
`
