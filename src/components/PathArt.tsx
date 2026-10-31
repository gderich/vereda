import React from "react";
import Svg, { Path, Circle, Rect, G } from "react-native-svg";
// Ilustração vetorial original: uma vereda nasce das páginas de um livro.
export default function PathArt() {
  return (
    <Svg
      width="100%"
      height={180}
      viewBox="0 0 360 180"
      accessibilityLabel="Um caminho entre colinas sai de um livro aberto em direção ao sol"
      accessible
    >
      <Circle cx="272" cy="46" r="29" fill="#E9BC62" />
      <Path
        d="M20 142Q58 28 130 82Q192 9 249 85Q307 50 341 142Z"
        fill="#C6DACD"
      />
      <Path d="M0 149Q65 89 124 123Q214 38 360 149Z" fill="#79A18C" />
      <Path
        d="M114 155Q231 133 191 100Q157 70 247 58Q198 78 221 97Q278 140 194 163Z"
        fill="#F5DFAC"
      />
      <G stroke="#203D46" strokeWidth="3" strokeLinejoin="round">
        <Path
          d="M85 125Q134 111 180 137Q226 111 275 125L264 166Q219 155 180 174Q141 155 96 166Z"
          fill="#203D46"
        />
        <Path
          d="M93 117Q138 107 180 132Q222 107 267 117L257 157Q215 148 180 168Q145 148 103 157Z"
          fill="#FFFCF3"
        />
        <Path d="M180 133V166" fill="none" />
      </G>
      <Path
        d="M113 128Q139 124 162 138M110 139Q138 134 160 146M199 138Q225 124 249 128"
        stroke="#C0C8BC"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M54 98V130M42 111L54 92L66 111Z"
        fill="#216653"
        stroke="#216653"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <Circle cx="310" cy="112" r="4" fill="#E9BC62" />
      <Circle cx="35" cy="61" r="3" fill="#E9BC62" />
    </Svg>
  );
}
