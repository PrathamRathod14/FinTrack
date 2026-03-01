import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/authService';
import toast from 'react-hot-toast';

export default function Register() {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const res = await registerUser({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password
      });
      toast.success('Account created successfully!');
      login(res.data.token, res.data);
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full pl-11 pr-4 py-3 rounded-xl border ${
      errors[field] ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-navy-200'
    } bg-white focus:outline-none focus:ring-2 transition text-sm`;

  return (
    <div className="min-h-screen flex">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy-900 items-center justify-center p-12">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gold-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-navy-900 font-black text-2xl">F</span>
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">FinTrack</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Start managing your money wisely
          </h2>
          <p className="text-navy-300 text-lg leading-relaxed">
            Create your free account and get complete visibility into your earning, spending, and saving habits.
          </p>
          <div className="mt-10 space-y-4">
            {['Track expenses & income', 'Set budgets per category', 'View detailed analytics'].map((t) => (
              <div key={t} className="flex items-center gap-3 text-navy-200">
                <div className="w-6 h-6 bg-gold-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-gold-400 text-xs font-bold">✓</span>
                </div>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-gold-500 rounded-xl flex items-center justify-center">
              <span className="text-navy-900 font-black text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-navy-900">FinTrack</span>
          </div>

          <h1 className="text-2xl font-bold text-navy-900 mb-1">Create your account</h1>
          <p className="text-gray-500 mb-8">
            Already have an account?{' '}
            <Link to="/login" className="text-gold-600 hover:text-gold-700 font-semibold">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  className={inputClass('name')}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                  className={inputClass('email')}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                  className={`w-full pl-11 pr-12 py-3 rounded-xl border ${
                    errors.password ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-navy-200'
                  } bg-white focus:outline-none focus:ring-2 transition text-sm`}
                  placeholder="Min. 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(e) => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  className={inputClass('confirmPassword')}
                  placeholder="Re-enter your password"
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-navy-900 text-white font-semibold rounded-xl hover:bg-navy-800 disabled:opacity-60 transition flex items-center justify-center gap-2 shadow-lg shadow-navy-900/20"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            <Link to="/" className="hover:text-navy-600 transition">&larr; Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
