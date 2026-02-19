import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import KweekEarnLogo from '../components/KweekEarnLogo';
import HamburgerMenu from '../components/layout/HamburgerMenu';

const Contact = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: user?.username || '',
    email: user?.email || '',
    subject: '',
    message: '',
    priority: 'Medium'
  });
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [charCount, setCharCount] = useState(0);

  const subjects = [
    'Withdrawal Issue',
    'Task Problem',
    'Account Support',
    'Payment Question',
    'Report a Bug',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'message') {
      setCharCount(value.length);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        toast.error('Only JPG, JPEG, and PNG files are allowed');
        return;
      }
      setAttachment(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.message.length < 10) {
      toast.error('Message must be at least 10 characters');
      return;
    }

    if (formData.message.length > 1000) {
      toast.error('Message must not exceed 1000 characters');
      return;
    }

    setLoading(true);

    // Create FormData for file upload
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('email', formData.email);
    submitData.append('subject', formData.subject);
    submitData.append('message', formData.message);
    submitData.append('priority', formData.priority);
    if (attachment) {
      submitData.append('attachment', attachment);
    }

    try {
      const response = await API.post('/contact', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setTicketId(response.data.ticketId);
      setSubmitted(true);
      toast.success('Message sent successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        theme === 'dark' ? 'bg-military-dark' : 'bg-military-light'
      }`}>
        <div className={`max-w-md w-full p-8 rounded-2xl border text-center ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200'
        }`}>
          <div className="w-20 h-20 rounded-full bg-green-600/10 flex items-center justify-center mx-auto mb-4 border-2 border-green-600/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Message Sent</h2>
          <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Your ticket ID: <span className="font-mono font-bold text-military-brass">{ticketId}</span>
          </p>
          <p className={`mb-6 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            We'll respond within 24-48 hours. A confirmation has been sent to your email.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-military-olive hover:bg-military-olive/90 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-military-dark' : 'bg-military-light'}`}>
      <nav className={`sticky top-0 z-50 border-b backdrop-blur-sm ${
        theme === 'dark'
          ? 'bg-gray-900/95 border-gray-800'
          : 'bg-white/95 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <HamburgerMenu />
              <KweekEarnLogo variant="horizontal" size="sm" />
            </div>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {theme === 'dark' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Form - 2/3 width */}
          <div className="md:col-span-2">
            <div className={`p-8 rounded-2xl border ${
              theme === 'dark'
                ? 'bg-gray-900 border-gray-800'
                : 'bg-white border-gray-200'
            }`}>
              <h1 className="text-2xl font-bold mb-2">Contact Support</h1>
              <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Fill out the form below and we'll get back to you within 24-48 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm mb-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-military-olive ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-transparent'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-transparent'
                      }`}
                      required
                      minLength="2"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm mb-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-military-olive ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-transparent'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-transparent'
                      }`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-military-olive ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-transparent'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-transparent'
                    }`}
                    required
                  >
                    <option value="">Select a subject</option>
                    {subjects.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Priority
                  </label>
                  <div className="flex gap-4">
                    {['Low', 'Medium', 'High'].map(p => (
                      <label key={p} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="priority"
                          value={p}
                          checked={formData.priority === p}
                          onChange={handleChange}
                          className="text-military-olive focus:ring-military-olive"
                        />
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {p}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`block text-sm mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-military-olive ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-transparent'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-transparent'
                    }`}
                    required
                    minLength="10"
                    maxLength="1000"
                  />
                  <div className={`flex justify-end mt-1 text-xs ${
                    charCount > 900 ? 'text-military-crimson' : theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {charCount}/1000 characters
                  </div>
                </div>

                <div>
                  <label className={`block text-sm mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Attachment (Optional)
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-4 ${
                    theme === 'dark'
                      ? 'border-gray-700 bg-gray-800/50'
                      : 'border-gray-300 bg-gray-50'
                  }`}>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleFileChange}
                      className="w-full text-sm"
                    />
                    <p className={`text-xs mt-2 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      Max 2MB. Allowed: JPG, JPEG, PNG
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-military-olive hover:bg-military-olive/90 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 mt-4"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information - 1/3 width */}
          <div className="md:col-span-1">
            <div className={`p-6 rounded-xl border ${
              theme === 'dark'
                ? 'bg-gray-900 border-gray-800'
                : 'bg-white border-gray-200'
            }`}>
              <h3 className="font-semibold mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                <div>
                  <p className={`text-xs uppercase tracking-wider mb-2 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    Email
                  </p>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-military-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      support@kweekearn.ng
                    </span>
                  </div>
                </div>

                <div>
                  <p className={`text-xs uppercase tracking-wider mb-2 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    Response Time
                  </p>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-military-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      24-48 hours
                    </span>
                  </div>
                </div>

                <div>
                  <p className={`text-xs uppercase tracking-wider mb-2 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    Phone (Coming Soon)
                  </p>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-military-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                      +234 800 000 0000
                    </span>
                  </div>
                </div>

                <div className={`pt-4 mt-4 border-t ${
                  theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                }`}>
                  <p className={`text-xs mb-2 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    Support Hours
                  </p>
                  <p className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Monday – Friday
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    9:00 AM – 5:00 PM WAT
                  </p>
                </div>

                <div className={`pt-4 mt-4 border-t ${
                  theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                }`}>
                  <p className={`text-xs mb-2 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    Quick Links
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate('/faq')}
                      className="text-sm text-military-olive hover:underline block"
                    >
                      Frequently Asked Questions
                    </button>
                    <button
                      onClick={() => navigate('/terms')}
                      className="text-sm text-military-olive hover:underline block"
                    >
                      Terms of Service
                    </button>
                    <button
                      onClick={() => navigate('/privacy')}
                      className="text-sm text-military-olive hover:underline block"
                    >
                      Privacy Policy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
