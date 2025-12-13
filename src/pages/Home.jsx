import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ShieldCheck, Headset, DollarSign, Route, Package, ShoppingBag, Globe, Layers, Box, Truck, FileText, Search, CheckCircle, Shield } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-600 selection:text-white">
            <Navbar />

            {/* 1. HERO SECTION */}
            <section className="relative pt-32 pb-24 px-6 overflow-hidden">
                {/* Hero Background Image */}
                {/* Hero Background Image */}
                <div className="absolute inset-0 z-0 bg-slate-950">
                    <img
                        src="/assets/hero-truck-day.png"
                        alt="Logistics Truck"
                        className="w-full h-full object-cover opacity-25"
                    />
                    {/* Dark Navy Overlay (Not Black) */}
                    <div className="absolute inset-0 bg-slate-900/50 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80" />
                </div>
                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight mb-8 leading-tight drop-shadow-2xl text-slate-100">
                        Reliable Nationwide <span className="block text-blue-500 pb-2">
                            Freight Brokerage
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light drop-shadow-md">
                        Transparent, on-time, and built on trust. We provide dry van, flatbed, and FTL logistics solutions across the U.S. transportation network.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Link
                            to="/request-quote"
                            className="group relative px-10 py-5 bg-blue-700 hover:bg-blue-600 text-white text-lg font-bold rounded-xl transition-all duration-300 shadow-[0_10px_20px_rgba(29,78,216,0.3)] hover:shadow-[0_15px_30px_rgba(29,78,216,0.5)] hover:translate-y-[-2px] overflow-hidden border border-blue-500/50"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Request a Quote
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </span>
                        </Link>
                        <Link
                            to="/carrier-signup"
                            className="group relative px-10 py-5 bg-slate-800/80 backdrop-blur-md border border-slate-600 hover:border-blue-500/50 text-slate-100 text-lg font-bold rounded-xl transition-all duration-300 hover:bg-slate-800 shadow-lg hover:shadow-[0_10px_20px_rgba(30,58,138,0.3)] hover:translate-y-[-2px]"
                        >
                            Join Our Carrier Network
                        </Link>
                    </div>
                </div>
            </section>

            {/* 2. WHY CHOOSE US - Distinct from Hero */}
            {/* 2. WHY CHOOSE LOYAL BROKERAGE - High Contrast, No Fluff */}
            <section className="py-24 relative overflow-hidden bg-slate-950 border-t border-slate-900">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight">Why Choose Loyal Brokerage?</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-xl font-medium">Built for long-term consistency and operational excellence.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard
                            Icon={ShieldCheck}
                            title="Reliable Execution"
                            desc="We treat every shipment with the highest level of security and care, ensuring your freight arrives safely and on time."
                        />
                        <FeatureCard
                            Icon={Headset}
                            title="24/7 Support"
                            desc="Our dedicated logistics team is available around the clock to answer questions and keep you updated."
                        />
                        <FeatureCard
                            Icon={DollarSign}
                            title="Market Efficiency"
                            desc="We leverage our vast network to secure the best market rates without compromising on service quality."
                        />
                        <FeatureCard
                            Icon={Route}
                            title="Nationwide Scale"
                            desc="From coast to coast, our vetted carrier network ensures you always have reliable capacity anywhere in the US."
                        />
                    </div>
                </div>
            </section>



            {/* 3. CORE CAPABILITIES - Operational Grid */}
            {/* 3. CORE CAPABILITIES - Execution Scale (Reset) */}
            {/* 3. CORE CAPABILITIES - Execution Scale (Light Theme) */}
            <section id="services" className="py-32 px-6 relative bg-slate-50 border-t border-slate-200 overflow-hidden">
                {/* 1. Background Image - Active Execution Context (Warehouse/Dock) */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <img
                        src="/assets/warehouse-dock-day.png"
                        alt="Active Warehouse Operations"
                        className="w-full h-full object-cover opacity-[0.09] saturate-50 contrast-125 mix-blend-multiply"
                    />
                    <div className="absolute inset-0 bg-noise opacity-[0.03]"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Dominant Statement */}
                    <div>
                        <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                            We Execute<br />Freight at Scale.
                        </h2>
                        <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-xl">
                            Through disciplined lanes, vetted carriers, and real-time execution, we move freight predictably — even when markets tighten.
                        </p>
                    </div>

                    {/* Right: 4 Execution Pillars (Light Theme List) */}
                    <div className="border-l-2 border-slate-200 pl-8 space-y-10">
                        <div className="group">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                <h3 className="text-xl font-bold text-slate-900">Lane-Based Capacity</h3>
                            </div>
                            <p className="text-slate-500 text-base pl-4.5">Repeatable lanes, reduced volatility.</p>
                        </div>
                        <div className="group">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                <h3 className="text-xl font-bold text-slate-900">Carrier Compliance Control</h3>
                            </div>
                            <p className="text-slate-500 text-base pl-4.5">Strict vetting before every dispatch.</p>
                        </div>
                        <div className="group">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                <h3 className="text-xl font-bold text-slate-900">Exception-First Operations</h3>
                            </div>
                            <p className="text-slate-500 text-base pl-4.5">Proactive resolution, not passive tracking.</p>
                        </div>
                        <div className="group">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                <h3 className="text-xl font-bold text-slate-900">Live Visibility & Accountability</h3>
                            </div>
                            <p className="text-slate-500 text-base pl-4.5">Single point of contact from quote to POD.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. INDUSTRIES WE SERVE */}
            {/* 4. INDUSTRIES WE SERVE */}
            {/* 4. INDUSTRIES WE SERVE - Darker & Heavy */}
            {/* 4. INDUSTRIES WE SERVE - Light Theme & Refined List */}
            {/* 4. INDUSTRIES WE SERVE - Pattern and Texture */}
            {/* 4. PRIMARY FOCUS - Split Scene */}
            {/* 4. PRIMARY FOCUS - Split Scene */}
            {/* 4. SPECIALIZED FREIGHT FOCUS - Serious & Selective */}
            <section className="py-32 px-6 bg-slate-950 relative border-t border-slate-900 overflow-hidden">
                {/* Texture */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/assets/dark_logistics_texture.png"
                        alt=""
                        className="w-full h-full object-cover opacity-10 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-slate-950/80"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-5 gap-16 items-start">

                    {/* Left: Sticky Context */}
                    <div className="lg:col-span-2 lg:sticky lg:top-32">
                        <div className="inline-block px-4 py-2 bg-slate-800 text-slate-300 border border-slate-700 rounded-sm text-xs font-bold mb-6 tracking-widest uppercase">
                            Our Discipline
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                            Specialized Freight Focus
                        </h2>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed mb-8">
                            We don't try to be everything to everyone. We specialize in high-volume sectors where reliability is paramount.
                        </p>
                        <ul className="space-y-4 text-slate-300 font-medium">
                            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-600" /> Lane-Focused Capacity</li>
                            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-600" /> Carrier Compliance Vetting</li>
                            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-600" /> High-Value Cargo</li>
                        </ul>
                    </div>

                    {/* Right: Grid */}
                    <div className="lg:col-span-3 grid sm:grid-cols-2 gap-6">
                        <IndustryCard Icon={Package} title="Packaged Food & Beverage" dark={true} />
                        <IndustryCard Icon={ShoppingBag} title="Retail & Consumer Goods" dark={true} />
                        <IndustryCard Icon={Globe} title="E-commerce Fulfillment" dark={true} />
                        <IndustryCard Icon={Layers} title="Paper & Packaging" dark={true} />
                        <IndustryCard Icon={Box} title="General Merchandise" dark={true} />
                        <IndustryCard Icon={Truck} title="Regional Distribution" dark={true} />
                    </div>
                </div>
            </section>

            {/* 5. ABOUT US */}
            {/* 5. ABOUT US */}
            {/* 5. ABOUT US */}
            {/* 5. ABOUT US - Light Theme & Institutional */}
            {/* 5. ABOUT US - Off-White Rhythm */}
            {/* 5. ABOUT US - Split & Stats */}
            {/* 5. ABOUT US - Split Text Layout */}
            {/* 5. OPERATIONAL DISCIPLINE */}
            {/* 5. OPERATIONAL DISCIPLINE */}
            {/* 5. OPERATIONAL DISCIPLINE */}
            <section className="py-32 px-6 relative border-t border-gray-200 bg-cover bg-center" style={{ backgroundImage: "url('/assets/office-dispatch-day.png')" }}>
                {/* Light Overlay - Text must be readable but image visible (Visible Muted Image) */}
                <div className="absolute inset-0 bg-white/90 backdrop-blur-[1px]"></div>

                <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-slate-900 tracking-tight leading-tight">Built on Operational Discipline</h2>
                        <div className="text-lg text-slate-700 space-y-6 leading-relaxed font-medium">
                            <p>
                                Loyal Brokerage LLC provides predictable, high-volume capacity for enterprise supply chains. Our model is built on lane density, strict carrier compliance, and proactive communication.
                            </p>
                            <p>
                                We do not rely on guesswork. We execute with precision, leveraging a vetted network to ensure your freight moves on schedule, every time.
                            </p>
                        </div>
                    </div>
                    {/* Real Image Context - Slightly visible through a container or just text? Keeping text as per request but overlay adjusted above */}
                    <div className="border-l-4 border-slate-900 pl-8">
                        <p className="text-xl text-slate-800 font-bold mb-4">
                            "We prioritize depth over breadth."
                        </p>
                        <p className="text-slate-600">
                            By specializing in our core competencies—handling dry van, packaged goods, and retail distribution—we turn logistics into a streamlined advantage. Our team proactively manages exceptions to keep your supply chain moving.
                        </p>
                    </div>
                </div>
            </section>

            {/* 5B. METRICS BAND - Dark Anchor */}
            {/* 5B. METRICS - Verified Proof Points */}
            <section className="py-16 px-6 bg-slate-900 relative border-y border-slate-800">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div className="p-4">
                        <div className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight">Multi-State</div>
                        <div className="text-blue-500 font-mono text-xs uppercase tracking-widest">Coverage</div>
                    </div>
                    <div className="p-4 border-l border-slate-800/50">
                        <div className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight">24/7</div>
                        <div className="text-blue-500 font-mono text-xs uppercase tracking-widest">Live Operations</div>
                    </div>
                    <div className="p-4 border-l border-slate-800/50">
                        <div className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight">Verified</div>
                        <div className="text-blue-500 font-mono text-xs uppercase tracking-widest">Carrier Network</div>
                    </div>
                    <div className="p-4 border-l border-slate-800/50">
                        <div className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight">Performance</div>
                        <div className="text-blue-500 font-mono text-xs uppercase tracking-widest">On-Time Focus</div>
                    </div>
                </div>
            </section>

            {/* 6. COMPLIANCE & SAFETY */}
            {/* 6. COMPLIANCE & SAFETY */}
            {/* 6. COMPLIANCE & SAFETY - Heavy Dark */}
            {/* 6. COMPLIANCE & SAFETY - Light Theme */}
            <section className="py-20 px-6 border-y border-gray-100 bg-white relative">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold mb-6 text-blue-800">Compliance & Safety First</h2>
                        <ul className="space-y-4 text-gray-600">
                            <li className="flex items-start gap-3"><span className="text-green-600">✔</span> Full FMCSA Compliance & Active Authority</li>
                            <li className="flex items-start gap-3"><span className="text-green-600">✔</span> Rigorous Carrier Vetting Process</li>
                            <li className="flex items-start gap-3"><span className="text-green-600">✔</span> Comprehensive Insurance Requirements</li>
                            <li className="flex items-start gap-3"><span className="text-green-600">✔</span> Real-Time Shipment Visibility 24/7</li>
                        </ul>
                    </div>
                    <div className="flex-1 bg-gray-50 p-10 rounded-2xl border border-gray-100 text-center shadow-lg">
                        <div className="flex justify-center mb-6">
                            <Shield className="w-16 h-16 text-blue-900 opacity-80" strokeWidth={2.5} />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-900">Secure Supply Chain</h3>
                        <p className="text-gray-500 leading-relaxed">We don't just move freight; we protect your business reputation with industry-leading safety standards.</p>
                    </div>
                </div>
            </section>

            {/* 7. HOW WE MOVE YOUR FREIGHT */}
            <section className="py-24 px-6 relative border-t border-gray-800 bg-slate-900 overflow-hidden">
                {/* Background Image - Separated for Opacity Control (35-45%) */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/assets/warehouse-dock-day.png"
                        alt="Logistics Operations"
                        className="w-full h-full object-cover opacity-40 filter contrast-110"
                    />
                    {/* Soft Dark Gradient Overlay (Top -> Bottom) */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/60 to-slate-950/90"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <h2 className="text-4xl font-extrabold text-center mb-16 text-white tracking-tight drop-shadow-lg">How We Move Your Freight</h2>

                    {/* Visual Connector Line */}
                    <div className="hidden md:block absolute top-[280px] left-[10%] right-[10%] h-0.5 bg-slate-600/50 z-0"></div>

                    <div className="grid md:grid-cols-4 gap-8 relative z-10">
                        <div className="text-center group">
                            <div className="w-16 h-16 mx-auto bg-slate-800 rounded-lg flex items-center justify-center mb-6 border border-slate-700 relative z-10">
                                <span className="text-slate-400 font-mono font-bold text-lg">01</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 tracking-wide">Quote Request</h3>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed">Submit specifications via portal. Receive actionable market rates.</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 mx-auto bg-slate-800 rounded-lg flex items-center justify-center mb-6 border border-slate-700 relative z-10">
                                <span className="text-slate-400 font-mono font-bold text-lg">02</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 tracking-wide">Carrier Matching</h3>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed">Freight matched with vetted network partners based on lane history.</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 mx-auto bg-slate-800 rounded-lg flex items-center justify-center mb-6 border border-slate-700 relative z-10">
                                <span className="text-slate-400 font-mono font-bold text-lg">03</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 tracking-wide">Dispatch & Track</h3>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed">System-wide visibility from pickup through final delivery.</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 mx-auto bg-slate-800 rounded-lg flex items-center justify-center mb-6 border border-slate-700 relative z-10">
                                <span className="text-slate-400 font-mono font-bold text-lg">04</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 tracking-wide">Delivery & POD</h3>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed">Instant POD upload and billing trigger upon completion.</p>
                        </div>
                    </div>
                </div>
            </section>
            {/* 9. FAQ */}
            {/* 9. FAQ */}
            {/* 9. FAQ */}
            {/* 9. FAQ - Light Theme */}
            <section className="py-24 px-6 bg-gray-50 border-t border-gray-200 relative">
                <div className="max-w-4xl mx-auto relative z-10">
                    <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-900 tracking-tight">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        <FAQItem
                            q="How does a freight broker help reduce shipping costs?"
                            a="We leverage our density in key lanes to find the best available capacity. By consolidating volume with our core carrier partners, we secure more stable, competitive rates than ad-hoc bookings."
                        />
                        <FAQItem
                            q="What is your primary freight focus?"
                            a="Our core expertise is in Dry Van transportation, specifically for packaged food, retail goods, and general palletized freight. This focus allows us to provide higher reliability and better service on these shipment types."
                        />
                        <FAQItem
                            q="How fast can I receive a shipping quote?"
                            a="Very fast. Because we know our lanes and market rates deeply, we can typically provide a competitive, actionable quote within minutes for standard lanes."
                        />
                        <FAQItem
                            q="Are your carriers insured and compliant?"
                            a="Absolutely. Every carrier in our network undergoes a strict vetting process. We verify FMCSA authority, safety ratings, and ensure they meet our high insurance coverage requirements before moving a single pallet."
                        />
                        <FAQItem
                            q="Do you handle other freight types?"
                            a="Yes. While our primary focus is dry van, we support our partners with flatbed, LTL, and expedited solutions as part of a comprehensive service relationship."
                        />
                        <FAQItem
                            q="How does your carrier onboarding process work?"
                            a="It's fully digital. Click 'Join Carrier Network', fill out your profile, and upload your documents. Our compliance team reviews applications quickly so you can start booking loads ASAP."
                        />
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

// --- SUB-COMPONENTS ---

function FeatureCard({ Icon, iconImg, title, desc }) {
    return (
        <div className="relative group bg-gray-800/40 backdrop-blur-sm p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-5px_rgba(30,58,138,0.3)] overflow-hidden">
            {/* Subtle Gradient Hover Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/5 group-hover:to-blue-500/20 transition-all duration-500 opacity-0 group-hover:opacity-100 dark:mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-noise opacity-[0.03]"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-6 p-4 rounded-2xl bg-gray-900/50 border border-white/5 shadow-inner group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-500">
                    {Icon ? (
                        <Icon className="w-10 h-10 text-gray-400 group-hover:text-blue-400 transition-all duration-300 transform group-hover:scale-105 group-hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" strokeWidth={2.5} />
                    ) : iconImg ? (
                        <img src={iconImg} alt={title} className="w-10 h-10 object-contain opacity-70 group-hover:opacity-100 transition-all duration-500" />
                    ) : null}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors duration-300">{title}</h3>
                <p className="text-gray-400 leading-relaxed font-light">{desc}</p>
            </div>
        </div>
    );
}



function IndustryCard({ Icon, title, dark }) {
    return (
        <div className={`p-8 rounded-xl border flex flex-col items-center hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-lg group ${dark ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700' : 'bg-gray-50 border-gray-200 hover:bg-white'}`}>
            <div className={`mb-5 transition-colors ${dark ? 'text-slate-400 group-hover:text-blue-400' : 'text-gray-400 group-hover:text-blue-600'}`}>
                <Icon size={44} strokeWidth={2.5} />
            </div>
            <h4 className={`font-bold transition-colors ${dark ? 'text-slate-200 group-hover:text-white' : 'text-gray-800 group-hover:text-gray-900'}`}>{title}</h4>
        </div>
    );
}

function SectionGlow({ position = "bottom" }) {
    return (
        <div className={`absolute ${position}-0 left-0 right-0 h-64 opacity-[0.12] pointer-events-none z-0 overflow-hidden`}>
            <img src="/assets/hero_mesh.png" className="w-full h-full object-cover blur-3xl transform scale-110" alt="" />
        </div>
    );
}





function TestimonialCard({ quote, author, role, dark }) {
    return (
        <div className={`p-8 rounded-2xl italic shadow-sm hover:shadow-md transition-shadow ${dark ? 'bg-slate-800 border border-slate-700 text-slate-300' : 'bg-gray-50 border border-gray-100 text-gray-600'}`}>
            <p className="mb-6 font-medium leading-relaxed">"{quote}"</p>
            <div>
                <div className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{author}</div>
                <div className={`text-sm ${dark ? 'text-blue-400' : 'text-blue-600'}`}>{role}</div>
            </div>
        </div>
    );
}

function FAQItem({ q, a }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-6 text-left font-bold text-gray-900 hover:bg-gray-50 transition"
            >
                <span>{q}</span>
                <span className={`text-blue-600 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {isOpen && (
                <div className="p-6 pt-0 text-gray-600 border-t border-gray-100 bg-gray-50/50">
                    <p>{a}</p>
                </div>
            )}
        </div>
    );
}
