import { useState, useCallback, useEffect } from 'react'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { sendMessage, type ChatMessage } from '@/services/gemini'

function App() {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [userAvatar, setUserAvatar] = useState<string | undefined>()

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const res = await fetch('https://cataas.com/cat')
                if (!res.ok) throw new Error('Failed to fetch avatar')
                const blob = await res.blob()
                setUserAvatar(URL.createObjectURL(blob))
            } catch (e) {
                console.error('Avatar fetch error:', e)
            }
        }
        fetchAvatar()
    }, [])

    const handleSend = useCallback(async (content: string) => {
        const userMessage: ChatMessage = {
            role: 'user',
            content,
            timestamp: Date.now(),
        }

        // Add user message AND optimistic loading message
        const loadingMessage: ChatMessage = {
            role: 'model',
            content: '',
            timestamp: Date.now(),
        }

        setMessages((prev) => [...prev, userMessage, loadingMessage])
        setIsLoading(true)

        try {
            const reply = await sendMessage(messages, content)

            // Update the loading message with actual response
            setMessages((prev) => {
                const newMessages = [...prev]
                // The last message should be our loading message
                const lastIndex = newMessages.length - 1
                if (newMessages[lastIndex].role === 'model') {
                    newMessages[lastIndex] = {
                        ...newMessages[lastIndex],
                        content: reply,
                    }
                } else {
                    // Fallback just in case sync issues
                    return [...prev, {
                        role: 'model',
                        content: reply,
                        timestamp: Date.now(),
                    }]
                }
                return newMessages
            })
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Đã xảy ra lỗi. Vui lòng thử lại sau. 😅'

            // Show error in the loading bubble
            setMessages((prev) => {
                const newMessages = [...prev]
                const lastIndex = newMessages.length - 1
                if (newMessages[lastIndex].role === 'model') {
                    newMessages[lastIndex] = {
                        ...newMessages[lastIndex],
                        content: errorMessage,
                    }
                }
                return newMessages
            })
        } finally {
            setIsLoading(false)
        }
    }, [messages])

    const handleNewChat = useCallback(() => {
        setMessages([])
        setIsLoading(false)
    }, [])

    return (
        <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onSend={handleSend}
            onNewChat={handleNewChat}
            userAvatar={userAvatar}
        />
    )
}

export default App
