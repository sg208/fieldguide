import type { ReactNode, SVGProps } from 'react';

// Lucide geometry (ISC), inlined. 24 viewBox, stroke 1.75 (see .icon in
// styles.css), aria-hidden: the control that holds the icon carries the name.
type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'>;

const Icon = ({
  paths,
  className,
  ...svgProps
}: IconProps & { paths: ReactNode }): ReactNode => (
  <svg
    viewBox="0 0 24 24"
    className={className ? `icon ${className}` : 'icon'}
    aria-hidden="true"
    focusable="false"
    {...svgProps}
  >
    {paths}
  </svg>
);

export const SearchIcon = (props: IconProps): ReactNode => (
  <Icon
    {...props}
    paths={
      <>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </>
    }
  />
);
export const ArrowLeftIcon = (props: IconProps): ReactNode => (
  <Icon
    {...props}
    paths={
      <>
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
      </>
    }
  />
);
export const ArrowRightIcon = (props: IconProps): ReactNode => (
  <Icon
    {...props}
    paths={
      <>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </>
    }
  />
);
export const ShareIcon = (props: IconProps): ReactNode => (
  <Icon
    {...props}
    paths={
      <>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
        <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
      </>
    }
  />
);
export const ExternalLinkIcon = (props: IconProps): ReactNode => (
  <Icon
    {...props}
    paths={
      <>
        <path d="M15 3h6v6" />
        <path d="M10 14 21 3" />
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      </>
    }
  />
);
export const CloseIcon = (props: IconProps): ReactNode => (
  <Icon
    {...props}
    paths={
      <>
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </>
    }
  />
);
export const CheckIcon = (props: IconProps): ReactNode => (
  <Icon {...props} paths={<path d="M20 6 9 17l-5-5" />} />
);
export const AlertIcon = (props: IconProps): ReactNode => (
  <Icon
    {...props}
    paths={
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" x2="12" y1="8" y2="12" />
        <line x1="12" x2="12.01" y1="16" y2="16" />
      </>
    }
  />
);
export const RetryIcon = (props: IconProps): ReactNode => (
  <Icon
    {...props}
    paths={
      <>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </>
    }
  />
);
export const WifiOffIcon = (props: IconProps): ReactNode => (
  <Icon
    {...props}
    paths={
      <>
        <path d="M12 20h.01" />
        <path d="M8.5 16.429a5 5 0 0 1 7 0" />
        <path d="M5 12.859a10 10 0 0 1 5.17-2.69" />
        <path d="M19 12.859a10 10 0 0 0-2.007-1.523" />
        <path d="M2 8.82a15 15 0 0 1 4.177-2.643" />
        <path d="M22 8.82a15 15 0 0 0-11.288-3.764" />
        <path d="m2 2 20 20" />
      </>
    }
  />
);

/** Brand mark (specimen label on accession violet). Uses theme tokens. */
export const MarkIcon = ({ className }: { className?: string }): ReactNode => (
  <svg
    viewBox="0 0 512 512"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <rect width="512" height="512" rx="112" fill="var(--stamp)" />
    <g transform="translate(256 262) rotate(-14) translate(-150 -90)">
      <path
        d="M62 0H290a10 10 0 0 1 10 10V170a10 10 0 0 1-10 10H62L0 124V56Z"
        fill="var(--board)"
      />
      <circle cx="44" cy="90" r="17" fill="var(--stamp)" />
      <rect x="98" y="50" width="164" height="18" rx="4" fill="var(--stamp)" />
      <rect
        x="98"
        y="90"
        width="164"
        height="10"
        rx="3"
        fill="var(--stamp)"
        opacity=".55"
      />
      <rect
        x="98"
        y="120"
        width="104"
        height="10"
        rx="3"
        fill="var(--stamp)"
        opacity=".55"
      />
    </g>
  </svg>
);
