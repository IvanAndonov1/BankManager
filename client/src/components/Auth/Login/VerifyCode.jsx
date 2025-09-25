import { Link } from "react-router-dom";

export default function VerifyCode() {
    return (
        
                <main className="fixed inset-0 overflow-hidden">
                    <div className="relative h-full w-full bg-gradient-to-br from-[#6B1F78] via-[#424996] to-[#0B82BE]">
                        <div className="absolute top-6 left-6 text-white/90 font-semibold">Logo</div>
        
                       
        
                        <div className="relative z-10 w-full max-w-2xl mx-auto pt-24 px-4 text-white">
                            <h1 className="text-4xl md:text-5xl font-bold text-center">Enter your code</h1>
                            <div className="text-center mt-4 text-white/90">We have sent a verification code to your email. Please enter it below to change your password.
                           
                            
                            </div>
                            <section className="mt-10 md:mt-12 rounded-2xl bg-white/12 backdrop-blur-md ring-1 ring-white/25 shadow-[0_30px_60px_-12px_rgba(0,0,0,.45)] p-6 md:p-8 text-white/90 relative">
                            <div className="text-center font-semibold text-lg mb-8">Enter your 4-digits code</div>
                            <div className="flex justify-center gap-6">
                            <input 
                            type="text"
                            maxLength={1}
                            pattern="[0-9]*"
                            inputMode="numeric"
                            className="w-12 h-12 bg-white/70 rounded-2xl text-[#351F78] text-center text-lg font-bold "/>
                            <input 
                            type="text"
                            maxLength={1}
                            pattern="[0-9]*"
                            inputMode="numeric"
                            className="w-12 h-12 bg-white/70 rounded-2xl text-[#351F78] text-center text-lg font-bold "/>
                            <input 
                            type="text"
                            maxLength={1}
                            pattern="[0-9]*"
                            inputMode="numeric"
                            className="w-12 h-12 bg-white/70 rounded-2xl text-[#351F78] text-center text-lg font-bold "/>
                            <input
                            type="text"
                            maxLength={1}
                            pattern="[0-9]*"
                            inputMode="numeric"
                             className="w-12 h-12 bg-white/70 rounded-2xl text-[#351F78] text-center text-lg font-bold "/>
                            </div>
                            <h4 className="text-center text-sm mt-8 text-white/90">Didn't receive the code? <span className="text-[#FF6A6A] cursor-pointer">Resend</span></h4>
                            <Link to="/update-password" className="text-[#351F78] hover:underline ">
                            <button className="mt-10 w-full bg-[#351F78] hover:bg-[#4e3196] text-white font-semibold py-3 rounded-2xl transition-colors duration-300">Verify</button>
                            </Link>
                            
                                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/10 to-white/30" />
                                </section>
                        </div>
                    </div>
                </main>
        
    )
}
