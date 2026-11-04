type FormFieldProps = {
	label: string;
	name: string;
	type?: string;
	required?: boolean;
	defaultValue?: string | number;
	min?: string;
	step?: string;
	list?: string;
};

export function FormField({
	label,
	name,
	type = "text",
	required = false,
	defaultValue,
	min,
	step,
	list,
}: FormFieldProps) {
	return (
		<label className="block text-xs font-medium text-[#59665e]">
			{label}
			<input
				className="mt-1.5 w-full rounded-xl border border-[var(--line)] px-3 py-2.5 text-sm outline-none focus:border-[#a7c3ad]"
				defaultValue={defaultValue}
				list={list}
				min={min}
				name={name}
				required={required}
				step={step}
				type={type}
			/>
		</label>
	);
}
