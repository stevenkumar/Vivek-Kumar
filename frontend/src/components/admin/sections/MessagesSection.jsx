import React, { useState } from 'react'
import {
  Mail,
  MailOpen,
  Trash2,
  Clock,
  User,
  Phone,
  MessageSquare,
  CheckCircle2,
  RefreshCw,
  Loader2,
  Eye,
} from 'lucide-react'
import AdminCard from '../ui/AdminCard'
import AdminModal from '../ui/AdminModal'
import ConfirmDialog from '../ui/ConfirmDialog'

export const MessagesSection = ({ messages = [], loading = false, onReload, onToast }) => {
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const handleToggleRead = async (msg, e) => {
    e?.stopPropagation()
    try {
      const nextState = !msg.isRead
      const res = await fetch(`/api/contact/admin/messages/${msg.id || msg._id}/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: nextState }),
      })
      if (res.ok) {
        if (onReload) onReload()
        onToast(nextState ? 'Marked as read' : 'Marked as unread', 'info')
      }
    } catch {
      onToast('Failed to update message status', 'error')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setActionLoading(true)
    try {
      const res = await fetch(`/api/contact/admin/messages/${deleteTarget.id || deleteTarget._id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete message')
      onToast('Message deleted', 'success')
      setDeleteTarget(null)
      if (selectedMessage && (selectedMessage.id === deleteTarget.id || selectedMessage._id === deleteTarget._id)) {
        setSelectedMessage(null)
      }
      if (onReload) onReload()
    } catch (err) {
      onToast(err.message, 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleOpenMessage = (msg) => {
    setSelectedMessage(msg)
    if (!msg.isRead) {
      handleToggleRead(msg)
    }
  }

  const unreadCount = messages.filter((m) => !m.isRead).length

  return (
    <div className="space-y-8">
      <AdminCard
        title="Contact Messages Inbox"
        subtitle={`Inquiries submitted through your portfolio contact form (${messages.length} total, ${unreadCount} unread)`}
        icon={Mail}
        action={
          <button
            type="button"
            onClick={onReload}
            className="p-2.5 rounded-xl bg-theme-canvas hover:bg-zinc-800 text-theme-muted hover:text-white transition border border-theme cursor-pointer"
            title="Reload inbox"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin text-theme-primary' : ''} />
          </button>
        }
      >
        {loading ? (
          <div className="text-center py-16 text-theme-muted flex items-center justify-center gap-2">
            <Loader2 size={18} className="animate-spin text-theme-primary" />
            <span>Loading inbox...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16 bg-theme-canvas rounded-2xl border border-theme p-8 space-y-3">
            <MailOpen size={40} className="mx-auto text-zinc-600" />
            <h4 className="font-bold text-theme-base text-base">Inbox is Empty</h4>
            <p className="text-xs text-theme-muted max-w-sm mx-auto">
              Any new messages sent via the contact form will appear here and be delivered to your email.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id || msg._id}
                onClick={() => handleOpenMessage(msg)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                  msg.isRead
                    ? 'bg-theme-canvas/60 border-theme hover:border-theme-primary'
                    : 'bg-theme-canvas border-theme-primary ring-1 ring-cyan-500/30'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`p-2.5 rounded-xl border shrink-0 ${
                      msg.isRead
                        ? 'bg-theme-card border-theme text-theme-muted'
                        : 'bg-theme-primary/10 border-theme-primary text-theme-primary'
                    }`}
                  >
                    {msg.isRead ? <MailOpen size={18} /> : <Mail size={18} />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      {!msg.isRead && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                          NEW
                        </span>
                      )}
                      <h4 className="font-bold text-theme-base text-sm sm:text-base">{msg.name}</h4>
                      <span className="text-xs text-theme-muted font-mono truncate">&lt;{msg.email}&gt;</span>
                    </div>

                    <p className="text-xs text-theme-muted line-clamp-1 leading-relaxed">{msg.message}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="text-[11px] font-mono text-theme-muted flex items-center gap-1">
                    <Clock size={11} />
                    <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </span>

                  <button
                    onClick={(e) => handleToggleRead(msg, e)}
                    className="p-2 rounded-xl bg-theme-card hover:bg-zinc-800 text-theme-muted hover:text-white transition border border-theme cursor-pointer"
                    title={msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
                  >
                    {msg.isRead ? <Mail size={14} /> : <CheckCircle2 size={14} className="text-emerald-400" />}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteTarget(msg)
                    }}
                    className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/20 transition cursor-pointer"
                    title="Delete message"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      {/* Message Viewer Modal */}
      <AdminModal
        isOpen={Boolean(selectedMessage)}
        onClose={() => setSelectedMessage(null)}
        title="Message Details"
        subtitle={`Received from ${selectedMessage?.name || 'Visitor'}`}
        icon={Mail}
      >
        {selectedMessage && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-theme-canvas border border-theme text-xs">
              <div>
                <span className="text-theme-muted uppercase font-mono text-[10px] block mb-0.5">Sender Name</span>
                <span className="font-bold text-theme-base text-sm">{selectedMessage.name}</span>
              </div>
              <div>
                <span className="text-theme-muted uppercase font-mono text-[10px] block mb-0.5">Email Address</span>
                <a href={`mailto:${selectedMessage.email}`} className="font-bold text-theme-primary hover:underline">
                  {selectedMessage.email}
                </a>
              </div>
              <div>
                <span className="text-theme-muted uppercase font-mono text-[10px] block mb-0.5">Phone Number</span>
                <span className="font-mono text-theme-base">{selectedMessage.number || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-theme-muted uppercase font-mono text-[10px] block mb-0.5">Submission Timestamp</span>
                <span className="font-mono text-theme-base">{new Date(selectedMessage.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-theme-muted block mb-2">Message Body</span>
              <div className="p-4 rounded-xl bg-theme-canvas border border-theme text-sm text-theme-base leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-theme">
              <button
                type="button"
                onClick={() => setDeleteTarget(selectedMessage)}
                className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-bold transition cursor-pointer"
              >
                <Trash2 size={14} /> Delete Message
              </button>

              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: Portfolio Inquiry`}
                  className="inline-flex items-center gap-2 gradient-primary text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg transition cursor-pointer"
                >
                  <Mail size={14} /> Reply via Email
                </a>
              </div>
            </div>
          </div>
        )}
      </AdminModal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Message?"
        message={`Are you sure you want to delete the message from "${deleteTarget?.name}"?`}
        confirmText="Delete"
        loading={actionLoading}
      />
    </div>
  )
}

export default MessagesSection
