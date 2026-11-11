import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/ui/button";
import { ArrowLeft, Mail, Lock, Phone, Apple } from "lucide-react";
import { supabase } from "../../lib/supabase";

type Method = "choose" | "email" | "phone" | "phone-otp";

export function Login() {
  const navigate = useNavigate();
  const [method, setMethod] = useState<Method>("choose");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    if (method === "choose") navigate("/");
    else { setMethod("choose"); setError(""); }
  };

  const handleEmailAuth = async () => {
    if (!email.trim() || !password.trim()) return setError("Please fill in all fields");
    setLoading(true); setError("");
    const fn = isSignUp
      ? supabase.auth.signUp({ email, password })
      : supabase.auth.signInWithPassword({ email, password });
    const { error } = await fn;
    setLoading(false);
    if (error) return setError(error.message);
    navigate("/swipe");
  };

  const handleSendOtp = async () => {
    if (!phone.trim()) return setError("Please enter your phone number");
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithOtp({ phone });
    setLoading(false);
    if (error) return setError(error.message);
    setMethod("phone-otp");
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) return setError("Please enter the code");
    setLoading(true); setError("");
    const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: "sms" });
    setLoading(false);
    if (error) return setError(error.message);
    navigate("/swipe");
  };

  const handleGoogle = async () => {
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/swipe` },
    });
    if (error) { setError(error.message); setLoading(false); }
  };

  const handleApple = async () => {
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: { redirectTo: `${window.location.origin}/swipe` },
    });
    if (error) { setError(error.message); setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background safe-area-inset">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-6 pt-safe"
      >
        <button onClick={handleBack} className="p-2 -ml-2 active:scale-95 transition-transform">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-sm text-muted-foreground">
          {method === "choose" ? "Sign In" : method === "email" ? "Email" : method === "phone" ? "Phone" : "Verify Code"}
        </span>
        <div className="w-6" />
      </motion.div>

      <div className="flex-1 flex flex-col px-6 pb-safe">
        <AnimatePresence mode="wait">

          {/* Choose method */}
          {method === "choose" && (
            <motion.div
              key="choose"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto gap-3"
            >
              <h1 className="text-3xl mb-2">Welcome to Scillet</h1>
              <p className="text-muted-foreground mb-6">Choose how you'd like to sign in</p>

              <button
                onClick={handleApple}
                disabled={loading}
                className="w-full flex items-center gap-3 px-5 py-4 bg-black text-white rounded-2xl font-medium active:scale-[0.98] transition-transform disabled:opacity-50"
              >
                <Apple className="w-5 h-5" />
                <span className="flex-1 text-center">Continue with Apple</span>
              </button>

              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center gap-3 px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl font-medium active:scale-[0.98] transition-transform disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="flex-1 text-center">Continue with Google</span>
              </button>

              <button
                onClick={() => setMethod("phone")}
                className="w-full flex items-center gap-3 px-5 py-4 bg-foreground/5 rounded-2xl font-medium active:scale-[0.98] transition-transform"
              >
                <Phone className="w-5 h-5" />
                <span className="flex-1 text-center">Continue with Phone</span>
              </button>

              <button
                onClick={() => setMethod("email")}
                className="w-full flex items-center gap-3 px-5 py-4 bg-foreground/5 rounded-2xl font-medium active:scale-[0.98] transition-transform"
              >
                <Mail className="w-5 h-5" />
                <span className="flex-1 text-center">Continue with Email</span>
              </button>

              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            </motion.div>
          )}

          {/* Email */}
          {method === "email" && (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
                <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mb-6">
                  <Mail className="w-8 h-8" />
                </div>
                <h1 className="text-3xl mb-6">{isSignUp ? "Create account" : "Welcome back"}</h1>

                <div className="space-y-3 mb-6">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="Email"
                    className="w-full px-4 py-4 bg-foreground/5 rounded-2xl outline-none focus:ring-2 focus:ring-foreground/20 transition-all text-base"
                    autoFocus
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleEmailAuth()}
                    placeholder="Password"
                    className="w-full px-4 py-4 bg-foreground/5 rounded-2xl outline-none focus:ring-2 focus:ring-foreground/20 transition-all text-base"
                  />
                </div>

                {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

                <button
                  onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
                  className="text-sm text-muted-foreground mb-6"
                >
                  {isSignUp ? "Already have an account? Sign in" : "No account? Sign up"}
                </button>
              </div>

              <Button size="lg" className="w-full rounded-full" onClick={handleEmailAuth} disabled={loading}>
                {loading ? "..." : isSignUp ? "Create Account" : "Sign In"}
              </Button>
            </motion.div>
          )}

          {/* Phone */}
          {method === "phone" && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
                <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mb-6">
                  <Phone className="w-8 h-8" />
                </div>
                <h1 className="text-3xl mb-2">Your number</h1>
                <p className="text-muted-foreground mb-6">We'll text you a verification code</p>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-4 bg-foreground/5 rounded-2xl outline-none focus:ring-2 focus:ring-foreground/20 transition-all text-base"
                  autoFocus
                />
                {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
              </div>

              <Button size="lg" className="w-full rounded-full" onClick={handleSendOtp} disabled={loading}>
                {loading ? "Sending..." : "Send Code"}
              </Button>
            </motion.div>
          )}

          {/* OTP verify */}
          {method === "phone-otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
                <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mb-6">
                  <Lock className="w-8 h-8" />
                </div>
                <h1 className="text-3xl mb-2">Enter code</h1>
                <p className="text-muted-foreground mb-6">Sent to {phone}</p>

                <input
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full px-4 py-4 bg-foreground/5 rounded-2xl outline-none focus:ring-2 focus:ring-foreground/20 transition-all text-base text-center text-2xl tracking-widest"
                  autoFocus
                />
                {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

                <button onClick={handleSendOtp} className="text-sm text-muted-foreground mt-4">
                  Resend code
                </button>
              </div>

              <Button size="lg" className="w-full rounded-full" onClick={handleVerifyOtp} disabled={loading}>
                {loading ? "Verifying..." : "Verify"}
              </Button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
