import ReactMarkdown from 'react-markdown'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Bot, User } from 'lucide-react'
import type { ChatMessage as ChatMessageType } from '@/services/gemini'

interface ChatMessageProps {
    message: ChatMessageType
    isLoading?: boolean
}

export function ChatMessage({ message, isLoading }: ChatMessageProps) {
    const isUser = message.role === 'user'

    return (
        <div
            className={cn(
                'flex gap-3 px-4 py-6 transition-colors',
                isUser ? 'justify-end' : 'justify-start'
            )}
        >
            {!isUser && (
                <Avatar className="h-8 w-8 shrink-0 border border-border">
                    <AvatarFallback className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
                        <Bot className="h-4 w-4" />
                    </AvatarFallback>
                </Avatar>
            )}

            <div
                className={cn(
                    'max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                    isUser
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted text-foreground rounded-bl-md'
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
                <Avatar className="h-8 w-8 shrink-0 border border-border">
                    <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white">
                        <User className="h-4 w-4" />
                    </AvatarFallback>
                </Avatar>
            )}
        </div>
    )
}
