import {
	BadgePercent,
	Boxes,
	ChevronDown,
	CircleHelp,
	Heart,
	LayoutDashboard,
	ShieldCheck,
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { AuthUser } from "../types";

type Props = {
	categories: string[];
	showFavorites: boolean;
	setShowFavorites: Dispatch<SetStateAction<boolean>>;
	favoriteIds: number[];
	setCategoryFilter: Dispatch<SetStateAction<string>>;
	adminUser: AuthUser | null;
	isAdmin: boolean;
};

export function CatalogSidebar({
	categories,
	showFavorites,
	setShowFavorites,
	favoriteIds,
	setCategoryFilter,
	adminUser,
	isAdmin,
}: Props) {
	return (

		<aside className="flex w-full shrink-0 flex-col border-b border-[var(--line)] bg-white md:min-h-screen md:w-[244px] md:border-b-0 md:border-r">
			<div className="flex items-center gap-3 px-6 py-6">
				<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--green)] text-white">
					<Boxes size={19} strokeWidth={2.2} />
				</div>
				<div>
					<p className="text-[15px] font-bold tracking-[-0.03em]">
						fieldnotes
					</p>
					<p className="text-[11px] text-[var(--muted)]">
						PRODUCT STUDIO
					</p>
				</div>
				<button
					aria-label="Switch workspace"
					className="ml-auto rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--canvas)]"
				>
					<ChevronDown size={16} />
				</button>
			</div>

			<div className="px-4 pt-3">
				<p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#a2aaa4]">
					Workspace
				</p>
				<nav className="space-y-1">
					<a
						className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
							!showFavorites
								? "bg-[#edf4ee] font-semibold text-[var(--green-dark)]"
								: "text-[#68736c] hover:bg-[var(--canvas)]"
						}`}
						href="#catalog"
						onClick={() => setShowFavorites(false)}
					>
						<LayoutDashboard size={17} />
						Overview
					</a>
					<button
						aria-pressed={showFavorites}
						className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium ${
							showFavorites
								? "bg-[#edf4ee] text-[var(--green-dark)]"
								: "text-[#68736c] hover:bg-[var(--canvas)]"
						}`}
						onClick={() => setShowFavorites(true)}
						type="button"
					>
						<Heart size={17} />
						Favorites
						<span className="ml-auto rounded-full bg-[#f0f2ee] px-2 py-0.5 text-[11px] text-[#657169]">
							{favoriteIds.length}
						</span>
					</button>
					<a
						className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#68736c] hover:bg-[var(--canvas)]"
						href="#insights"
					>
						<BadgePercent size={17} />
						Insights
					</a>
				</nav>
			</div>

			<div className="mt-8 hidden px-4 md:block">
				<p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#a2aaa4]">
					Collections
				</p>
				<div className="space-y-1">
					{categories.slice(0, 5).map((category, index) => (
						<button
							key={category}
							onClick={() => setCategoryFilter(category)}
							className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-[#68736c] hover:bg-[var(--canvas)]"
						>
							<span
								className={`h-2 w-2 rounded-full ${
									index % 3 === 0
										? "bg-[#c58d5b]"
										: index % 3 === 1
											? "bg-[#7ba388]"
											: "bg-[#8497ad]"
								}`}
							/>
							<span className="truncate">{category}</span>
						</button>
					))}
					{categories.length === 0 && (
						<p className="px-3 py-2 text-xs text-[#9aa29c]">
							Categories appear here
						</p>
					)}
				</div>
			</div>

			<div className="mt-auto hidden p-4 md:block">
				<div className="rounded-2xl bg-[#f5f6f2] p-4">
					<div className="mb-2 flex items-center gap-2 text-[var(--green)]">
						<CircleHelp size={16} />
						<span className="text-xs font-semibold">
							Need a hand?
						</span>
					</div>
					<p className="text-xs leading-5 text-[#77817b]">
						Your catalog is connected directly to the Product
						Catalog API.
					</p>
				</div>
				<div className="mt-4 flex items-center gap-3 px-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dce8df] text-xs font-bold text-[var(--green-dark)]">
						PS
					</div>
					<div>
						<p className="text-xs font-semibold">
							{adminUser?.email ?? "Catalog visitor"}
						</p>
						<p className="text-[11px] text-[var(--muted)]">
							{isAdmin ? "Administrator" : "Read-only access"}
						</p>
					</div>
					{isAdmin && (
						<ShieldCheck
							className="ml-auto text-[var(--green)]"
							size={16}
						/>
					)}
				</div>
			</div>
		</aside>
	);
}
