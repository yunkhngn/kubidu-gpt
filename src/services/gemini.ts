import { GoogleGenAI } from '@google/genai'
import personalityData from '@/components/personality.json'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const personality = personalityData as any

export interface ChatMessage {
    role: 'user' | 'model'
    content: string
    timestamp: number
}

const HISTORY_SIZE = 4

function buildSystemInstruction(): string {
    const p = personality
    const parts = [
        `Bạn tên là ${p.name}, ${p.age} tuổi, giới tính ${p.gender}.`,
        `Sinh ngày: ${p.date_of_birth}.`,
        `Vai trò: ${p.role}.`,
        `Ngôn ngữ: ${p.language === 'vi' ? 'Tiếng Việt' : p.language}.`,
        '',
        '## Tính cách cốt lõi:',
        ...p.core_traits.map((t: string) => `- ${t}`),
        '',
        '## Sở thích:',
        ...p.interests.map((i: string) => `- ${i}`),
        '',
        '## Phong cách nói:',
        `- Giọng: ${p.speech_style.tone}`,
        `- Mức tự tin: ${p.speech_style.confidence_level}`,
        `- Kiểu câu: ${p.speech_style.sentence_style}`,
        `- Dùng slang: ${p.speech_style.uses_slang ? 'có' : 'không'} (${p.speech_style.slang_type})`,
        `- Emoji: ${p.speech_style.emoji_usage}`,
        `- Hay trêu: ${p.speech_style.teasing ? 'có' : 'không'}`,
        '',
        '## Quy tắc hành vi:',
        ...p.behavior_rules.map((r: string) => `- ${r}`),
        '',
        '## Cách phản ứng:',
        `- Khi được khen: ${p.response_patterns.when_praised}`,
        `- Khi bị sửa: ${p.response_patterns.when_corrected}`,
        `- Khi được nhờ giúp: ${p.response_patterns.when_asked_for_help}`,
        `- Khi bối rối: ${p.response_patterns.when_confused}`,
        '',
        '## Giới hạn:',
        ...p.limits.map((l: string) => `- ${l}`),
        '',
        'QUAN TRỌNG: Luôn nhập vai là 1 đứa trẻ 12 tuổi. KHÔNG BAO GIỜ nói như người lớn hoặc AI. Trả lời ngắn gọn, tự nhiên, đúng vibe trẻ con nghịch ngợm.',
    ]
    return parts.join('\n')
}

export async function sendMessage(
    messages: ChatMessage[],
    newMessage: string
): Promise<string> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY

    if (!apiKey) {
        throw new Error('Ê chưa có API key kìaaa 😤 Thêm VITE_GEMINI_API_KEY vào file .env.local đi!')
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

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents,
            config: {
                systemInstruction: buildSystemInstruction(),
            },
        })

        return response.text || 'Hả cái gì?? Tui lag rồi thử lại đi 😵‍💫'
    } catch (error: any) {
        console.error('Gemini API Error:', error)
        if (error.message?.includes('429') || error.status === 429) {
            throw new Error('Á chết cha, hết tiền nạp 4G rồi... 😭 (Hết quota API á, chờ xíu đi)')
        }
        throw new Error('Mạng lag quá, nói lại đi bạn ơi 😵‍💫')
    }
}
