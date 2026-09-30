import React, { useState } from 'react';
import API from '../services/api.js';
import { useToast } from '../context/ToastContext.js';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await API.post('/contact', { name, email, subject, message });
      showToast('Message Sent', res.data.message, 'success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      showToast('Error', 'Failed to send inquiry.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
          We Are Here To Help
        </span>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">
          Contact Customer Support
        </h1>
        <p className="text-xs text-slate-500">
          Have questions regarding order shipping, bulk enterprise orders, or warranty extensions? Reach out to our 24/7 team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6 bg-slate-900 text-white p-8 rounded-3xl">
          <h3 className="font-extrabold text-lg">Contact Information</h3>
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-indigo-400" />
              <span>+1 (555) 019-2834</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-indigo-400" />
              <span>support@apexmart.com</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-indigo-400" />
              <span>100 Apex Plaza, Silicon Valley, CA 94025</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="lg:col-span-2 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border dark:bg-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Subject</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Message</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border dark:bg-slate-800"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" /> Send Message
          </button>
        </form>
      </div>
    </div>
  );
};
