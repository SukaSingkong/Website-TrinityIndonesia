export const StatefulButton = ({state, children, ...props}) => (
    <button type="submit" {...props}>
        <span className={state ? 'text-transparent' : ''}>{children}</span>
        {state && <div className="absolute top-0 left-0 h-full w-full grid place-items-center">
            <img src="/vendor/spinner-white.svg" className="h-10 w-10 -mt-0.5" />
        </div>}
    </button>
);