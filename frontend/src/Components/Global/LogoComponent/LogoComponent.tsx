import logoMd from "../../../assets/logo-md.svg";
import logoSm from "../../../assets/logo-sm.svg";

interface Props {
  width: "md" | "sm";
}
export default function LogoComponent({ width = "md" }: Props) {
  const logoWithSIzing = width == "md" ? logoMd : logoSm;

  return (
    <>
      <img src={logoWithSIzing} />
    </>
  );
}
