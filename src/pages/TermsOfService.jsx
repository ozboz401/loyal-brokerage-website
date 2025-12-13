import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            <Navbar />
            <div className="flex-grow pt-32 pb-24 px-6 md:px-12">
                <div className="max-w-4xl mx-auto bg-white p-10 md:p-16 rounded-2xl shadow-sm border border-slate-200">
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-slate-900 tracking-tight">Terms of Service</h1>
                    <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-6">
                        <p className="text-slate-500 mb-8">Effective Date: December 1, 2025</p>

                        <p>Welcome to Loyal Brokerage LLC (“Company,” “we,” “us,” or “our”). These Terms of Service govern your access to and use of our website, services, and freight brokerage operations.</p>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Nature of Services</h2>
                        <p>Loyal Brokerage LLC is a licensed freight broker that arranges transportation services between shippers and authorized motor carriers. We do not operate trucks, employ drivers, or physically transport freight.</p>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. No Carrier or Shipper Guarantee</h2>
                        <p>While we work with vetted carriers and reliable partners, Loyal Brokerage LLC does not guarantee carrier performance, transit times, or shipment outcomes beyond the scope of brokerage services.</p>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Quotes & Pricing</h2>
                        <p>All rate quotes are estimates unless confirmed in writing. Pricing may change due to market conditions, fuel surcharges, accessorials, detention, layover, or shipper/carrier-provided information.</p>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Limitation of Liability</h2>
                        <p>Loyal Brokerage LLC shall not be liable for:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Cargo loss or damage</li>
                            <li>Delays or service failures</li>
                            <li>Acts of carriers, shippers, or third parties</li>
                            <li>Force majeure events</li>
                        </ul>
                        <p className="mt-4">Carrier cargo insurance applies to freight claims, subject to carrier terms and federal regulations.</p>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. User Responsibilities</h2>
                        <p>Users agree to provide accurate shipment information, comply with applicable laws, and refrain from misuse of the website or services.</p>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">6. Intellectual Property</h2>
                        <p>All website content, branding, and materials are the property of Loyal Brokerage LLC and may not be copied or reused without written consent.</p>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">7. Governing Law</h2>
                        <p>These Terms are governed by the laws of the United States and the State in which Loyal Brokerage LLC is registered.</p>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">8. Modifications</h2>
                        <p>We reserve the right to update these Terms at any time. Continued use constitutes acceptance of revisions.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
