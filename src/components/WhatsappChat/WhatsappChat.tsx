import Bot from '../../assets/icons/bot.svg'
import GoBack from '../../assets/icons/arrow-left.svg'
import Options from '../../assets/icons/options.svg'
import DoubleCheck from '../../assets/icons/double-check.svg'
import Smiley from '../../assets/icons/smile.svg'
import Send from '../../assets/icons/send.svg'
import { useHistory } from 'react-router-dom'
import { KeyboardEvent, KeyboardEventHandler, useEffect, useRef, useState } from 'react'
import { dataObj } from '../../types'
import { sendNewMessage, updateMessageSession } from '../../services/app'
import { toast } from 'react-toastify'

type Props = {
    onClose?: () => void
    content?: string
}

export default function WhatsappChat({ onClose, content }: Props) {
    const [allMessages, setAllMessages] = useState<dataObj[]>([])
    const [messagesRead, setMessagesRead] = useState(false)
    const [text, setText] = useState(content || '')
    const history = useHistory()
    const chatRef = useRef<HTMLDivElement>(null)

    const sendMessage = async () => {
        if (!text) return

        const newMessage = {
            role: 'user',
            content: text,
            response: false,
            date: new Date()
        }

        const updatedMessages = allMessages.concat(newMessage)

        setAllMessages(updatedMessages)
        setTimeout(() => setMessagesRead(true), 2000)

        setText('')

        if (chatRef.current) chatRef.current.scrollTo({ behavior: 'smooth', top: chatRef.current.scrollHeight })

        const response = await sendNewMessage({ messages: updatedMessages })

        if (response.error) {
            console.log(response.error)
            const { message } = response.error.error
            return toast.error(message)
        }
        else if (response.message?.content) {
            const newMessage = {
                role: 'assistant',
                content: response.message.content,
                response: true,
                date: new Date()
            }
            setAllMessages(prev => prev.concat(newMessage))
            if (chatRef.current) chatRef.current.scrollTo({ behavior: 'smooth', top: chatRef.current.scrollHeight })
        }
    }

    const handleEnter = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
        if (e.code === 'Enter') {
            e.preventDefault()
            sendMessage()
        }
    }

    return (
        <div className="whatsapp__container">
            <div className="whatsapp__box">
                <div className="whatsapp__header">
                    <div className="whatsapp__header-info">
                        <img src={GoBack} onClick={onClose} alt="Go Back" className="whatsapp__header-goback" />
                        <img src={Bot} alt="Profile" className="whatsapp__header-img" />
                        <div className="whatsapp__header-text">
                            <p className="whatsapp__header-name" onClick={() => history.push('/sobre-mi')}>Bobby Bot</p>
                            <p className="whatsapp__header-status">online</p>
                        </div>
                    </div>
                    <img src={Options} alt="Options" className="whatsapp__header-options" />
                </div>

                <div className="whatsapp__chat" ref={chatRef}>
                    {allMessages.length ? '' :
                        <p className='whatsapp__chat-banner'>Write anything to Bobby</p>
                    }
                    {allMessages.map((msg, i) =>
                        <div
                            className="whatsapp__chat-message"
                            key={i}
                            style={{
                                backgroundColor: msg.response ? 'white' : '',
                                borderTopRightRadius: msg.response ? '.5rem' : 0,
                                borderTopLeftRadius: msg.response ? 0 : '.5rem',
                                alignSelf: msg.response ? 'flex-start' : ''
                            }}>
                            <p className="whatsapp__chat-message-text">{msg.content}</p>
                            <div className="whatsapp__chat-message-status">
                                <p className="whatsapp__chat-message-time">{new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                {msg.response ? '' :
                                    <img
                                        src={DoubleCheck}
                                        alt="Sent"
                                        className="whatsapp__chat-message-check"
                                        style={{
                                            filter: messagesRead ? 'invert(50%) sepia(63%) saturate(5099%) hue-rotate(172deg) brightness(99%) contrast(101%)' : ''
                                        }}
                                    />}
                            </div>
                        </div>
                    )}
                </div>

                <div className="whatsapp__footer">
                    <div className="whatsapp__input">
                        <img src={Smiley} alt="" className="whatsapp__input-emojis" />
                        <textarea className="whatsapp__input-box" onKeyDown={handleEnter} value={text} onChange={e => setText(e.target.value)} />
                    </div>
                    <div className="whatsapp__send-container" onClick={sendMessage}>
                        <img src={Send} alt="Send" className="whatsapp__send-svg" />
                    </div>
                </div>
            </div>
        </div>
    )
}