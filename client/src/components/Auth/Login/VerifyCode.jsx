import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { forgotPassword } from "../../../services/passwordService";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";

export default function VerifyCode() {
    const { user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email) {
      setMessage("⚠️ Please enter your email.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
    await forgotPassword(user?.token, { email });
      setMessage("✅ Verification code sent to your email! Please enter it below to change your password.");
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Failed to send code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="fixed inset-0 overflow-hidden">
      <div className="relative h-full w-full bg-gradient-to-br from-[#6B1F78] via-[#424996] to-[#0B82BE]">
        <div className="absolute top-6 left-6 text-white/90 font-semibold">
          Logo
        </div>

        <div className="relative z-10 w-full max-w-2xl mx-auto pt-20 px-4 text-white">
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            Enter your email addres
          </h1>

          <div className="flex text-center mt-8 w-full bg-white max-w-md mx-auto block rounded-full px-4 py-2 text-[#351F78] font-medium focus:outline-none">
            <input
              type="email"
              placeholder="Email address"
              className=""
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleSendCode}
              disabled={loading}
              className=" w-10 h-10 bg-[#351F78] ml-44 hover:bg-[#4e3196] text-white text-center pl-3  font-semibold py-2 rounded-full transition-colors duration-300"
            >
              {loading ? "..." : <IoIosArrowForward />}
            </button>
          </div>
          {message && <p className="text-center mt-2 text-sm">{message}</p>}

          <section className="mt-10 md:mt-8 rounded-2xl bg-white/12 backdrop-blur-md ring-1 ring-white/25 shadow-[0_30px_60px_-12px_rgba(0,0,0,.45)] p-6 md:p-8 text-white/90 relative">
            <div className="text-center font-semibold text-lg mb-8">
              Enter your 6-digits code
            </div>
            <div className="flex justify-center gap-6">
              {Array(6)
                .fill(0)
                .map((_, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    className="w-12 h-12 bg-white/70 rounded-2xl text-[#351F78] text-center text-lg font-bold"
                  />
                ))}
            </div>
            <h4 className="text-center text-sm mt-8 text-white/90">
              Didn't receive the code?{" "}
              <span 
                onClick={handleSendCode} 
              className="text-[#FF6A6A] cursor-pointer">Resend</span>
            </h4>
            <Link
              to="/update-password"
              className="text-[#351F78] hover:underline "
            >
              <button
            
               className="mt-10 w-full bg-[#351F78] hover:bg-[#4e3196] text-white font-semibold py-3 rounded-2xl transition-colors duration-300">
                Verify
              </button>
            </Link>

            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/10 to-white/30" />
          </section>
        </div>
      </div>
    </main>
  );
}
