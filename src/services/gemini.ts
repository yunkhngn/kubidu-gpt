import { GoogleGenAI } from '@google/genai'
import personality from '@/components/personality.json'

export interface ChatMessage {
    role: 'user' | 'model'
    content: string
    timestamp: number
}

const HISTORY_SIZE = 4

function buildSystemInstruction(): string {
    const parts = [
        `Tên: ${personality.name}`,
        `Vai trò: ${personality.role}`,
        '',
        'Hướng dẫn:',
        ...personality.instructions.map((i: string) => `- ${i}`),
    ]
    return parts.join('\n')
}

export async function sendMessage(
    messages: ChatMessage[],
    newMessage: string
): Promise<string> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY

    if (!apiKey) {
        throw new Error('⚠️ Chưa cấu hình VITE_GEMINI_API_KEY trong file .env.local')
    }

    const ai = new GoogleGenAI({ apiKey })

    const recentMessages = messages.slice(-HISTORY_SIZE)

    const contents = [
        ...recentMessages.map((msg) => ({
            role: msg.role as 'user' | 'model',
            parts: [{ text: msg.content }],
        })),
        {
            role: 'user' as const,
            parts: [{ text: newMessage }],
        },
    ]

    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents,
        config: {
            systemInstruction: buildSystemInstruction(),
        },
    })

    return response.text || 'Xin lỗi, mình không thể trả lời lúc này. 😅'
}
