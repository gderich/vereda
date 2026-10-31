import React from "react";
import Svg, {
  Circle,
  Path,
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
} from "react-native-svg";
export default function BrandMark({ size = 48 }: { size?: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="180 180 664 664"
      accessible
      accessibilityLabel="Vereda: um caminho de luz guiado pelas escrituras"
    >
      <Defs>
        <RadialGradient id="glow">
          <Stop stopColor="#E9BC62" stopOpacity=".32" />
          <Stop offset="1" stopColor="#E9BC62" stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="path" x1="0" y1="1" x2="0" y2="0">
          <Stop stopColor="#DEAA53" />
          <Stop offset=".6" stopColor="#FFE9AC" />
          <Stop offset="1" stopColor="#FFFBEA" />
        </LinearGradient>
      </Defs>
      <Circle cx="512" cy="347" r="210" fill="url(#glow)" />
      <Path
        d="M257 735Q395 645 440 538Q467 474 512 443Q585 488 641 554Q725 658 787 735Z"
        fill="#214551"
      />
      <Path
        d="M320 820Q326 702 478 649Q640 594 539 532Q488 501 512 447Q509 493 570 525Q721 602 552 685Q453 737 464 820Z"
        fill="#B98740"
      />
      <Path
        d="M344 820Q350 716 497 665Q668 604 555 530Q502 495 512 447Q487 498 533 538Q621 601 463 651Q308 705 300 820Z"
        fill="url(#path)"
      />
      <Path
        d="M385 305Q449 280 512 323Q575 280 639 305V415Q575 392 512 438Q449 392 385 415Z"
        fill="#FFF4D5"
      />
      <Path
        d="M512 325V420M409 331Q453 318 490 345M409 357Q453 344 490 371M534 345Q577 318 615 331M534 371Q577 344 615 357"
        stroke="#B98740"
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M512 226V254M421 247L435 271M603 247L589 271"
        stroke="#F4D083"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <Circle cx="355" cy="530" r="5" fill="#F4D083" />
      <Circle cx="674" cy="444" r="4" fill="#F4D083" />
    </Svg>
  );
}
