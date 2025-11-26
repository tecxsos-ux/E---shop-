import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, CheckCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-gray-50/50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <span className="text-indigo-600 font-bold tracking-wider uppercase text-xs mb-2 block">We'd love to hear from you</span>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                Have a question about our products, shipping, or just want to say hello? 
                Our team is ready to answer all your questions.
            </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                            <Mail size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Email Us</p>
                            <p className="text-gray-600">support@luxemarket.ai</p>
                            <p className="text-gray-600">info@luxemarket.ai</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                            <Phone size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Call Us</p>
                            <p className="text-gray-600">+1 (555) 123-4567</p>
                            <p className="text-xs text-gray-500 mt-1">Mon-Fri from 8am to 5pm</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Visit Us</p>
                            <p className="text-gray-600">
                                123 Luxury Lane, Suite 100<br/>
                                Beverly Hills, CA 90210
                            </p>
                        </div>
                    </div>

                     <div className="flex items-start gap-4 pt-6 border-t border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Business Hours</p>
                            <div className="text-gray-600 text-sm grid grid-cols-2 gap-x-4">
                                <span>Mon - Fri:</span> <span>9:00 AM - 6:00 PM</span>
                                <span>Saturday:</span> <span>10:00 AM - 4:00 PM</span>
                                <span>Sunday:</span> <span>Closed</span>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
             <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                {isSubmitted ? (
                    <div className="flex flex-col items-center justify-center h-full py-20 text-center animate-fade-in-up">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                            <CheckCircle size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Message Sent!</h3>
                        <p className="text-gray-500 mt-2">Thank you for contacting us. We will get back to you shortly.</p>
                        <button 
                            onClick={() => setIsSubmitted(false)}
                            className="mt-6 text-indigo-600 font-medium hover:underline"
                        >
                            Send another message
                        </button>
                    </div>
                ) : (
                    <>
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                    <input 
                                        type="text" 
                                        id="name" 
                                        name="name" 
                                        required
                                        value={form.name}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow placeholder-gray-400"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        required
                                        value={form.email}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow placeholder-gray-400"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input 
                                    type="text" 
                                    id="subject" 
                                    name="subject" 
                                    required
                                    value={form.subject}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow placeholder-gray-400"
                                    placeholder="How can we help?"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea 
                                    id="message" 
                                    name="message" 
                                    rows={6}
                                    required
                                    value={form.message}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow placeholder-gray-400 resize-none"
                                    placeholder="Write your message here..."
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <Send size={18} /> Send Message
                            </button>
                        </form>
                    </>
                )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
