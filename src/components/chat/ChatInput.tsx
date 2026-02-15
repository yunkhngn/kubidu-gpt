import { useState, useRef, type KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Send, Square } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
    onSend: (message: string) => void
    isLoading: boolean
    onStop?: () => void
}

export function ChatInput({ onSend, isLoading, onStop }: ChatInputProps) {
    const [input, setInput] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleSend = () => {
        const trimmed = input.trim()
        if (!trimmed || isLoading) return
        onSend(trimmed)
        setInput('')
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
        }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value)
        const el = e.target
        el.style.height = 'auto'
        el.style.height = Math.min(el.scrollHeight, 200) + 'px'
    }

    return (
        <div className="border-t border-border bg-background/80 backdrop-blur-xl p-4">
            <div className="mx-auto max-w-3xl">
                <div className="relative flex items-end gap-2 rounded-2xl border-2 border-primary/20 bg-card px-4 py-3 transition-all focus-within:border-primary/50 focus-within:shadow-lg focus-within:shadow-primary/10">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        placeholder="Nói gì đi... 👀"
                        rows={1}
                        className={cn(
                            'flex-1 resize-none bg-transparent text-sm leading-relaxed',
                            'placeholder:text-muted-foreground/60',
                            'focus:outline-none',
                            'max-h-[200px] min-h-[24px]'
                        )}
                        disabled={isLoading}
                    />
                    {isLoading ? (
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 shrink-0 rounded-xl hover:bg-destructive/20 hover:text-destructive"
                            onClick={onStop}
                        >
                            <Square className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            size="icon"
                            className={cn(
                                'h-9 w-9 shrink-0 rounded-xl transition-all',
                                input.trim()
                                    ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105'
                                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                            )}
                            onClick={handleSend}
                            disabled={!input.trim()}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                <p className="mt-2 text-center text-[11px] text-muted-foreground/50">
                    Kubidu đôi khi hơi bịa~ đừng tin hết nha 😜
                </p>
            </div>
        </div>
    )
}
