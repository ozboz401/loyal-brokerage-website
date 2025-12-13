import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function CarrierSuccess() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
            <Navbar />

            <div className="flex-grow flex items-center justify-center px-6 pt-32 pb-20">
                <div className="bg-white border border-gray-200 p-12 rounded-3xl shadow-xl max-w-2xl w-full text-center relative overflow-hidden">

                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                            <span className="text-5xl">✅</span>
                        </div>

                        <h1 className="text-4xl font-extrabold mb-4 text-gray-900 tracking-tight">
                            Thank you for applying!
                        </h1>

                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Our compliance team will review your application and contact you within <span className="font-bold text-blue-600">24–48 hours</span>.
                        </p>

                        <Link
                            to="/"
                            className="px-10 py-4 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl transition shadow-md hover:shadow-lg"
                        >
                            Return Home
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
