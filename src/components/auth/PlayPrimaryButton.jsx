export function PlayPrimaryButton({ children, type = 'submit', disabled, ...rest }) {
  return (
    <button
      type={type}
      disabled={disabled}
      className="w-full rounded-play-button bg-play-primary py-3.5 text-sm font-bold text-play-primary-foreground transition enabled:hover:bg-play-primary-hover enabled:focus-visible:outline enabled:focus-visible:ring-2 enabled:focus-visible:ring-play-ring enabled:focus-visible:ring-offset-2 enabled:focus-visible:ring-offset-play-canvas disabled:cursor-not-allowed disabled:opacity-60"
      {...rest}
    >
      {children}
    </button>
  )
}
