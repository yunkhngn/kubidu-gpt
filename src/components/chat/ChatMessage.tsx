import ReactMarkdown from 'react-markdown'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { User } from 'lucide-react'
import type { ChatMessage as ChatMessageType } from '@/services/gemini'

interface ChatMessageProps {
    message: ChatMessageType
    isLoading?: boolean
    userAvatar?: string
}

export function ChatMessage({ message, isLoading, userAvatar }: ChatMessageProps) {
    const isUser = message.role === 'user'

    return (
        <div
            className={cn(
                'flex gap-3 px-4 py-4 slide-up',
                isUser ? 'justify-end' : 'justify-start'
            )}
        >
            {!isUser && (
                <Avatar className="h-9 w-9 shrink-0 border-2 border-primary/30 wiggle-hover bounce-in">
                    <AvatarImage src="/avatar.jpg" alt="Kubidu" className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 via-pink-400 to-yellow-400 text-white text-lg">
                        🧒
                    </AvatarFallback>
                </Avatar>
            )}

            <div
                className={cn(
                    'max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm',
                    isUser
                        ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-br-sm'
                        : 'bg-card border border-border rounded-bl-sm'
                )}
            >
                {isUser ? (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                ) : (
                    <div className={cn('markdown-content', isLoading && 'typing-cursor')}>
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                )}
            </div>

            {isUser && (
                <Avatar className="h-9 w-9 shrink-0 border-2 border-accent/30 bounce-in">
                    {userAvatar && <AvatarImage src={userAvatar} className="object-cover" />}
                    <AvatarFallback className="bg-gradient-to-br from-teal-400 to-emerald-500 text-white">
                        <User className="h-4 w-4" />
                    </AvatarFallback>
                </Avatar>
            )}
        </div>
    )
}
