import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { forgotPassword, resetPassword } from "../../../services/passwordService";
import { useState, useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";

export default function VerifyCode() {
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(Array(6).fill("")); 
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const navigate = useNavigate();

  const handleSendCode = async () => {
    if (!email) {
      setMessage("⚠️ Please enter your email.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await forgotPassword(user?.token, { email });
      setMessage("✅ Verification code sent to your email!");
      setCodeSent(true);
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Failed to send code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (value, idx) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[idx] = value;
      setCode(newCode);
    }
  };

  const handleVerify = async () => {
    const enteredCode = code.join("");
    if (enteredCode.length < 6) {
      setMessage("⚠️ Please enter all 6 digits.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
   
      await resetPassword(null, {
        email,
        code: enteredCode,
        newPassword: "TEMP_VALIDATION_PASS"
      });

    
      navigate("/update-password", { state: { email, code: enteredCode } });
      if (!email || !code) {
  setMessage("⚠️ Missing verification data. Please start the reset process again.");
  return;
}

    } catch (err) {
      console.error(err);
      setMessage("❌ Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="fixed inset-0 overflow-hidden">
      <div className="relative h-full w-full bg-gradient-to-br from-[#6B1F78] via-[#424996] to-[#0B82BE]">
        <div className="absolute top-6 left-6 text-white/90 font-semibold">Logo</div>

        <div className="relative z-10 w-full max-w-2xl mx-auto pt-20 px-4 text-white">
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            Enter your email address
          </h1>

          <div className="flex text-center mt-8 w-full bg-white max-w-md mx-auto block rounded-full px-4 py-2 text-[#351F78] font-medium">
            <input
              type="email"
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent outline-none"
            />
            <button
              onClick={handleSendCode}
              disabled={loading}
              className="w-10 h-10 bg-[#351F78] ml-2 hover:bg-[#4e3196] text-white rounded-full transition-colors duration-300 flex items-center justify-center"
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
              <div className="flex justify-center gap-6">
                {code.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(e.target.value, idx)}
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
              <button
                onClick={handleVerify}
                disabled={loading}
                className="mt-10 w-full bg-[#351F78] hover:bg-[#4e3196] text-white font-semibold py-3 rounded-2xl transition-colors duration-300"
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
