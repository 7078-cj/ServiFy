import React, { useState, useRef } from 'react'
import { createMessage } from '../../api/chat'

export default function AddMessage({ conversationId}) {
    const [content, setContent] = useState('')
    const [sending, setSending] = useState(false)
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)
    const fileInputRef = useRef(null)

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setImage(file)
        setPreview(URL.createObjectURL(file))
    }

    const clearImage = () => {
        setImage(null)
        setPreview(null)
        fileInputRef.current.value = ''
    }

    const handleSend = async () => {
        if (!content.trim() && !image) return
        setSending(true)
        try {
            let newMsg

            if (image) {
                const formData = new FormData()
                formData.append('content', content)
                formData.append('image', image)
                newMsg = await createMessage(conversationId, formData, true)
            } else {
                newMsg = await createMessage(conversationId, { content })
            }
            setContent('')
            clearImage()
        } catch (err) {
            console.error("Error sending message:", err)
        } finally {
            setSending(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className='bg-white border-t border-gray-200'>

            {preview && (
                <div className='px-4 pt-3'>
                    <div className='relative inline-block'>
                        <img
                            src={preview}
                            alt='preview'
                            className='h-20 w-20 object-cover rounded-lg border border-gray-200'
                        />
                        <button
                            onClick={clearImage}
                            className='absolute -top-2 -right-2 bg-gray-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-gray-900'
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            <div className='px-4 py-3 flex items-end gap-3'>
                <input
                    type='file'
                    accept='image/*'
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className='hidden'
                />

                <button
                    onClick={() => fileInputRef.current.click()}
                    className='text-gray-400 hover:text-blue-500 transition-colors pb-2 flex-shrink-0'
                    title='Attach image'
                >
                    <svg xmlns='http://www.w3.org/2000/svg' className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                    </svg>
                </button>

                <textarea
                    className='flex-1 resize-none rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 max-h-32'
                    rows={1}
                    placeholder='Type a message...'
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <button
                    onClick={handleSend}
                    disabled={sending || (!content.trim() && !image)}
                    className='bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors flex-shrink-0'
                >
                    {sending ? '...' : 'Send'}
                </button>
            </div>
        </div>
    )
}