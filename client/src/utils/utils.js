export function clamp0to100(n) {
	const x = Number(n) || 0;
	return Math.max(0, Math.min(100, x));
}

export function hslForScore(p) {
	const perc = clamp0to100(p);
	const hue = (perc / 100) * 120;
	return `hsl(${hue} 90% 45%)`;
}

export function fmtMoney(x, ccy = "EUR") {
	try {
		return new Intl.NumberFormat(undefined, { style: "currency", currency: ccy }).format(x);
	} catch {
		return `${x} ${ccy}`;
	}
}