import { Link } from 'react-router-dom';
import {
  BarChart3,
  Shield,
  Wallet,
  TrendingUp,
  PieChart,
  Target,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  CreditCard
} from 'lucide-react';

const features = [
  {
    icon: Wallet,
    title: 'Track Every Penny',
    desc: 'Record income and expenses with ease. Categorize transactions to understand your spending patterns.'
  },
  {
    icon: PieChart,
    title: 'Visual Analytics',
    desc: 'Interactive charts break down your finances by category, monthly trends, and daily spending habits.'
  },
  {
    icon: Target,
    title: 'Budget Goals',
    desc: 'Set monthly budgets per category and track progress with real-time spending alerts.'
  },
  {
    icon: TrendingUp,
    title: 'Monthly Trends',
    desc: 'See how your income and expenses evolve over time with beautiful, interactive trend analytics.'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    desc: 'Your financial data is protected with industry-standard encryption and secure authentication.'
  },
  {
    icon: CreditCard,
    title: 'Multi-Currency',
    desc: 'Support for multiple currencies — track your finances in the currency you prefer.'
  }
];

const stats = [
  { value: '100%', label: 'Free & Open' },
  { value: '5+', label: 'Currencies' },
  { value: '15+', label: 'Categories' },
  { value: '∞', label: 'Transactions' }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gold-500 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-navy-900 font-black text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-navy-900 tracking-tight">FinTrack</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-navy-700 hover:text-navy-900 transition"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 text-sm font-semibold bg-navy-900 text-white rounded-xl hover:bg-navy-800 transition shadow-lg shadow-navy-900/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gold-50 text-gold-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-gold-200">
            <Sparkles size={16} />
            Smart financial tracking made simple
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-navy-900 tracking-tight leading-[1.1]">
            Take Control of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-gold-600">
              Your Finances
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            FinTrack helps you monitor your income, expenses, and budgets with beautiful charts and smart insights — all in one secure place.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-navy-900 text-white font-semibold rounded-2xl hover:bg-navy-800 transition shadow-xl shadow-navy-900/25 text-lg"
            >
              Start for Free
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-navy-900 font-semibold rounded-2xl hover:bg-gray-200 transition text-lg"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-navy-900 py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold text-gold-400">{s.value}</div>
              <div className="text-sm text-navy-300 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900">
              Everything you need to manage money
            </h2>
            <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
              Powerful features designed to give you full visibility into your financial health.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-gold-200 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-navy-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-gold-50 transition-colors">
                  <f.icon className="text-navy-700 group-hover:text-gold-600 transition-colors" size={24} />
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900">
              Get started in 3 steps
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up for free in seconds with just your name and email.' },
              { step: '02', title: 'Add Transactions', desc: 'Log your income and expenses with categories and details.' },
              { step: '03', title: 'Track & Grow', desc: 'View analytics, set budgets, and take control of your finances.' }
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-16 h-16 bg-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-gold-500/30">
                  <span className="text-navy-900 font-extrabold text-xl">{s.step}</span>
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">{s.title}</h3>
                <p className="text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-navy-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to master your finances?
          </h2>
          <p className="text-navy-300 text-lg mb-10">
            Join FinTrack today and start building better financial habits.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 text-navy-900 font-bold rounded-2xl hover:bg-gold-400 transition shadow-xl text-lg"
          >
            Create Free Account
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-950 py-8 px-4 text-center">
        <p className="text-navy-400 text-sm">
          &copy; {new Date().getFullYear()} FinTrack. Built with care.
        </p>
      </footer>
    </div>
  );
}
