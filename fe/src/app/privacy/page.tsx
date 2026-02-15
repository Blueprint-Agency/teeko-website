
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
    title: "Privacy Policy | Teeko",
    description: "Privacy Policy for Teeko AI"
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col">
            <Navigation forceSolid />
            <main className="flex-grow pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>

                    <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
                        <p className="font-semibold">Effective Date: 23 April 2025</p>

                        <p>This Privacy Policy (“Policy”) describes how Asia Success Resources Sdn Bhd, the operator of Teeko AI (“Teeko”, “we”, “us”, or “our”), collects, uses, processes, and discloses your Personal Data through the use of Teeko’s website (Teeko AI), mobile application, and related transport booking services (collectively, “Services”).</p>

                        <p>This Policy applies to drivers, passengers, and other individuals interacting with our Services, including but not limited to agents, vendors, or service providers (collectively “you”, “your”, or “yours”).</p>

                        <p>“Personal Data” refers to any information relating to an identified or identifiable individual, including but not limited to name, identification number, driver’s license details, government-issued documents, contact information, location data, and transaction details.</p>

                        <p>We collect, use, process, and disclose your Personal Data in accordance with this Policy, with your consent where required, or in compliance with applicable laws, such as the Malaysian Personal Data Protection Act 2010 (PDPA), where it is necessary to perform a contract, comply with legal obligations, or pursue our legitimate interests.</p>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">I. COLLECTION OF PERSONAL DATA</h2>

                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4">A. Personal Data You Provide</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Register as a driver (name, contact, ID, driver’s license, vehicle info).</li>
                            <li>Complete passenger booking forms.</li>
                            <li>Contact support (chat, email, phone).</li>
                            <li>Participate in surveys, promotions, or events.</li>
                            <li>Verify identity (e.g., selfies).</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4">B. Personal Data Collected During Use of Services</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Location Data</li>
                            <li>Transaction Information</li>
                            <li>Device Information</li>
                            <li>Feedback and Ratings</li>
                            <li>In-Vehicle Data</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4">C. Personal Data from Other Sources</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Government authorities</li>
                            <li>Payment processors</li>
                            <li>Business partners</li>
                            <li>Emergency contacts</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4">D. Sensitive Personal Data</h3>
                        <p>Collected only with consent or under legal compliance.</p>

                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4">E. Personal Data of Others</h3>
                        <p>You must have consent to provide others’ data.</p>

                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4">F. Personal Data of Minors</h3>
                        <p>Services are not intended for minors under 18.</p>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">II. USE OF PERSONAL DATA</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Providing Services:</strong> Booking, identity verification, payments, personalization, communication.</li>
                            <li><strong>Safety and Security:</strong> Monitoring, fraud detection, emergency sharing.</li>
                            <li><strong>Customer Support:</strong> Complaint resolution, feedback handling.</li>
                            <li><strong>Research and Development:</strong> Trends analysis, feature development.</li>
                            <li><strong>Legal Compliance:</strong> Regulatory adherence, dispute investigation.</li>
                            <li><strong>Marketing:</strong> Promotions, updates (with consent).</li>
                        </ul>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">III. DISCLOSURE OF PERSONAL DATA</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Other Users:</strong> Shared trip info between passengers and drivers.</li>
                            <li><strong>Third Parties:</strong> Providers, partners, authorities.</li>
                            <li><strong>Corporate Transactions:</strong> Transfer in mergers/acquisitions.</li>
                        </ul>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">IV. RETENTION OF PERSONAL DATA</h2>
                        <p>Data is retained as long as needed for purposes or legal requirements.</p>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">V. INTERNATIONAL TRANSFERS OF PERSONAL DATA</h2>
                        <p>Transfers are compliant with PDPA and safeguarded appropriately.</p>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">VI. COOKIES AND RELATED TECHNOLOGIES</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Authentication</li>
                            <li>Usage analysis</li>
                            <li>Ad delivery (with consent)</li>
                        </ul>
                        <p>You can manage cookies via browser or Cookie Settings.</p>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">VII. PROTECTION OF PERSONAL DATA</h2>
                        <p>Measures include encryption, access control, training.</p>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">VIII. YOUR RIGHTS</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Access and copy</li>
                            <li>Correct data</li>
                            <li>Withdraw consent/delete</li>
                            <li>Object/restrict processing</li>
                        </ul>
                        <p>Contact our DPO for rights exercise. Identity verification required.</p>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">IX. AMENDMENTS AND UPDATES</h2>
                        <p>Policy may change with notice. Continued use implies acceptance.</p>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">X. HOW TO CONTACT US</h2>
                        <p><strong>Name:</strong> Asia Success Resources Sdn Bhd (Attention: Data Protection Officer)</p>
                        <p><strong>Address:</strong> The Transportation Hub, Level 1, Lot No. L1-5 first floor, Lot No. L1-7 first floor & Lot No. L2-149, Second Floor, TERMINAL KLIA 2, KL INTERNATIONAL AIRPORT, Jalan KLIA 2/1, 64000 KLIA, Selangor</p>
                        <p><strong>Email:</strong> support@teeko.ai</p>
                        <p>We prefer inquiries via email for efficient processing.</p>
                        <p><strong>Language:</strong> This Policy is written in English. In case of conflict with translated versions, the English version prevails.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
