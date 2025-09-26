import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { forgotPassword, verifyCode } from "../../../services/passwordService";
import { useRef, useState } from "react";
import logoWhite from "../../../assets/white-logo.svg";

export default function VerifyCode() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(Array(6).fill(""));
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const navigate = useNavigate();
  const inputRef = useRef(null);
  const CODE_LENGTH = 6;

  const focusInput = () => inputRef.current?.focus();
  
  const handleSendCode = async () => {
    if (!email) return setMessage("⚠️ Please enter your email.");

    setLoading(true);
    setMessage("");

    try {
      const res = await forgotPassword({ email });
      if (res.ok) {
        setMessage("✅ Verification code sent to your email!");
        setCodeSent(true);
        setCode("");
      } else {
        setMessage(res.error || "⚠️ Failed to send code.");
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Failed to send code. Try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleCodeChange = (e) => {
      const value = e.target.value.replace(/\D/g, "").slice(0, CODE_LENGTH); 
    setCode(value);
    
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace" && code.length > 0) {
      setCode(code.slice(0, -1));
      e.preventDefault();
    }
  };


  const handleVerify = async () => {
    if (code.length < CODE_LENGTH) {
      setMessage("⚠️ Please enter all 6 digits.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await verifyCode({ email, code });
      

      if (res.ok) {
        navigate("/update-password", { state: { email, code } });
      } else {
        setMessage(res.error || "❌ Invalid or expired code.");
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="fixed inset-0 overflow-hidden">
      <span className="fixed top-6 left-6 flex flex-col items-end z-50 h-28 w-42">
                      <img src={logoWhite} alt="logo" className=" object-cover opacity-70" />
                </span>
      <div className="relative h-full w-full bg-gradient-to-br from-[#6B1F78] via-[#424996] to-[#0B82BE]">
    

        <div className="relative z-10 w-full max-w-2xl mx-auto pt-20 px-4 text-white">
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            Enter your email address
          </h1>

          <div className="flex text-center mt-8 w-full bg-white max-w-md mx-auto block rounded-full px-4 py-2 text-[#351F78] font-medium">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent outline-none"
            />
            <button
              onClick={handleSendCode}
              disabled={loading}
              className="w-10 h-10 bg-[#351F78] ml-2 hover:bg-[#4e3196] text-white rounded-full flex items-center justify-center"
            >
              {loading ? "..." : <IoIosArrowForward />}
            </button>
          </div>

          {message && <p className="text-center mt-2 text-sm">{message}</p>}

          {codeSent && (
            <section className="mt-10 rounded-2xl bg-white/12 backdrop-blur-md ring-1 ring-white/25 shadow-lg p-6 text-white/90 relative">
              <div className="text-center font-semibold text-lg mb-8">
                Enter your 6-digit code
              </div>
                            <div
                className="flex justify-center gap-4 cursor-text"
                onClick={focusInput}
              >
                {Array.from({ length: CODE_LENGTH }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-12 h-12 bg-white/70 rounded-2xl text-[#351F78] text-center text-lg font-bold flex items-center justify-center"
                  >
                    {code[idx] || ""}
                  </div>
                ))}
              </div>

             
              <input
                ref={inputRef}
                type="text"
                value={code}
                onChange={handleCodeChange}
                onKeyDown={handleKeyDown}
                maxLength={CODE_LENGTH}
                className="absolute opacity-0 pointer-events-none"
                autoFocus
              />

              <h4 className="text-center text-sm mt-8 text-white/90">
                Didn't receive the code?{" "}
                <span
                  onClick={handleSendCode}
                  className="text-[#FF6A6A] cursor-pointer"
                >
                  Resend
                </span>
              </h4>
              <button
                onClick={handleVerify}
                disabled={loading}
                className="mt-10 w-full bg-[#351F78] hover:bg-[#4e3196] text-white font-semibold py-3 rounded-2xl"
              >
                Verify
              </button>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
