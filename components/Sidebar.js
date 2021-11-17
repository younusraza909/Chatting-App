import styled from "styled-components"
import { Avatar, Button, IconButton } from "@material-ui/core"
import ChatIcon from "@material-ui/icons/Chat"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import SearchIcon from "@material-ui/icons/Search"
import * as EmailValidator from "email-validator"
import Chat from "./Chat"

// Firebae
import { auth, db } from "../firebase"
import { signOut } from "firebase/auth"
import { collection, setDoc, doc, where, query } from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"
import { useCollection } from "react-firebase-hooks/firestore"

const Sidebar = () => {
    const [user] = useAuthState(auth);
    const userChatRef = query(collection(db, 'chats'), where("users", "array-contains", user.email))
    const [chatSnapShot] = useCollection(userChatRef)


    const createChat = () => {
        const input = prompt('Please enter an email address for the user you wish to chat with')

        if (!input) return;

        if (EmailValidator.validate(input) && input !== user.email && !chatAlreadyExist(input)) {
            // we need to add the chat into the db in "chats" collection
            setDoc(doc(collection(db, 'chats')), {
                users: [user.email, input]
            }, { merge: true })
        }
    }

    const chatAlreadyExist = (reciptentEmail) =>
        !!chatSnapShot?.docs.find((chat) =>
            chat.data().users.find((user) => user === reciptentEmail)?.length > 0
        )

    return (
        <Container>
            <Header>
                <UserAvatar onClick={() => signOut(auth)} src={user.photoURL} />

                <IconsContainer>
                    {/* Icon Button is use to make icon a clickable button with bubble effect */}
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </IconsContainer>
            </Header>
            <SearchContainer>
                <SearchIcon />
                <SearchInput placeholder='Search in Chats' />
            </SearchContainer>
            <SideBarButton onClick={createChat}>
                Start a new Chat
            </SideBarButton>

            {/* List of Chats Chats */}
            {chatSnapShot?.docs.map(chat => (
                <Chat key={chat.id} id={chat.id} users={chat.data().users} />
            ))}
        </Container>
    )
}

export default Sidebar

const Container = styled.div``


const Header = styled.div`
  display: flex;
  position: sticky;
  top:0;
  z-index:1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`

const UserAvatar = styled(Avatar)`
    cursor: pointer;

    :hover{
        opacity: 0.8;
    }
`

const IconsContainer = styled.div``

const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 2px;
`

const SearchInput = styled.input`
    outline-width: 0;
    border: none;
    flex:1;
`

const SideBarButton = styled(Button)`
    width: 100%;

    //in Material component material styles have more specificity so we have to use important to apply our styles
    //in styled component we do like this
    &&&{
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }
    
`