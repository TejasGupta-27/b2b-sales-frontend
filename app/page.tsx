import Link from 'next/link'
import { MessageSquare, ShoppingCart, TrendingUp, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            B2B Sales Agent
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI-powered sales assistant that provides personalized product recommendations 
            and generates instant quotations for your business needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <MessageSquare className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Smart Conversations</h3>
            <p className="text-gray-600">Natural language processing to understand your business requirements</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <ShoppingCart className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Product Recommendations</h3>
            <p className="text-gray-600">AI-driven suggestions based on your industry and needs</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <TrendingUp className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Instant Quotes</h3>
            <p className="text-gray-600">Generate detailed quotations with pricing and terms instantly</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <Users className="w-12 h-12 text-orange-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">B2B Focused</h3>
            <p className="text-gray-600">Designed specifically for business-to-business sales processes</p>
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/sales"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Start Sales Conversation
          </Link>
        </div>
      </div>
    </div>
  )
} 