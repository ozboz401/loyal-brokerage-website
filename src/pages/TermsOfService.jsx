import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            <Navbar />

            <div className="flex-grow pt-32 pb-24 px-6 md:px-12">
                <div className="max-w-4xl mx-auto bg-white p-10 md:p-16 rounded-2xl shadow-sm border border-slate-200">
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-slate-900 tracking-tight">
                        Terms of Service
                    </h1>

                    <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-6">
                        <p className="text-slate-500 mb-8">
                            Effective Date: December 1, 2025
                        </p>

                        <p>
                            Welcome to Loyal Brokerage LLC (“Company,” “we,” “us,” or “our”).
                            These Terms of Service govern your access to and use of our website,
                            services, and freight brokerage operations. By accessing or using
                            our services, you agree to be bound by these Terms.
                        </p>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
                            1. Nature of Services
                        </h2>
                        <p>
                            Loyal Brokerage LLC operates strictly as a licensed freight broker.
                            We arrange transportation services between shippers and independent,
                            authorized motor carriers. We do not own or operate trucks, do not
                            employ drivers, and do not physically transport freight. Nothing in
                            these Terms shall be construed as Loyal Brokerage LLC acting as a
                            motor carrier.
                        </p>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
                            2. No Carrier, Rate, or Transit Guarantee
                        </h2>
                        <p>
                            Loyal Brokerage LLC does not guarantee carrier availability, pricing,
                            capacity, transit times, or delivery outcomes. All transportation
                            services are performed by independent third-party motor carriers, and
                            any estimates provided are non-binding unless confirmed in writing.
                        </p>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
                            3. Quotes & Pricing
                        </h2>
                        <p>
                            All rate quotes are estimates unless confirmed in writing. Pricing may
                            change due to market conditions, fuel surcharges, accessorial charges,
                            detention, layover, port delays, weather conditions, or inaccurate
                            shipment information provided by shippers or carriers.
                        </p>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
                            4. Limitation of Liability
                        </h2>
                        <p>
                            To the fullest extent permitted by law, Loyal Brokerage LLC shall not
                            be liable for:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Cargo loss, damage, or theft</li>
                            <li>Delays, missed appointments, or service failures</li>
                            <li>Acts or omissions of carriers, shippers, consignees, or third parties</li>
                            <li>
                                Force majeure events including weather, labor disputes,
                                governmental actions, or equipment failures
                            </li>
                            <li>
                                Any indirect, incidental, consequential, or special damages
                            </li>
                        </ul>
                        <p className="mt-4">
                            All cargo claims must be pursued directly against the motor carrier.
                            Carrier cargo insurance, if any, applies subject to the carrier’s
                            policy terms and applicable federal regulations.
                        </p>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
                            5. User Responsibilities
                        </h2>
                        <p>
                            Users agree to provide accurate and complete shipment information,
                            comply with all applicable laws and regulations, and refrain from
                            misuse of the website or services. Loyal Brokerage LLC is not
                            responsible for losses or errors resulting from inaccurate or
                            incomplete information provided by users.
                        </p>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
                            6. Intellectual Property
                        </h2>
                        <p>
                            All website content, trademarks, branding, and materials are the
                            exclusive property of Loyal Brokerage LLC and may not be copied,
                            reproduced, distributed, or reused without prior written consent.
                        </p>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
                            7. Governing Law & Jurisdiction
                        </h2>
                        <p>
                            These Terms shall be governed by and construed in accordance with the
                            laws of the State of Florida and applicable United States federal law,
                            without regard to conflict of law principles.
                        </p>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
                            8. Modifications
                        </h2>
                        <p>
                            Loyal Brokerage LLC reserves the right to modify these Terms at any
                            time. Continued use of the website or services following any changes
                            constitutes acceptance of the revised Terms.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
