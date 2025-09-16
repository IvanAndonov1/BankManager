import { useMemo, useState } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";
import { Link } from "react-router-dom";


export default function Register() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({});

  const steps = useMemo(
    () => [
      { key: "one", component: StepOne },
      { key: "two", component: StepTwo },
      { key: "three", component: StepThree },
      { key: "four", component: StepFour },
    ],
    []
  );

  const StepComponent = steps[step].component;
  const progress = ((step + 1) / steps.length) * 100;
  const isLast = step === steps.length - 1;

  function handleChange(patch) {
    setValues((v) => ({ ...v, ...patch }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Register submit values:", values);
    // TODO: API call
  }

  return (
    <div
      className="min-h-screen flex items-start justify-center pt-16 bg-gradient-to-br from-[#6B1F78] via-[#424996] to-[#0B82BE]"
      
    >
    
      <div className="w-full max-w-3xl relative z-10">
        <div className="text-white text-3xl font-semibold text-center mb-6">
          Register
        </div>

        <div className="h-2 w-2/3 mx-auto bg-white/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#351F78] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="relative mt-6">
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="mx-auto rounded-xl bg-white/15 backdrop-blur-md shadow-xl text-white p-8 w-[680px] max-w-[90vw] border border-white/20"
          >
            <StepComponent values={values} onChange={handleChange} />

            {isLast && (
              <div className="mt-6 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-6 h-10 rounded-full bg-[#351F78] hover:opacity-95 text-white font-medium"
                >
                  Register
                </button>
              </div>
            )}

            <div className="mt-6 text-center text-white/90 text-sm">
              Already have an account?{" "}
              <Link className="underline" to="/login">
                Login
              </Link>
            </div>
          </form>

          <button
            type="button"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            aria-label="Previous"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-5 h-5"
            >
              <path
                d="M15 18l-6-6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            type="button"
            className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
            onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
            aria-label="Next"
          >
            {!isLast ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-5 h-5"
              >
                <path
                  d="M9 6l6 6-6 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-5 h-5"
              >
                <path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
