import { Link } from "react-router-dom";
import lines from "../../assets/welcome-lines.svg";
import chip from "../../assets/chip.svg";

export default function Home() {
  return (
    <main className="fixed inset-0 overflow-hidden">
      <div className="relative w-full h-full bg-gradient-to-br from-[#6a1f78] via-[#444895] to-[#0b82be]">
        <Link
          to="/register"
          className="cursor-pointer absolute top-8 right-6 z-30 px-7 pt-2 h-10 rounded-full text-white font-medium
            bg-white/10 
            backdrop-blur-xl 
            border border-white/20 
            hover:bg-white/20
            before:absolute before:inset-0 
            before:rounded-full 
            before:bg-gradient-to-t before:from-white/20 before:to-transparent 
            before:border-t before:border-white/40 
            overflow-hidden"
        >
          Sign in
        </Link>

        <div
          className="absolute -left-20 -top-24 w-64 h-64 rounded-full
                        bg-[radial-gradient(circle_at_30%_30%,#8a2c9a, #5b1d91_60%, #2b0b3f_100%)]
                        opacity-90"
        />
        <span className="absolute left-12 top-16 text-white/90 font-semibold text-lg">
          Logo
        </span>

        <div
          className="absolute left-14 bottom-20 w-12 h-12 rounded-full
                        bg-[radial-gradient(circle_at_30%_30%,#8a2c9a,#5b1d91_60%,#2b0b3f)]"
        />
        <div
          className="absolute right-[18%] top-[44%] w-8 h-8 rounded-full
                        bg-[radial-gradient(circle_at_30%_30%,#8a2c9a,#5b1d91_60%,#2b0b3f)]"
        />
        <div
          className="absolute -left-10 -top-10 w-48 h-48 rounded-full
						bg-[radial-gradient(ellipse_53.95%_53.96%_at_46.56%_46.16%,_#A5438B_0%,_#351F78_100%)]"
        />

        <img
          src={lines}
          alt="lines"
          className="absolute inset-0 w-2xl h-md object-cover opacity-50"
        />

        <section className="relative z-20 pl-16 pt-64 max-w-xl text-white">
          <h1 className="text-[44px] leading-tight font-semibold drop-shadow-[0_4px_20px_rgba(0,0,0,.25)]">
            Welcome page
          </h1>
          <p className="mt-4 text-white/90 text-md leading-6 font-medium pr-4">
            A short description of what this website is about. A short
            description of what this website is about.
          </p>
          <Link
            to="/login"
            className="cursor-pointer mt-6 inline-flex items-center justify-center px-5 h-10 rounded-full
            bg-white/10 
            backdrop-blur-xl 
            border border-white/20 
            hover:bg-white/20
            before:absolute before:inset-0 
            before:rounded-3xl 
            before:bg-gradient-to-t before:from-white/20 before:to-transparent 
            before:border-t before:border-white/40 
            overflow-hidden"
          >
            Get Started
          </Link>
        </section>
        
		
        <div className="pointer-events-none absolute right-[20%] top-[20%] -rotate-[20deg] py-6">
          <div
            className="relative -rotate-[20deg] -translate-y-4 translate-x-24 w-[320px] h-52 
                          bg-gradient-to-br from-white/0 to-white/40 rounded-3xl
						  border border-white/20 
						  outline outline-4 outline-white/0 backdrop-blur-xl"
          >
            <div className="absolute right-4 top-3 text-white/70 text-sm font-semibold">
              VISA
            </div>
            <div className="absolute left-5 top-6 w-18 h-16 rotate-[15deg]" >
				<img src={chip} alt="chip" className="w-full h-full object-cover"/>
			</div>

            <div className="absolute left-5 bottom-16 text-white/85 tracking-[.1em] text-lg font-bold">
              5456 5678 9000 0000
            </div>
            <div className="absolute left-6 bottom-8 text-white/80">
              Customer Name
            </div>
          </div>

          <div
            className="relative mt-6 w-[320px] h-52 rounded-2xl
                          bg-white/10 
            backdrop-blur-xl 
            border border-white/20 
            hover:bg-white/20
            before:absolute before:inset-0 
            before:rounded-2xl 
            before:bg-gradient-to-t before:from-white/20 before:to-transparent 
            before:border-t before:border-white/40 
            overflow-hidden"
          >
            <div className="absolute right-5 top-5 text-white/70 text-base font-semibold">
              VISA
            </div>
             <div className="absolute left-5 top-6 w-18 h-16 rotate-[15deg]" >
				<img src={chip} alt="chip" className="w-full h-full object-cover"/>
			</div>
            <div className="absolute left-6 bottom-16 text-white/90 tracking-[.1em] text-xl font-bold">
              1234 5678 9000 0000
            </div>
            <div className="absolute left-6 bottom-8 text-white/80">
              Customer Name
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_62%,rgba(0,0,0,.25))]" />
      </div>
    </main>
  );
}
