type OrnamentalArchProps = {
  id: string;
  className?: string;
};

const ornamentPositions = [
  `crown`,
  `left-upper`,
  `left-middle`,
  `left-lower`,
  `right-upper`,
  `right-middle`,
  `right-lower`,
] as const;

const outerArch = `M10 382V198C10 94 61 10 160 10S310 94 310 198V382Q310 390 302 390H18Q10 390 10 382Z`;
const innerArch = `M18 382V198C18 98 66 18 160 18S302 98 302 198V382H18Z`;
const rosette = `M12 1L15 5L20 4L19 9L23 12L19 15L20 20L15 19L12 23L9 19L4 20L5 15L1 12L5 9L4 4L9 5Z`;

const OrnamentalArch = ({ id, className = `` }: OrnamentalArchProps) => (
  <div
    id={id}
    aria-hidden={`true`}
    className={`bb-ornamental-arch${className ? ` ${className}` : ``}`}
  >
    <svg
      fill={`none`}
      viewBox={`0 0 320 400`}
      id={`${id}-outline`}
      preserveAspectRatio={`none`}
      className={`bb-ornamental-arch-outline`}
    >
      <path
        d={innerArch}
        id={`${id}-inner-outline`}
        className={`bb-ornamental-arch-line bb-ornamental-arch-line--inner`}
      />
      <path
        d={outerArch}
        id={`${id}-outer-outline`}
        className={`bb-ornamental-arch-line bb-ornamental-arch-line--outer`}
      />
      <path
        d={outerArch}
        pathLength={1000}
        id={`${id}-flowing-outline`}
        className={`bb-ornamental-arch-line bb-ornamental-arch-flow`}
      />
      <path
        id={`${id}-left-arabesque`}
        className={`bb-ornamental-arch-line bb-ornamental-arch-arabesque`}
        d={`M14 212C1 226 1 240 14 250C27 240 27 226 14 212M14 280C1 294 1 308 14 318C27 308 27 294 14 280M14 224V238M14 292V306`}
      />
      <path
        id={`${id}-right-arabesque`}
        className={`bb-ornamental-arch-line bb-ornamental-arch-arabesque`}
        d={`M306 212C293 226 293 240 306 250C319 240 319 226 306 212M306 280C293 294 293 308 306 318C319 308 319 294 306 280M306 224V238M306 292V306`}
      />
    </svg>
    {ornamentPositions.map((position, index) => (
      <svg
        fill={`none`}
        key={position}
        viewBox={`0 0 24 24`}
        id={`${id}-rosette-${index}`}
        style={{ animationDelay: `${index * -1.4}s` }}
        className={`bb-ornamental-arch-rosette bb-ornamental-arch-rosette--${position}`}
      >
        <path
          d={rosette}
          id={`${id}-rosette-petals-${index}`}
          className={`bb-ornamental-arch-rosette-petals`}
        />
        <path
          d={`M12 6L18 12L12 18L6 12Z`}
          id={`${id}-rosette-diamond-${index}`}
          className={`bb-ornamental-arch-rosette-diamond`}
        />
        <circle
          r={1.4}
          cx={12}
          cy={12}
          id={`${id}-rosette-center-${index}`}
          className={`bb-ornamental-arch-rosette-center`}
        />
      </svg>
    ))}
  </div>
);

export default OrnamentalArch;
