import logoImage from "figma:asset/73e9485a380c0538da0c24a8c6f934ab193f2bc7.png";

interface LogoProps {
  size?: number;
}

export function Logo({ size = 200 }: LogoProps) {
  return (
    <div style={{ width: size, height: size }}>
      <img
        src={logoImage}
        alt="Scillet Logo"
        style={{ 
          width: "100%", 
          height: "100%", 
          objectFit: "contain",
          mixBlendMode: "multiply"
        }}
      />
    </div>
  );
}