import { useRef, useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { ChatMessage as ChatMessageType } from '@/services/gemini'
import { Gamepad2, Palette, Sparkles } from 'lucide-react'

interface ChatWindowProps {
    messages: ChatMessageType[]
    isLoading: boolean
    onSend: (message: string) => void
    onStop?: () => void
    onNewChat: () => void
    userAvatar?: string
}

const suggestions = [
    { icon: Palette, text: 'Ê Kubidu vẽ gì hay vậy?', color: 'from-pink-500 to-rose-400' },
    { icon: Gamepad2, text: 'Chơi game gì hay không?', color: 'from-purple-500 to-indigo-500' },
    { icon: Sparkles, text: 'Khoe cái gì đi Kubidu!', color: 'from-yellow-400 to-orange-400' },
]

export function ChatWindow({ messages, isLoading, onSend, onStop, onNewChat, userAvatar }: ChatWindowProps) {
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isLoading])

    return (
        <div className="flex h-screen flex-col">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-5 py-3">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 shrink-0 border-2 border-primary/30 wiggle-hover shadow-lg shadow-purple-500/20">
                        <AvatarImage src="/avatar.jpg" className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 via-pink-400 to-yellow-400 text-white text-xl">
                            🧒
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-base font-bold tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
                            Kubidu GPT
                        </h1>
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                            <p className="text-[11px] text-muted-foreground">Đang online nè~</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={onNewChat}
                    className="rounded-xl border-2 border-primary/20 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:bg-primary/10 hover:border-primary/40 hover:text-foreground hover:scale-105"
                >
                    ✨ Chat mới
                </button>
            </header>

            {/* Messages */}
            <ScrollArea className="flex-1">
                <div className="mx-auto max-w-3xl">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-4 pt-[12vh]">
                            {/* Big mascot */}
                            <div className="mb-6 h-32 w-32 overflow-hidden rounded-full border-4 border-primary/20 bounce-in shadow-2xl shadow-primary/20 bg-background">
                                <img src="/avatar.jpg" alt="Kubidu" className="h-full w-full object-cover" />
                            </div>

                            <h2 className="mb-1 text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
                                Yo! Tui là Kubidu
                            </h2>
                            <p className="mb-2 text-base font-medium text-foreground/80">
                                12 tuổi, pro gamer, hoạ sĩ tương lai 🎨🎮
                            </p>
                            <p className="mb-8 max-w-md text-center text-sm text-muted-foreground">
                                Hỏi gì thì hỏi, tui trả lời hết á~ nhưng mà tui giỏi hơn bạn đó nha 😏
                            </p>

                            {/* Suggestion cards */}
                            <div className="grid w-full max-w-md gap-2.5">
                                {suggestions.map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => onSend(item.text)}
                                        className="pop-in group flex items-center gap-3 rounded-2xl border-2 border-border bg-card px-4 py-3.5 text-left text-sm transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.02] active:scale-[0.98]"
                                        style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'backwards' }}
                                    >
                                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                            <item.icon className="h-4 w-4" />
                                        </div>
                                        <span className="text-foreground/80 group-hover:text-foreground transition-colors">
                                            {item.text}
                                        </span>
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
                                    userAvatar={userAvatar}
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
