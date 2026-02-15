import { useState, useCallback } from 'react'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { sendMessage, type ChatMessage } from '@/services/gemini'

function App() {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const handleSend = useCallback(async (content: string) => {
        const userMessage: ChatMessage = {
            role: 'user',
            content,
            timestamp: Date.now(),
        }

        setMessages((prev) => [...prev, userMessage])
        setIsLoading(true)

        try {
            const reply = await sendMessage(messages, content)

            const aiMessage: ChatMessage = {
                role: 'model',
                content: reply,
                timestamp: Date.now(),
            }

            setMessages((prev) => [...prev, aiMessage])
        } catch (error) {
            const errorMessage: ChatMessage = {
                role: 'model',
                content:
                    error instanceof Error
                        ? error.message
                        : 'Đã xảy ra lỗi. Vui lòng thử lại sau. 😅',
                timestamp: Date.now(),
            }
            setMessages((prev) => [...prev, errorMessage])
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
        />
    )
}

export default App
