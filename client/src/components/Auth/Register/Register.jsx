import { useMemo, useState } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";
import { Link, useNavigate } from "react-router-dom";
import { validateRegister, validateStep } from "../../../utils/validations";
import { registerUser } from "../../../services/userService";
import logoWhite from "../../../assets/white-logo.svg";

export default function Register() {
	const navigate = useNavigate();
	const [step, setStep] = useState(0);
	const [values, setValues] = useState({});
	const [errors, setErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState("");
	const [submitSuccess, setSubmitSuccess] = useState(false);

	const steps = useMemo(() => [
		{ key: "one", component: StepOne },
		{ key: "two", component: StepTwo },
		// { key: "three", component: StepThree },
		{ key: "four", component: StepFour }
	], []);

	const StepComponent = steps[step].component;
	const progress = ((step + 1) / steps.length) * 100;

	function handleChange(patch) {
		setValues((v) => ({ ...v, ...patch }));
		const changed = Object.keys(patch);
		setErrors((e) => {
			const copy = { ...e };
			changed.forEach((k) => delete copy[k]);
			return copy;
		});
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setSubmitError("");
		setSubmitSuccess(false);

		const allErrs = validateRegister(values);
		if (Object.keys(allErrs).length > 0) {
			setErrors(allErrs);
			setSubmitError("Please fix the highlighted fields.");
			return;
		}

		setSubmitting(true);
		try {
			const { confirmPassword, terms, ...payload } = values;

			registerUser(payload)
				.then(() => navigate('/login'));

			setSubmitSuccess(true);
		} catch (e) {
			setSubmitError(e.message || "Registration failed");
		} finally {
			setSubmitting(false);
		}
	}

	const isLast = step === steps.length - 1;

	function goNext() {
		const stepKey = steps[step].key;
		const { errors: stepErrs, hasErrors } = validateStep(values, stepKey);
		if (hasErrors) {
			setErrors((prev) => ({ ...prev, ...stepErrs }));
			setSubmitError("Please fix the highlighted fields.");
			return;
		}
		setSubmitError("");
		setStep((s) => Math.min(steps.length - 1, s + 1));
	}

	return (
		<div
			className="min-h-screen flex items-start justify-center pt-16"
			style={{ background: "linear-gradient(135deg, #5b1d77 0%, #0b82be 100%)" }}
		>
			<span className="fixed top-6 left-6 flex flex-col items-end z-50 h-28 w-42">
										  <img src={logoWhite} alt="logo" className=" object-cover opacity-70" />
								</span>
			<div className="w-full max-w-3xl">
				<div className="text-white text-3xl font-semibold text-center mb-6">Register</div>
				<div className="h-2 w-2/3 mx-auto bg-white/40 rounded-full overflow-hidden">
					<div
						className="h-full bg-[#351F78] transition-all"
						style={{ width: `${progress}%` }}
					/>
				</div>

				<div className="relative mt-6">
					<form
						onSubmit={handleSubmit}
						className="mx-auto rounded-xl bg-white/15 backdrop-blur-md shadow-xl text-white p-8 w-[680px] max-w-[90vw] border border-white/20"
					>
						<StepComponent values={values} onChange={handleChange} errors={errors} />

						{isLast && (
							<div className="mt-6 flex items-center justify-between">
								<div className="text-sm text-red-200">{submitError}</div>
								<div className="flex items-center gap-3">
									{submitSuccess && (
										<span className="text-green-200 text-sm">Registered successfully</span>
									)}
									<button
										type="submit"
										disabled={submitting}
										className="px-6 h-10 rounded-full bg-[#351F78] hover:opacity-95 disabled:opacity-60 text-white font-medium"
									>
										{submitting ? "Submitting..." : "Register"}
									</button>
								</div>
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
						className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
						disabled={step === 0}
						onClick={() => setStep((s) => Math.max(0, s - 1))}
						aria-label="Previous"
					>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
					</button>

					<button
						className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
						onClick={goNext}
						aria-label="Next"
					>
						{!isLast ? (
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
						) : (
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}