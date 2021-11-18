import styled from "styled-components"
import Message from "./Message"

import { useAuthState } from "react-firebase-hooks/auth"
import { useCollection } from "react-firebase-hooks/firestore"

import { auth, db } from "../firebase"
import { collection, doc, query, orderBy, setDoc, addDoc, serverTimestamp } from "firebase/firestore"
import { useRouter } from "next/router"
import { Avatar, IconButton } from "@material-ui/core"


import MoreVertIcon from "@material-ui/icons/MoreVert"
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon"
import AttachFileIcon from "@material-ui/icons/AttachFile"
import MicIcon from "@material-ui/icons/Mic"
import { useState } from "react"

function ChatScreen({ chat, messages }) {
    const [user] = useAuthState(auth)
    const [input, setInput] = useState('')
    const router = useRouter()
    const [messageSnapShot] = useCollection(
        query(collection(db, 'chats', router.query.id, 'messages'), orderBy('timestamp', 'asc'))
    )

    const showMessages = () => {
        if (messageSnapShot) {
            return messageSnapShot.docs.map(msg => (
                <Message
                    key={msg.id}
                    user={msg.data().user}
                    message={
                        {
                            ...msg.data(),
                            timestamp: msg.timestamp?.toDate().getTime()
                        }
                    }
                />
            ))
        } else {
            return JSON.parse(messages).map(msg => {
                <Message
                    key={msg.id}
                    user={msg.user}
                    message={
                        msg
                    }
                />
            })
        }
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
    }


    return (
        <Container>
            <Header >
                <Avatar />
                <HeaderInfo>
                    <h3>Rec Email</h3>
                    <p>Last seen..</p>
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
                <EndMessage />
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
`

const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`