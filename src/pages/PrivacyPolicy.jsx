import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            <Navbar />

            <div className="flex-grow pt-32 pb-24 px-6 md:px-12">
                <div className="max-w-4xl mx-auto bg-white p-10 md:p-16 rounded-2xl shadow-sm border border-slate-200">
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-slate-900 tracking-tight">
                        Privacy Policy
                    </h1>

                    <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-6">
                        <p className="text-slate-500 mb-8">
                            Effective Date: December 1, 2025
                        </p>

                        <p>
                            Loyal Brokerage LLC (“Company,” “we,” “us,” or “our”) respects your
                            privacy and is committed to protecting personal and business
                            information collected through our website and services.
                        </p>

                        <p>
                            This Privacy Policy explains how we collect, use, disclose, and
                            protect information when you interact with our website or freight
                            brokerage services.
                        </p>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
                            1. Information We Collect
                        </h2>
                        <p>
                            We may collect the following types of information:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                Personal and business contact information, including name,
                                company name, email address, phone number, and mailing address
                            </li>
                            <li>
                                Shipment, logistics, and transportation-related information
                            </li>
                            <li>
                                Carrier onboarding and compliance information
                            </li>
                            <li>
                                Website usage data, including IP address, browser type, device
                                information, and pages visited
                            </li>
                        </ul>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
                            2. How We Use Information
                        </h2>
                        <p>
                            We use collected information for legitimate business purposes,
                            including to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                Provide and manage freight brokerage services
                            </li>
                            <li>
                                Communicate with shippers, carriers, and business partners
                            </li>
                            <li>
                                Process onboarding, requests, and transactions
                            </li>
                            <li>
                                Improve our operations, website functionality, and customer
                                experience
                            </li>
                            <li>
                                Comply with applicable legal, regulatory, and contractual
                                obligations
                            </li>
                        </ul>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
                            3. Information Sharing & Disclosure
                        </h2>
                        <p>
                            Loyal Brokerage LLC does not sell personal information.
                        </p>
                        <p>
                            We may share information only as necessary with:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                Motor carriers, shippers, and consignees involved in
                                transportation services
                            </li>
                            <li>
                                Service providers supporting our business operations, such as
                                hosting, email, and analytics providers
                            </li>
                            <li>
                                Professional advisors, including legal and accounting firms
                            </li>
                            <li>
                                Governmental or regulatory authorities when required by law or
                                legal process
                            </li>
                        </ul>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
                            4. Data Security
                        </h2>
                        <p>
                            We implement reasonable administrative, technical, and
                            organizational safeguards designed to protect information against
                            unauthorized access, disclosure, or misuse. However, no data
                            transmission or storage system can be guaranteed to be 100% secure.
                        </p>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
                            5. Cookies & Analytics
                        </h2>
                        <p>
                            Our website may use cookies, pixels, or analytics tools to enhance
                            functionality, monitor performance, and improve user experience.
                            You may control cookie settings through your browser preferences.
                        </p>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
                            6. Data Retention
                        </h2>
                        <p>
                            We retain personal and business information only for as long as
                            reasonably necessary to fulfill operational, legal, and regulatory
                            requirements, unless a longer retention period is required or
                            permitted by law.
                        </p>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
                            7. Your Rights & Choices
                        </h2>
                        <p>
                            Depending on your jurisdiction, you may have the right to request
                            access to, correction of, or deletion of your personal information.
                            Requests may be submitted using the contact information below.
                        </p>
                        <p>
                            California residents may have additional rights under the California
                            Consumer Privacy Act (CCPA), including the right to know, delete,
                            and opt out of certain data uses.
                        </p>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
                            8. Children’s Privacy
                        </h2>
                        <p>
                            Our services are not directed to individuals under the age of 13.
                            We do not knowingly collect personal information from children.
                        </p>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
                            9. Policy Updates
                        </h2>
                        <p>
                            We may update this Privacy Policy from time to time. Any changes
                            will be posted on this page with an updated effective date.
                            Continued use of the website constitutes acceptance of the revised
                            policy.
                        </p>

                        <hr className="my-10 border-slate-200" />

                        <h2 className="text-xl font-bold text-slate-900 mb-4">
                            Contact Information
                        </h2>
                        <p className="font-bold text-slate-800">
                            Loyal Brokerage LLC
                        </p>
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
