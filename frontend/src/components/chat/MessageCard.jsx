import React, { useState } from 'react'
import { toast } from 'sonner'
import { deleteMessage, updateMessage } from '../../api/chat'
import { Pencil, Trash2 } from 'lucide-react'
import BusinessAvatar from '../business/BusinessAvatar'
import ConfirmDialog from '../ui/ConfirmDialog'

const media_url = import.meta.env.VITE_MEDIA_URL

export default function MessageCard({ message, conversationId, onDelete, onUpdate }) {
    const currentUserId = JSON.parse(localStorage.getItem('user'))?.id
    const { sender, content, image, created_at, is_read } = message
    const isOwn = sender?.id === currentUserId

    const [editing, setEditing] = useState(false)
    const [editContent, setEditContent] = useState(content)
    const [loading, setLoading] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const time = new Date(created_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    })

    const handleUpdate = async () => {
        if (!editContent.trim()) return
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('content', editContent)
            const updated = await updateMessage(conversationId, message.id, formData, true)
            onUpdate?.(updated)
            setEditing(false)
        } catch (err) {
            console.error('Update failed:', err)
            toast.error(err?.message || 'Could not update message.')
        } finally {
            setLoading(false)
        }
    }

    const runDelete = async () => {
        setDeleteLoading(true)
        try {
            await deleteMessage(conversationId, message.id)
            onDelete?.(message.id)
            toast.success('Message deleted.')
            setDeleteOpen(false)
        } catch (err) {
            console.error('Delete failed:', err)
            toast.error(err?.message || 'Could not delete message.')
        } finally {
            setDeleteLoading(false)
        }
    }

    const senderImageUrl =
        sender?.profile?.profile_image ? `${media_url}${sender.profile.profile_image}` : null
    const senderDisplayName =
        [sender?.first_name, sender?.last_name].filter(Boolean).join(' ') || sender?.username || 'User'

    return (
        <>
        <ConfirmDialog
            open={deleteOpen}
            onClose={() => !deleteLoading && setDeleteOpen(false)}
            title="Delete message?"
            description="This message will be removed for everyone in the chat."
            confirmText="Delete"
            danger
            loading={deleteLoading}
            onConfirm={runDelete}
        />
        <div
            className={`group flex max-w-[min(100%,20rem)] ${isOwn ? 'self-end flex-col items-end' : 'self-start flex-row items-end gap-2'}`}
        >
            {!isOwn && (
                <BusinessAvatar
                    name={senderDisplayName}
                    imageUrl={senderImageUrl}
                    size="sm"
                />
            )}

            <div className={`flex flex-col min-w-0 ${isOwn ? 'items-end' : 'items-start'}`}>
                {!isOwn && (
                    <span className='text-xs text-gray-400 mb-1 ml-1'>{sender?.username}</span>
                )}

                <div className='flex items-end gap-1'>
                    {/* Edit/Delete actions — own messages only */}
                    {isOwn && (
                        <div className='flex gap-1 mb-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                            <button
                                onClick={() => setEditing(true)}
                                className='text-gray-400 hover:text-blue-500 transition-colors'
                            >
                                <Pencil size={13} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setDeleteOpen(true)}
                                className='text-gray-400 hover:text-red-500 transition-colors'
                            >
                                <Trash2 size={13} />
                            </button>
                        </div>
                    )}

                    <div className={`px-4 py-2 rounded-2xl text-sm
                    ${isOwn
                        ? 'bg-blue-500 text-white rounded-br-sm'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                    }`}
                >
                    {image && (
                        <img
                            src={`${media_url}${image}`}
                            alt='attachment'
                            className='rounded-lg mb-2 max-w-full'
                        />
                    )}

                    {editing ? (
                        <div className='flex flex-col gap-1'>
                            <textarea
                                className='text-sm text-gray-800 bg-white rounded-lg px-2 py-1 resize-none focus:outline-none focus:ring-1 focus:ring-blue-300 min-w-[160px]'
                                rows={2}
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleUpdate() }
                                    if (e.key === 'Escape') setEditing(false)
                                }}
                                autoFocus
                            />
                            <div className='flex gap-2 justify-end text-xs'>
                                <button onClick={() => setEditing(false)} className='text-gray-300 hover:text-white'>Cancel</button>
                                <button onClick={handleUpdate} disabled={loading} className='text-white font-medium disabled:opacity-50'>
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p>{content}</p>
                    )}
                </div>
                </div>

                <div className={`flex items-center gap-1 mt-1 px-1 ${isOwn ? '' : 'pl-1'}`}>
                    <span className='text-xs text-gray-400'>{time}</span>
                    {isOwn && (
                        <span className='text-xs text-gray-400'>{is_read ? '✓✓' : '✓'}</span>
                    )}
                </div>
            </div>
        </div>
        </>
    )
}