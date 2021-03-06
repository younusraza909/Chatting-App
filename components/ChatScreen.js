import styled from "styled-components"
import Message from "./Message"
import getReciptentEmail from "../utils/getReciptentEmail"
import Moment from "react-moment"

import { useAuthState } from "react-firebase-hooks/auth"
import { useCollection } from "react-firebase-hooks/firestore"

import { auth, db } from "../firebase"
import { collection, doc, query, orderBy, setDoc, addDoc, serverTimestamp, where } from "firebase/firestore"
import { useRouter } from "next/router"
import { Avatar, IconButton } from "@material-ui/core"


import MoreVertIcon from "@material-ui/icons/MoreVert"
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon"
import AttachFileIcon from "@material-ui/icons/AttachFile"
import MicIcon from "@material-ui/icons/Mic"
import { useState, useRef } from "react"

function ChatScreen({ chat, messages }) {
    const endOfMessagesRef = useRef(null)
    const [user] = useAuthState(auth)
    const [input, setInput] = useState('')
    const router = useRouter()
    const [messageSnapShot] = useCollection(
        query(collection(db, 'chats', router.query.id, 'messages'), orderBy('timestamp', 'asc'))
    )
    const [reciptentSnapShot] = useCollection(
        query(collection(db, "users"), where('email', '==', getReciptentEmail(chat.users, user)))
    )

    const showMessages = () => {
        if (messageSnapShot) {

            return messageSnapShot.docs.map(msg => {
                //  new Date(msg.data().timestamp.seconds * 1000)
                // Sometime you get timestamp from  server as {second:*,nanosecond:*}
                // So we can use above line formula to covnert
                return (
                    <Message
                        key={msg.id}
                        user={msg.data().user}
                        message={
                            {
                                ...msg.data(),
                                timestamp: new Date(msg.data().timestamp.seconds * 1000)
                            }
                        }
                    />
                )

            })
        }
        else {
            return JSON.parse(messages).map(msg => (
                <Message
                    key={msg.id}
                    user={msg.user}
                    message={
                        msg
                    }
                />
            ))
        }
    }

    const ScrollToBottom = () => {
        endOfMessagesRef.current.scrollIntoView({
            behavior: "smooth",
            block: 'start'
        })
    }

    const sendMessage = async (e) => {
        e.preventDefault()
        await setDoc(doc(db, 'users', user.uid), {
            lastSeen: serverTimestamp()
        }, { merge: true })

        await addDoc(collection(db, 'chats', router.query.id, 'messages'), {
            timestamp: serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL
        })

        setInput('');
        ScrollToBottom()
    }

    const reciptentEmail = getReciptentEmail(chat.users, user)
    const reciptent = reciptentSnapShot?.docs?.[0]?.data()

    return (
        <Container>
            <Header >
                {reciptent ? (
                    <Avatar src={reciptent?.photoUrl} />
                ) :
                    <Avatar>{reciptentEmail[0]}</Avatar>
                }
                <HeaderInfo>
                    <h3>{reciptentEmail}</h3>
                    {
                        reciptentSnapShot ? (
                            <p>Last Active {" "}
                                {reciptent?.lastSeen?.toDate() ? (
                                    <Moment fromNow>{reciptent?.lastSeen?.toDate()}</Moment>
                                ) : "Unavialable"}
                            </p>

                        ) : (
                            <p>Loading Last Active</p>
                        )
                    }
                </HeaderInfo>
                <HeaderIcons>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                </HeaderIcons>
            </Header>
            <MessageContainer>
                {showMessages()}
                <EndMessage ref={endOfMessagesRef} />
            </MessageContainer>

            <InputContainer>
                <InsertEmoticonIcon />
                <Input value={input} onChange={e => setInput(e.target.value)} />
                <button hidden disabled={!input}
                    type='submit'
                    onClick={sendMessage}>Send Message</button>
                <MicIcon />
            </InputContainer>
        </Container>
    )
}

export default ChatScreen


const InputContainer = styled.form`
    display:flex;
    align-items: center;
    padding: 10px;
    bottom:0;
    position:sticky;
    background-color: white;
    z-index: 100;
    `

const Input = styled.input`
    flex:1;
    outline: 0;
    border:none;
    border-radius: 10px;
    padding:20px;
    margin-left: 15px;
    margin-right: 15px;
    background-color: whitesmoke;

`

const Container = styled.div``

const Header = styled.div`
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 100;
    display: flex;
    padding: 11px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`
const HeaderInfo = styled.div`
    margin-left: 15px;
    flex:1;

    > h3{
        margin-bottom: 3px;
    }

    > p{
        font-size: 14px;
        color:gray;
    }
`
const HeaderIcons = styled.div``

const EndMessage = styled.div`
    margin-bottom: 50px;
`

const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`