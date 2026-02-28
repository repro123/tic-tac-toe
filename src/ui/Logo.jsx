import LogoSrc from "@/assets/images/logo.svg";

function Logo() {
  return (
    <a href="#" aria-label="tic tac toe home">
      <img src={LogoSrc} alt="tic tac toe logo" />
    </a>
  );
}

export default Logo;
