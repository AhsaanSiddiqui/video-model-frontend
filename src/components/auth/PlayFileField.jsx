export function PlayFileField({
  label,
  id,
  name,
  accept = 'image/*',
  onChange,
  required,
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-normal text-play-foreground">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="file"
        accept={accept}
        onChange={onChange ?? (() => {})}
        required={required}
        className="file:text-play-primary-foreground w-full cursor-pointer rounded-play-input border border-play-border bg-transparent px-3 py-2 text-sm text-play-muted file:mr-4 file:cursor-pointer file:rounded-play-input file:border-0 file:bg-play-primary file:px-4 file:py-2 file:text-sm file:font-semibold"
      />
    </div>
  )
}
