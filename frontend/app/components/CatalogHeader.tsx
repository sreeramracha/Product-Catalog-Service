import { LoaderCircle, LogIn, LogOut, Plus, ShieldCheck } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

type Props = {
	isAdmin: boolean;
	authChecking: boolean;
	logoutAdmin: () => void;
	setIsCreateOpen: Dispatch<SetStateAction<boolean>>;
	setIsLoginOpen: Dispatch<SetStateAction<boolean>>;
};

export function CatalogHeader({
	isAdmin,
	authChecking,
	logoutAdmin,
	setIsCreateOpen,
	setIsLoginOpen,
}: Props) {
	return (

		<header className="flex items-center justify-between border-b border-[var(--line)] bg-white px-5 py-4 sm:px-8">
			<div>
				<p className="text-xs text-[#929b95]">
					Workspace / Catalog
				</p>
				<h1 className="mt-1 text-[15px] font-semibold tracking-[-0.02em]">
					Overview
				</h1>
			</div>
			<div className="flex items-center gap-3">
				<span className="hidden items-center gap-2 rounded-full bg-[#f2f5f1] px-3 py-1.5 text-[11px] font-medium text-[#627168] sm:flex">
					<span className="h-1.5 w-1.5 rounded-full bg-[#58a66f]" />
					API connected
				</span>
				{isAdmin ? (
					<>
						<span className="hidden items-center gap-1.5 rounded-full bg-[#edf4ee] px-3 py-1.5 text-[11px] font-semibold text-[var(--green)] sm:flex">
							<ShieldCheck size={13} /> Admin
						</span>
						<button
							onClick={logoutAdmin}
							className="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 text-xs font-semibold text-[#56635b] hover:bg-[#fafbf8]"
						>
							<LogOut size={14} /> Sign out
						</button>
						<button
							onClick={() => setIsCreateOpen(true)}
							className="flex items-center gap-2 rounded-xl bg-[var(--green)] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--green-dark)]"
						>
							<Plus size={15} />
							Add product
						</button>
					</>
				) : (
					<button
						disabled={authChecking}
						onClick={() => setIsLoginOpen(true)}
						className="flex items-center gap-2 rounded-xl bg-[var(--green)] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--green-dark)] disabled:opacity-60"
					>
						{authChecking ? (
							<LoaderCircle
								className="animate-spin"
								size={14}
							/>
						) : (
							<LogIn size={14} />
						)}
						Admin sign in
					</button>
				)}
			</div>
		</header>
	);
}
