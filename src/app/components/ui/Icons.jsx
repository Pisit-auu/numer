/**
 * Authored icon set. One grid (24), one stroke weight (1.75), round caps and
 * joins throughout — so any two icons sit together without a seam.
 */

const base = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

function Icon({ size = 16, children, ...rest }) {
  return (
    <svg {...base} width={size} height={size} {...rest}>
      {children}
    </svg>
  );
}

export const Search = (p) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Icon>
);

export const ChevronDown = (p) => (
  <Icon {...p}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

export const ChevronRight = (p) => (
  <Icon {...p}>
    <path d="m9 6 6 6-6 6" />
  </Icon>
);

export const ArrowRight = (p) => (
  <Icon {...p}>
    <path d="M4 12h16" />
    <path d="m14 6 6 6-6 6" />
  </Icon>
);

export const Check = (p) => (
  <Icon {...p}>
    <path d="m4 12.5 5 5L20 6.5" />
  </Icon>
);

export const X = (p) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
);

export const Sun = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
  </Icon>
);

export const Moon = (p) => (
  <Icon {...p}>
    <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2Z" />
  </Icon>
);

export const Monitor = (p) => (
  <Icon {...p}>
    <rect x="2.5" y="4" width="19" height="12.5" rx="2" />
    <path d="M9 20h6M12 16.5V20" />
  </Icon>
);

export const Trash = (p) => (
  <Icon {...p}>
    <path d="M4 6.5h16" />
    <path d="M9.5 6.5V4.8A1.3 1.3 0 0 1 10.8 3.5h2.4a1.3 1.3 0 0 1 1.3 1.3v1.7" />
    <path d="M6.5 6.5 7.3 19a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4l.8-12.5" />
    <path d="M10.5 10.5v6M13.5 10.5v6" />
  </Icon>
);

export const AlertCircle = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5" />
    <path d="M12 16.3v.2" />
  </Icon>
);

export const CheckCircle = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12.2 2.7 2.7L16 9.6" />
  </Icon>
);

export const Info = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5.5" />
    <path d="M12 7.7v.2" />
  </Icon>
);

export const Play = (p) => (
  <Icon {...p}>
    <path d="M7.5 5.2a.7.7 0 0 1 1.06-.6l9.1 6.2a.72.72 0 0 1 0 1.2l-9.1 6.2a.7.7 0 0 1-1.06-.6Z" />
  </Icon>
);

export const History = (p) => (
  <Icon {...p}>
    <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" />
    <path d="M3.2 4.5v4h4" />
    <path d="M12 7.8V12l3 1.8" />
  </Icon>
);

export const Function = (p) => (
  <Icon {...p}>
    <path d="M14.5 4h-1.2A2.8 2.8 0 0 0 10.5 6.8V20" />
    <path d="M8 10h6" />
  </Icon>
);

export const Grid = (p) => (
  <Icon {...p}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.4" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.4" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.4" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.4" />
  </Icon>
);

/* Root: a curve crossing a baseline, with the crossing marked. */
export const Curve = (p) => (
  <Icon {...p}>
    <path d="M3 13.5h18" />
    <path d="M3.5 5.5c3.5 0 4 12 8 12 3.5 0 4.5-9 9-9" />
    <circle cx="9.4" cy="13.5" r="1.9" />
  </Icon>
);

/* Interpolation: scattered samples with the fitted path threaded between them. */
export const Scatter = (p) => (
  <Icon {...p}>
    <path d="M3 18c3.5 0 5-11 9-11 3 0 4 6 9 6" strokeDasharray="2.5 2.5" />
    <circle cx="4.6" cy="17.4" r="1.5" />
    <circle cx="10.6" cy="8.2" r="1.5" />
    <circle cx="15.4" cy="11.2" r="1.5" />
    <circle cx="20.4" cy="12.6" r="1.5" />
  </Icon>
);

/* Regression: a straight fit driven through a cloud of points. */
export const Slope = (p) => (
  <Icon {...p}>
    <path d="M3 19 21 5" />
    <circle cx="7.2" cy="13.6" r="1.5" />
    <circle cx="12.6" cy="12.9" r="1.5" />
    <circle cx="17.4" cy="7.6" r="1.5" />
  </Icon>
);

/* Integration: the strips under an arc, bounded left and right. */
export const Area = (p) => (
  <Icon {...p}>
    <path d="M3 19h18" />
    <path d="M4.5 19V9.5l5-4 5 3 5-5.5V19" />
    <path d="M9.5 5.5V19M14.5 8.5V19" />
  </Icon>
);

/* Differentiation: the tangent taken at a point on a curve. */
export const Slope2 = (p) => (
  <Icon {...p}>
    <path d="M3 18c4 0 6-12 10.5-12 3.5 0 4 5 7.5 5" />
    <path d="M8 20.5 17 5.5" />
    <circle cx="12.4" cy="13" r="1.6" />
  </Icon>
);

export const Menu = (p) => (
  <Icon {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
);

export const Book = (p) => (
  <Icon {...p}>
    <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19v15H5.5A1.5 1.5 0 0 0 4 19.5Z" />
    <path d="M4 19.5A1.5 1.5 0 0 1 5.5 21H19v-3" />
  </Icon>
);

export const Plus = (p) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const Sigma = (p) => (
  <Icon {...p}>
    <path d="M18 4.5H6.5l6 7.5-6 7.5H18" />
  </Icon>
);

/** One icon per problem family, keyed by family slug. */
export const familyIcons = {
  root: Curve,
  linear: Grid,
  inter: Scatter,
  extrapolation: Slope,
  integration: Area,
  differentiation: Slope2,
};
