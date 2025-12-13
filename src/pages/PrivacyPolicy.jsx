import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            <Navbar />
            <div className="flex-grow pt-32 pb-24 px-6 md:px-12">
                <div className="max-w-4xl mx-auto bg-white p-10 md:p-16 rounded-2xl shadow-sm border border-slate-200">
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-slate-900 tracking-tight">Privacy Policy</h1>
                    <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-6">
                        <p className="text-slate-500 mb-8">Effective Date: December 1, 2025</p>

                        <p>Loyal Brokerage LLC respects your privacy and is committed to protecting personal and business information.</p>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Information We Collect</h2>
                        <p>We may collect:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Name, company name, email, phone number</li>
                            <li>Shipment and logistics details</li>
                            <li>Carrier onboarding information</li>
                            <li>Website usage data</li>
                        </ul>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. How Information Is Used</h2>
                        <p>Information is used to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide freight brokerage services</li>
                            <li>Communicate with shippers and carriers</li>
                            <li>Improve operations and customer experience</li>
                            <li>Comply with legal and regulatory requirements</li>
                        </ul>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Information Sharing</h2>
                        <p>We do not sell personal information. Data may be shared only with:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Carriers and shippers involved in shipments</li>
                            <li>Service providers supporting operations</li>
                            <li>Legal authorities if required by law</li>
                        </ul>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Data Security</h2>
                        <p>We use reasonable administrative and technical safeguards to protect information but cannot guarantee absolute security.</p>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. Cookies & Analytics</h2>
                        <p>Our website may use cookies or analytics tools to improve performance and user experience.</p>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">6. Your Rights</h2>
                        <p>You may request access, correction, or deletion of your information by contacting us.</p>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">7. Policy Updates</h2>
                        <p>This Privacy Policy may be updated periodically. Changes will be posted on this page.</p>

                        <hr className="my-10 border-slate-200" />

                        <h2 className="text-xl font-bold text-slate-900 mb-4">Contact Information</h2>
                        <p className="font-bold text-slate-800">Loyal Brokerage LLC</p>
                        <p>Email: info@loyalbrokerage.com</p>
                        <p>Phone: 561-288-0528</p>
                        <p>United States</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
