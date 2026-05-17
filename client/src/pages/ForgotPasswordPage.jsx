import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GiBee as FaBee } from 'react-icons/gi';
import { MdEmail, MdArrowBack, MdCheckCircle } from 'react-icons/md';
import toast from 'react-hot-toast';
import api from '../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset email sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <FaBee className="text-3xl text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">BudgetBee</h1>
        </div>

        <div className="card p-8">
          {sent ? (
            <div className="text-center py-4">
              <MdCheckCircle className="text-6xl text-emerald-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Check Your Email</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                We sent a password reset link to <strong>{email}</strong>. Please check your inbox.
              </p>
              <Link to="/login" className="btn-primary inline-block px-8">Back to Sign In</Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Forgot Password?</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email Address</label>
                  <div className="relative">
                    <MdEmail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              <Link to="/login" className="flex items-center justify-center gap-2 mt-5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <MdArrowBack /> Back to Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
