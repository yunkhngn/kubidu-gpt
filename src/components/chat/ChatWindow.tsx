import { useRef, useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import type { ChatMessage as ChatMessageType } from '@/services/gemini'
import { Bot, Sparkles, MessageSquare, Zap } from 'lucide-react'

interface ChatWindowProps {
    messages: ChatMessageType[]
    isLoading: boolean
    onSend: (message: string) => void
    onStop?: () => void
    onNewChat: () => void
}

const suggestions = [
    { icon: Sparkles, text: 'Giải thích React hooks cho người mới' },
    { icon: MessageSquare, text: 'Viết một bài thơ về Sài Gòn' },
    { icon: Zap, text: 'Cách tối ưu hiệu năng website' },
]

export function ChatWindow({ messages, isLoading, onSend, onStop, onNewChat }: ChatWindowProps) {
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isLoading])

    return (
        <div className="flex h-screen flex-col">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-6 py-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-600/20">
                        <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm font-semibold tracking-tight">Kubidu GPT</h1>
                        <p className="text-[11px] text-muted-foreground">Powered by Gemini</p>
                    </div>
                </div>
                <button
                    onClick={onNewChat}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                    + Chat mới
                </button>
            </header>

            {/* Messages */}
            <ScrollArea className="flex-1">
                <div className="mx-auto max-w-3xl">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-4 pt-[15vh]">
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-2xl shadow-violet-600/30">
                                <Bot className="h-8 w-8 text-white" />
                            </div>
                            <h2 className="mb-2 text-2xl font-bold tracking-tight">
                                Xin chào! 👋
                            </h2>
                            <p className="mb-8 max-w-md text-center text-sm text-muted-foreground">
                                Mình là <span className="font-medium text-foreground">Kubidu GPT</span>, trợ lý AI thông minh.
                                Hãy hỏi mình bất cứ điều gì nhé!
                            </p>

                            {/* Suggestion cards */}
                            <div className="grid w-full max-w-lg gap-2">
                                {suggestions.map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => onSend(item.text)}
                                        className="group flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-left text-sm text-muted-foreground transition-all hover:border-muted-foreground/30 hover:bg-muted/60 hover:text-foreground"
                                    >
                                        <item.icon className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-violet-400" />
                                        {item.text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="pb-4">
                            {messages.map((msg, i) => (
                                <ChatMessage
                                    key={i}
                                    message={msg}
                                    isLoading={isLoading && i === messages.length - 1 && msg.role === 'model'}
                                />
                            ))}
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>
            </ScrollArea>

            {/* Input */}
            <ChatInput onSend={onSend} isLoading={isLoading} onStop={onStop} />
        </div>
    )
}
