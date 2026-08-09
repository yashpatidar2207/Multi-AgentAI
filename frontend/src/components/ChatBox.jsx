import React, { useEffect } from 'react'
import Nav from './Nav'
import ChatInput from './ChatInput'
import MessageList from './MessageList'
import getMessages from './../features/getMessages.js';
import { useSelector, useDispatch } from 'react-redux';
import { setMessages } from '../redux/messageSlice.js';

function ChatBox() {
  const { selectedConversation } = useSelector(
    (state) => state.conversation,
  );
  const dispatch = useDispatch()

  useEffect(() => {
    const getMsgs = async () => {
      if (selectedConversation) {
        const data = await getMessages(selectedConversation?._id)
        dispatch(setMessages(data))
      }
    }
    getMsgs()
  }, [selectedConversation])
  return (
    <div className='flex-1 flex flex-col'>
      <Nav />
      <MessageList />
      <ChatInput />
    </div>
  )
}

export default ChatBox