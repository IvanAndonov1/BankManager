import { Link } from "react-router";

export default function UpdatePassword() {


    return (
        <main className="fixed inset-0 overflow-hidden">
                    <div className="relative h-full w-full bg-gradient-to-br from-[#6B1F78] via-[#424996] to-[#0B82BE]">
                        <div className="absolute top-6 left-6 text-white/90 font-semibold">Logo</div>
        
                       
        
                        <div className="relative z-10 w-full max-w-2xl mx-auto pt-24 px-4 text-white">
                            <h1 className="text-4xl md:text-5xl font-bold text-center">Update Your Password</h1>
                            <section className="mt-10 md:mt-12 rounded-2xl bg-white/12 backdrop-blur-md ring-1 ring-white/25 shadow-[0_30px_60px_-12px_rgba(0,0,0,.45)] p-6 md:p-8 text-white/90 relative">
                            <label className="block">
								<span className="block text-sm text-white/85">Password</span>
								<div className={`mt-2 flex items-center border-b  focus-within:border-white pb-2`}>
									<input
										type="text"
										name="password"
										className="w-full bg-transparent outline-none placeholder-white/60"
										defaultValue=""
										autoComplete="current-password"
										
									/>
									
								</div>

                                	<span className="block text-sm text-white/85 mt-16">Repeat Password</span>
								<div className={`mt-2 flex items-center border-b  focus-within:border-white pb-2`}>
									<input
										type="text"
										name="password"
										className="w-full bg-transparent outline-none placeholder-white/60"
										defaultValue=""
										autoComplete="current-password"
										
									/>
									
								</div>
								
							</label>
                            <Link to="/login" className="text-[#351F78] hover:underline ">
                            <button className="mt-10 w-full bg-[#351F78] hover:bg-[#4e3196] text-white font-semibold py-3 rounded-2xl transition-colors duration-300">Update Password</button>
                            </Link>
                            </section>
                        </div>
                    </div>  
                </main>

    )
}