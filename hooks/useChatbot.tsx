import Toaster from "@/components/toaster"
import { useToast } from "@/components/ui/toast"
import { apiFetch } from "@/lib/api"
import { useState } from "react"

type Conversation = {
    user: "bot" | "me",
    message: string
}

export const useChatbot = () => {
    const [conversations, setConversations] = useState<Conversation[]>([])
    const toast = useToast()
    const [isLoading, setLoading] = useState(false)

    const chat = async (message: string) => {
        setConversations((state) => ([...state, { user: "me", message: message }]))
        try {
            setLoading(true)
            const res = await apiFetch<{ response: string, threadId?: string }>("/bot/chat", { method: "POST", data: { query: message } })
            setConversations((state) => ([...state, { user: "bot", message: res.data.response }]))
        } catch (error: any) {
            toast.show({ render: (props) => <Toaster  {...props} action="error" title="Erroro" description={error?.message} uniqueToastId={props.id} /> })
        } finally {
            setLoading(false)
        }
    }

    const clearConversation = () => {
        setConversations([])
    }
    return {
        isLoading,
        conversations,
        chat,
        clearConversation,
    }

}
