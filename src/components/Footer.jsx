export default function Footer() {
    return (
        <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">

                {/* Brand */}
                <div>
                    <h3 className="text-2xl font-bold text-slate-100 mb-4">Loyal Brokerage LLC</h3>
                    <p className="mb-6">Reliable nationwide freight brokerage built on trust, transparency, and technology.</p>
                    <div className="flex gap-4">
                        <a href="http://linkedin.com/company/loyal-brokerage-llc" target="_blank" rel="noopener noreferrer">
                            <SocialIcon label="Li" />
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-slate-100 font-bold mb-6">Quick Links</h4>
                    <ul className="space-y-3">
                        <li><a href="/" className="hover:text-blue-500 transition">Home</a></li>
                        <li><a href="/carrier-signup" className="hover:text-blue-500 transition">For Carriers</a></li>
                        <li><a href="/request-quote" className="hover:text-blue-500 transition">For Shippers</a></li>
                        <li><a href="#" className="hover:text-blue-500 transition">About Us</a></li>
                        <li><a href="#" className="hover:text-blue-500 transition">Services</a></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="text-slate-100 font-bold mb-6">Contact Us</h4>
                    <ul className="space-y-3">
                        <li>📧 info@loyalbrokerage.com</li>
                        <li>📞 561-288-0528</li>
                        <li>📍 United States</li>
                    </ul>
                </div>

                {/* Legal */}
                <div>
                    <h4 className="text-slate-100 font-bold mb-6">Legal</h4>
                    <ul className="space-y-3">
                        <li><a href="/terms" className="hover:text-blue-500 transition">Terms of Service</a></li>
                        <li><a href="/privacy" className="hover:text-blue-500 transition">Privacy Policy</a></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-900 text-center text-sm">
                &copy; {new Date().getFullYear()} Loyal Brokerage LLC. All rights reserved.
            </div>
        </footer>
    );
}

function SocialIcon({ label }) {
    return (
        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition cursor-pointer">
            {label}
        </div>
    );
}
