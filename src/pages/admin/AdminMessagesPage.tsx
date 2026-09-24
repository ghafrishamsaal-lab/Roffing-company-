import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { ContactMessage } from '../../types';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Search,
  Mail,
  Phone,
  Calendar,
  Trash2,
  CheckCircle,
  Eye,
  X,
  MessageSquare,
  Reply,
} from 'lucide-react';

export const AdminMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Selected message for modal
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);
  const [msgToDelete, setMsgToDelete] = useState<ContactMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, 'messages'));
      const list: ContactMessage[] = [];
      snap.forEach((d) => {
        list.push({ ...(d.data() as ContactMessage), id: d.id });
      });
      list.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setMessages(list);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const updateMessageStatus = async (msgId: string, status: 'unread' | 'read' | 'replied') => {
    try {
      await updateDoc(doc(db, 'messages', msgId), { status });
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, status } : m))
      );
      if (selectedMsg?.id === msgId) {
        setSelectedMsg((prev) => (prev ? { ...prev, status } : null));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleOpenMessage = async (msg: ContactMessage) => {
    setSelectedMsg(msg);
    if (msg.status === 'unread' && msg.id) {
      await updateMessageStatus(msg.id, 'read');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!msgToDelete?.id) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'messages', msgToDelete.id));
      setMessages((prev) => prev.filter((m) => m.id !== msgToDelete.id));
      setMsgToDelete(null);
      if (selectedMsg?.id === msgToDelete.id) {
        setSelectedMsg(null);
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white">Contact Submissions</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Review inbound inquiries, customer requests, and website contact forms.
          </p>
        </div>
        <button
          onClick={fetchMessages}
          className="self-start sm:self-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition-colors border border-slate-700"
        >
          Refresh Inbox
        </button>
      </div>

      {/* Search */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search messages by name, email, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#ea580c]"
          />
        </div>
      </div>

      {/* Messages list */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8">
            <LoadingSkeleton rows={5} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={<MessageSquare className="w-8 h-8" />}
              title="No Inbound Messages"
              description="Your contact form inbox is clear. Messages submitted from the /contact page will appear here."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-4 px-6">Sender</th>
                  <th className="py-4 px-6">Subject</th>
                  <th className="py-4 px-6">Received</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium text-slate-300">
                {filtered.map((m) => (
                  <tr
                    key={m.id}
                    className={`hover:bg-slate-900/50 transition-colors ${
                      m.status === 'unread' ? 'bg-slate-900/30 font-semibold' : ''
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="font-bold text-white">{m.name}</div>
                      <div className="text-[11px] text-slate-400">{m.email} {m.phone ? `• ${m.phone}` : ''}</div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-white text-xs">{m.subject}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1 max-w-md mt-0.5">
                        {m.message}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      {new Date(m.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          m.status === 'unread'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : m.status === 'replied'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenMessage(m)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors"
                        title="Read Message"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setMsgToDelete(m)}
                        className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:text-red-200 hover:bg-red-900/60 transition-colors"
                        title="Delete Message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message View Modal */}
      {selectedMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-slate-200">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#ea580c]">
                  Inbound Message
                </span>
                <h3 className="text-lg font-black text-white">{selectedMsg.subject}</h3>
              </div>
              <button
                onClick={() => setSelectedMsg(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-white text-sm">{selectedMsg.name}</p>
                    <p className="text-slate-400">{selectedMsg.email}</p>
                    {selectedMsg.phone && <p className="text-slate-400">{selectedMsg.phone}</p>}
                  </div>
                  <span className="text-slate-500 text-[11px]">
                    {new Date(selectedMsg.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1.5 uppercase text-[10px]">
                  Message Body
                </label>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed text-sm whitespace-pre-wrap">
                  {selectedMsg.message}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Mark Message As:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => selectedMsg.id && updateMessageStatus(selectedMsg.id, 'replied')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      selectedMsg.status === 'replied'
                        ? 'bg-emerald-800 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Replied
                  </button>
                  <button
                    onClick={() => selectedMsg.id && updateMessageStatus(selectedMsg.id, 'unread')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      selectedMsg.status === 'unread'
                        ? 'bg-rose-900 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Unread
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <a
                href={`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(
                  selectedMsg.subject
                )}`}
                className="px-4 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Reply className="w-4 h-4" />
                <span>Compose Reply</span>
              </a>
              <button
                type="button"
                onClick={() => setSelectedMsg(null)}
                className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(msgToDelete)}
        title="Delete Contact Message?"
        message={`Are you sure you want to permanently delete this message from "${msgToDelete?.name}"?`}
        confirmLabel="Delete Message"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setMsgToDelete(null)}
      />
    </div>
  );
};
