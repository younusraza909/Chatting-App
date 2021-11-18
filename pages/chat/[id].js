import styled from "styled-components"
import Head from "next/head"

import Sidebar from "../../components/Sidebar"
import ChatScreen from "../../components/ChatScreen"

import { collection, doc, getDocs, getDoc, query, orderBy } from "firebase/firestore"
import { db, auth } from "../../firebase"

import { useAuthState } from "react-firebase-hooks/auth"
import getReciptentEmail from "../../utils/getReciptentEmail"


function Chat({ chat, messages }) {
    const [user] = useAuthState(auth)
    return (
        <Container>
            <Head>
                <title>Chat with {getReciptentEmail(chat.users, user)}</title>
            </Head>
            <Sidebar />
            <ChatContainer>
                <ChatScreen chat={chat} messages={messages} />
            </ChatContainer>
        </Container>
    )
}

export default Chat

export async function getServerSideProps(context) {
    const ref = doc(db, 'chats', context.query.id)



    // Prep Messages
    const messageQuery = query(collection(db, 'chats', context.query.id, 'messages'), orderBy('timestamp', 'asc'))
    const messagesRef = await getDocs(messageQuery)

    const messages = messagesRef.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })).map(messages => ({
        // When we send data from backend to frontend in most cases we looses timestamp data type
        //so we are making it again so we can have a proper timestamp 
        ...messages,
        timestamp: messages.timestamp.toDate().getTime()
    }))

    //Prep the Chats
    const ChatRef = await getDoc(ref)
    const chat = {
        id: ChatRef.id,
        ...ChatRef.data()
    }

    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat
        }
    }
}

const Container = styled.div`
    display: flex;
`

const ChatContainer = styled.div`
  flex:1;
  overflow: scroll;
  height: 100vh;

  //in order to hide scroll bar on differnet platform
  ::-webkit-scrollbar{
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`