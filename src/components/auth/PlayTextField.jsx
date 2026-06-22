export function PlayTextField({
  label,
  id,
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  autoComplete,
  required,
  ...rest
}) {
  const controlled = value !== undefined && onChange !== undefined
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-normal text-play-foreground">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        {...(controlled ? { value, onChange } : {})}
        autoComplete={autoComplete}
        required={required}
        className="placeholder:text-play-muted w-full rounded-play-input border border-play-border bg-transparent px-4 py-3 text-play-foreground outline-none transition focus-visible:border-play-ring focus-visible:ring-2 focus-visible:ring-play-ring/40"
        {...rest}
      />
    </div>
  )
}
