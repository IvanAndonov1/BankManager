export default function Home() {
	return (
		<main className="fixed inset-0 overflow-hidden">
			<div className="relative w-full h-full bg-gradient-to-br from-[#6a1ea1] via-[#4a46c1] to-[#0b84b9]">

				<button className="cursor-pointer absolute top-6 right-6 z-30 px-6 h-10 rounded-full text-white font-medium
                           bg-gradient-to-r from-[#351F78] to-[#0b84b9] ring-1 ring-white/20
                           shadow-[0_8px_24px_-6px_rgba(0,0,0,.35)]">
					Sign in
				</button>

				<div className="absolute -left-20 -top-24 w-64 h-64 rounded-full
                        bg-[radial-gradient(circle_at_30%_30%,#8a2c9a, #5b1d91_60%, #2b0b3f_100%)]
                        opacity-90" />
				<span className="absolute left-12 top-16 text-white/90 font-semibold text-lg">Logo</span>

				<div className="absolute left-14 bottom-20 w-12 h-12 rounded-full
                        bg-[radial-gradient(circle_at_30%_30%,#8a2c9a,#5b1d91_60%,#2b0b3f)]" />
				<div className="absolute right-[18%] top-[44%] w-8 h-8 rounded-full
                        bg-[radial-gradient(circle_at_30%_30%,#8a2c9a,#5b1d91_60%,#2b0b3f)]" />

				<div className="pointer-events-none absolute right-[10%] top-[-10%] w-[900px] h-[900px]">
					<div className="absolute inset-0 rounded-full border border-white/18" />
					<div className="absolute inset-8 rounded-full border border-white/14" />
					<div className="absolute inset-16 rounded-full border border-white/10" />
				</div>

				<section className="relative z-20 pl-16 pt-64 max-w-xl text-white">
					<h1 className="text-[44px] leading-tight font-bold drop-shadow-[0_4px_20px_rgba(0,0,0,.25)]">
						Welcome page
					</h1>
					<p className="mt-4 text-white/90 text-[15px] leading-6">
						A short description of what this website is about. A short description
						of what this website is about.
					</p>
					<button className="cursor-pointer mt-6 inline-flex items-center justify-center px-5 h-10 rounded-full
                             bg-white/22 text-white ring-1 ring-white/35 backdrop-blur
                             shadow-[inset_0_0_0_1px_rgba(255,255,255,.15)]
                             hover:bg-white/30">
						Get Started
					</button>
				</section>

				<div className="pointer-events-none absolute right-[12%] top-[18%] rotate-[24deg]">
					<div className="relative -rotate-[10deg] -translate-y-4 translate-x-24 w-64 h-40 rounded-xl
                          bg-white/14 backdrop-blur-md ring-1 ring-white/30
                          shadow-[0_30px_60px_-10px_rgba(0,0,0,.55)]">
						<div className="absolute right-4 top-3 text-white/70 text-sm font-semibold">VISA</div>
						<div className="absolute left-5 top-6 w-8 h-8 rounded-md bg-white/25" />
						<div className="absolute left-5 bottom-6 text-white/85 tracking-[.2em] text-lg font-semibold">
							5456 5678 9000 0000
						</div>
						<div className="absolute right-4 bottom-4 text-white/60 text-xs">Customer Name</div>
					</div>

					<div className="relative mt-6 w-[380px] h-56 rounded-2xl
                          bg-white/16 backdrop-blur-md ring-1 ring-white/30
                          shadow-[0_40px_80px_-16px_rgba(0,0,0,.6)]">
						<div className="absolute right-5 top-5 text-white/70 text-base font-semibold">VISA</div>
						<div className="absolute left-6 top-8 w-10 h-10 rounded-md bg-white/25" />
						<div className="absolute left-6 bottom-16 text-white/90 tracking-[.22em] text-2xl font-semibold">
							1234 5678 9000 0000
						</div>
						<div className="absolute left-6 bottom-8 text-white/80">Customer Name</div>
					</div>
				</div>

				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_62%,rgba(0,0,0,.25))]" />
			</div>
		</main>
	);
}