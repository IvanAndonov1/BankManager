import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { resetPassword } from "../../../services/passwordService";

export default function UpdatePassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, code } = location.state || {}; 

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage("⚠️ Please fill in both fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("⚠️ Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
     
      await resetPassword(null, { email, code, newPassword });
      setMessage("✅ Password successfully reset!");
      setTimeout(() => navigate("/login"), 1500); 
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Failed to reset password. Check your code or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="fixed inset-0 overflow-hidden">
      <div className="relative h-full w-full bg-gradient-to-br from-[#6B1F78] via-[#424996] to-[#0B82BE]">
        <div className="absolute top-6 left-6 text-white/90 font-semibold">Logo</div>

        <div className="relative z-10 w-full max-w-2xl mx-auto pt-24 px-4 text-white">
          <h1 className="text-4xl md:text-5xl font-bold text-center">Update Your Password</h1>

          <section className="mt-10 rounded-2xl bg-white/12 backdrop-blur-md ring-1 ring-white/25 shadow-lg p-6 text-white/90 relative">
            <label className="block">
              <span className="block text-sm text-white/85">New Password</span>
              <div className="mt-2 flex items-center border-b focus-within:border-white pb-2">
                <input
                  type="password"
                  placeholder="New password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-transparent outline-none placeholder-white/60"
                />
              </div>

              <span className="block text-sm text-white/85 mt-8">Confirm Password</span>
              <div className="mt-2 flex items-center border-b focus-within:border-white pb-2">
                <input
                  type="password"
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent outline-none placeholder-white/60"
                />
              </div>
            </label>

            {message && <p className="text-sm text-center mt-4">{message}</p>}

            <button
              onClick={handleReset}
              disabled={loading}
              className="mt-10 w-full bg-[#351F78] hover:bg-[#4e3196] text-white font-semibold py-3 rounded-2xl transition-colors duration-300"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>

            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/10 to-white/30" />
          </section>
        </div>
      </div>
    </main>
  );
}


