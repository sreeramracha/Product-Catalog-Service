import type { ReactNode } from "react";

type StatCardProps = {
	label: string;
	value: string;
	detail: string;
	icon: ReactNode;
	accent: "green" | "sand" | "blue";
	id?: string;
};

export function StatCard({
	label,
	value,
	detail,
	icon,
	accent,
	id,
}: StatCardProps) {
	const styles = {
		green: "bg-[#edf4ee] text-[#477756]",
		sand: "bg-[#f7f1e9] text-[#a4784b]",
		blue: "bg-[#edf1f5] text-[#64809b]",
	};

	return (
		<article
			id={id}
			className="rounded-2xl border border-[var(--line)] bg-white p-5"
		>
			<div className="flex items-center justify-between">
				<p className="text-xs font-medium text-[#77827a]">{label}</p>
				<span
					className={`flex h-8 w-8 items-center justify-center rounded-xl ${styles[accent]}`}
				>
					{icon}
				</span>
			</div>
			<p className="mt-4 truncate text-2xl font-semibold tracking-[-0.045em]">
				{value}
			</p>
			<p className="mt-1 text-[11px] text-[#9aa29c]">{detail}</p>
		</article>
	);
}
