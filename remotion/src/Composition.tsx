import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/900.css";
import {
  AbsoluteFill,
  Composition,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import brand from "../../brand.json";

const { colors } = brand;
const fontFamily = `"${brand.font.family}", sans-serif`;

type Props = {
  title: string;
  subtitle: string;
  caption: string;
};

export const MyComposition = () => {
  return (
    <Composition
      id="TestVideo"
      component={TestVideo}
      durationInFrames={5 * brand.video.fps}
      fps={brand.video.fps}
      width={brand.video.width}
      height={brand.video.height}
      defaultProps={{
        title: "Remotion",
        subtitle: "5-second render test · 1080p60",
        caption: "This is a Remotion test render.",
      }}
    />
  );
};

const easeOut = Easing.out(Easing.cubic);

export const TestVideo: React.FC<Props> = ({ title, subtitle, caption }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const end = durationInFrames / fps;

  const fadeOut = interpolate(t, [end - 0.5, end - 0.1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barScale = interpolate(t, [0, 0.6], [0.3, 1], {
    easing: easeOut,
    extrapolateRight: "clamp",
  });
  const titleIn = interpolate(t, [0, 0.7], [0, 1], {
    easing: easeOut,
    extrapolateRight: "clamp",
  });
  const titleDrift = interpolate(t, [1, 4.2], [1, 1.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleIn = interpolate(t, [0.6, 1.2], [0, 1], {
    easing: easeOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ground, fontFamily }}>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
          opacity: fadeOut,
        }}
      >
        <div
          style={{
            width: 240,
            height: 12,
            borderRadius: 6,
            backgroundColor: colors.accent,
            transform: `scaleX(${barScale})`,
          }}
        />
        <h1
          style={{
            margin: 0,
            color: colors.ink,
            fontSize: 128,
            fontWeight: 900,
            letterSpacing: "-0.04em",
            opacity: 0.35 + 0.65 * titleIn,
            transform: `translateY(${40 * (1 - titleIn)}px) scale(${titleDrift})`,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            margin: 0,
            color: colors.muted,
            fontSize: 44,
            fontWeight: 400,
            opacity: subtitleIn,
            transform: `translateY(${20 * (1 - subtitleIn)}px)`,
          }}
        >
          {subtitle}
        </p>
      </AbsoluteFill>
      <Sequence from={Math.round(0.6 * fps)} durationInFrames={Math.round(4.2 * fps)}>
        <Caption text={caption} />
      </Sequence>
    </AbsoluteFill>
  );
};

const Caption: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const opacity = interpolate(
    frame,
    [0, 0.3 * fps, durationInFrames - 0.3 * fps, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 140 }}>
      <span
        style={{
          padding: "14px 28px",
          borderRadius: 12,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          color: colors.ink,
          fontSize: 40,
          fontWeight: 700,
          opacity,
        }}
      >
        {text}
      </span>
    </AbsoluteFill>
  );
};
