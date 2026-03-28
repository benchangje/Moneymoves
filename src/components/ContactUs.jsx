import { useEffect, useState } from "react"
import { Mail, MessageCircle, Clock } from "lucide-react"

export default function ContactUs() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [urgent, setUrgent] = useState(false)

    const validate = () => {
        const e = {}
        if (!name.trim()) e.name = "Name is required"
        if (!email.trim()) e.email = "Email is required"
        else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) e.email = "Enter a valid email"
        if (!message.trim()) e.message = "Message is required"
        return e
    }

    useEffect(() => {
        const e = validate()
        const visible = {}
        Object.keys(e).forEach((k) => {
            if (touched[k]) visible[k] = e[k]
        })
        setErrors(visible)
    }, [name, email, message, touched])

    const allErrors = validate()
    const isValid = Object.keys(allErrors).length === 0

    function handleBlur(field) {
        setTouched((t) => ({ ...t, [field]: true }))
    }

    function handleSubmit(e) {
        e.preventDefault()
        setTouched({ name: true, email: true, message: true })
        if (!isValid) return
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setSubmitted(true)
            setName("")
            setEmail("")
            setMessage("")
            setTouched({})
            setErrors({})
        }, 1000)
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto p-6 px-8 lg:p-8 lg:px-10">
                <div className="mb-6 flex flex-col items-start justify-between gap-4">
                    <div className="w-full ">
                        <h1 className="text-3xl font-semibold text-gray-900 mb-3">Get in Touch</h1>
                        <p className="text-gray-600 mt-3 leading-relaxed">Need help with a listing, partnership, or time-sensitive issue?
                        Our team typically responds within 24 hours — and within 8 hours for urgent requests.</p>
                    </div>

                    <div className="shrink-0">
                        <label className="flex items-center justify-center gap-4 cursor-pointer select-none">
                            <button
                                type="button"
                                role="switch"
                                aria-checked={urgent}
                                onClick={() => setUrgent((v) => !v)}
                                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none ${urgent ? 'bg-blue-600' : 'bg-gray-300'}`}
                                aria-label="Contact urgently toggle"
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${urgent ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                            <span className="text-gray-600 pb-0.5">Contact Urgently</span>
                        </label>
                    </div>
                </div>

                {/* Compact priority panel shown under the header when urgent is ON */}
                {urgent && (
                    <div className="mt-6 mb-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                            <a href="mailto:rentla.management@gmail.com" className="group flex items-center gap-3 rounded-xl bg-white shadow-[0_0_8px_rgba(0,0,0,0.08)] hover:shadow-lg p-3 pl-4 transform transition-all duration-400 hover:scale-102">
                                <Mail className="h-4 w-4 text-gray-800 flex-shrink-0" />
                                <div>
                                    <div className="text-sm font-medium text-gray-800">Email</div>
                                    <div className="text-sm text-gray-600">rentla.management@gmail.com</div>
                                </div>
                            </a>

                            <a href="#" className="group flex items-center gap-3 rounded-xl bg-white shadow-[0_0_8px_rgba(0,0,0,0.08)] hover:shadow-lg p-3 pl-4 transform transition-all duration-400 hover:scale-102">
                                <MessageCircle className="h-4 w-4 text-gray-800 flex-shrink-0" />
                                <div>
                                    <div className="text-sm font-medium text-gray-800">Telegram</div>
                                    <div className="text-sm text-gray-600">@yourhandle</div>
                                </div>
                            </a>

                            <div className="group flex items-center gap-3 rounded-xl bg-white shadow-[0_0_8px_rgba(0,0,0,0.08)] hover:shadow-lg p-3 pl-4 transform transition-all duration-400 hover:scale-102">
                                <Clock className="h-4 w-4 text-gray-800 flex-shrink-0" />
                                <div>
                                    <div className="text-sm font-medium text-gray-800">Response time</div>
                                    <div className="text-sm text-gray-600">Typically within 8 hours</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                    <div className="bg-white rounded-2xl shadow-[0_0_8px_rgba(0,0,0,0.08)] p-8">
                        <p className="text-sm text-gray-500">{urgent ? 'You are requesting priority support — use this for urgent issues only.' : 'Fill out the form and we will respond within 24 hours.'}</p>

                        {submitted && (
                            <div className="mt-6 rounded-lg bg-emerald-50 border border-emerald-100 p-4 text-emerald-700" role="status" aria-live="polite">
                                Thank you — your message has been sent. We'll get back to you shortly.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    className={`mt-2 block w-full rounded-xl border px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-gray-300 ${errors.name ? 'border-red-300' : 'border-gray-200'}`}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onBlur={() => handleBlur('name')}
                                    placeholder="Your full name"
                                    aria-invalid={!!errors.name}
                                    aria-describedby={errors.name ? 'error-name' : undefined}
                                />
                                {errors.name && <p id="error-name" className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    className={`mt-2 block w-full rounded-xl border px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-gray-300 ${errors.email ? 'border-red-300' : 'border-gray-200'}`}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={() => handleBlur('email')}
                                    placeholder="you@company.com"
                                    aria-invalid={!!errors.email}
                                    aria-describedby={errors.email ? 'error-email' : undefined}
                                />
                                {errors.email && <p id="error-email" className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Message</label>
                                <textarea
                                    placeholder="Tell us your needs"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    maxLength={2000}
                                    onFocus={(e) => e.target.placeholder = "Enter your message here"}
                                    className={`mt-2 resize-none h-48 w-full rounded-xl border px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-gray-300 ${errors.message ? 'border-red-300' : 'border-gray-200'}`}
                                />
                                {errors.message && <p id="error-message" className="mt-1 text-sm text-red-600">{errors.message}</p>}
                            </div>

                            <div className="flex items-center gap-6">
                                <button
                                    type="submit"
                                    disabled={!isValid || loading}
                                    className={`inline-flex items-center rounded-xl px-5 py-2.5 text-white font-semibold transition transform ${(!isValid || loading) ? 'bg-blue-300 cursor-not-allowed' : (urgent ? 'bg-blue-700 hover:scale-[1.02] hover:shadow-lg' : 'bg-blue-600 hover:-translate-y-0.5 hover:shadow-lg')}`}
                                >
                                    {loading ? (
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                        </svg>
                                    ) : null}
                                    {loading ? 'Sending...' : (urgent ? 'Send Urgent Request' : 'Send Message')}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => { setName(''); setEmail(''); setMessage(''); setTouched({}); setErrors({}); setSubmitted(false); }}
                                    className="text-sm text-gray-600 hover:text-gray-400 transition"
                                >
                                    Clear
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right-side contact info: animate in/out based on `urgent` */}
                    <aside
                        className={`bg-white rounded-xl p-6 shadow-[0_0_8px_rgba(0,0,0,0.08)] transform transition-all duration-300 ease-out ${urgent ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6 pointer-events-none'}`}
                        aria-hidden={!urgent}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Priority support</h3>
                                <div className="mt-1 text-sm text-gray-600">Priority channel for urgent requests</div>
                            </div>
                            <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">Priority</span>
                        </div>

                        <div className="mt-4 border-t border-gray-100 pt-4 space-y-3">
                            <a href="mailto:rentla.management@gmail.com" className="flex items-center gap-4 rounded-lg px-3 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200">
                                <Mail className="h-4 w-4 text-gray-800" />
                                <div>
                                    <div className="text-sm font-medium text-gray-800">Email</div>
                                    <div className="text-sm text-gray-600">rentla.management@gmail.com</div>
                                </div>
                            </a>

                            <a href="#" className="flex items-center gap-4 rounded-lg px-3 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200">
                                <MessageCircle className="h-4 w-4 text-gray-800" />
                                <div>
                                    <div className="text-sm font-medium text-gray-800">Telegram</div>
                                    <div className="text-sm text-gray-600">@yourhandle</div>
                                </div>
                            </a>

                            <div className="flex items-center gap-4 rounded-lg px-3 py-2">
                                <Clock className="h-4 w-4 text-gray-800" />
                                <div>
                                    <div className="text-sm font-medium text-gray-800">Response time</div>
                                    <div className="text-sm text-gray-600">Typically within 8 hours</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <a href="#" className="text-sm text-blue-600 hover:underline">FAQ — placeholder</a>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}