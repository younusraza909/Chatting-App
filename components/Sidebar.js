import styled from "styled-components"
import { Avatar, Button, IconButton } from "@material-ui/core"
import ChatIcon from "@material-ui/icons/Chat"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import SearchIcon from "@material-ui/icons/Search"
import * as EmailValidator from "email-validator"

const Sidebar = () => {
    const createChat = () => {
        const input = promp('Please enter an email address for the user you wish to chat with')

        if (!input) return;

        if (EmailValidator.validate(input)) {
            // we need to add the chat into the db in "chats" collection
        }

    }

    return (
        <Container>
            <Header>
                <UserAvatar />

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