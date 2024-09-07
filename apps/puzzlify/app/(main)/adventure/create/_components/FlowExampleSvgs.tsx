import * as React from "react";

export const SingleTrackFlow = () => (
  <svg viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
    <circle cx={100} cy={50} r={30} fill="lightblue" stroke="black" />
    <text x={100} y={55} fontSize={15} textAnchor="middle" fill="black">
      Start
    </text>
    <line x1={100} y1={80} x2={100} y2={110} stroke="black" strokeWidth={2} />
    <polygon points="95,110 105,110 100,120" fill="black" />
    <circle cx={100} cy={150} r={30} fill="lightblue" stroke="black" />

    <line x1={100} y1={180} x2={100} y2={210} stroke="black" strokeWidth={2} />
    <polygon points="95,210 105,210 100,220" fill="black" />
    <circle cx={100} cy={250} r={30} fill="lightblue" stroke="black" />
  </svg>
);

export const ParallelTrackFlow = () => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <circle cx={200} cy={50} r={30} fill="lightgray" stroke="black" />
    <text x={200} y={55} fontSize={15} textAnchor="middle" fill="black">
      {"Start"}
    </text>
    <line x1={183} y1={75} x2={130} y2={120} stroke="black" strokeWidth={2} />
    <polygon points="125,120 135,120 130,130" fill="black" />
    <line x1={200} y1={80} x2={200} y2={120} stroke="black" strokeWidth={2} />
    <polygon points="195,120 205,120 200,130" fill="black" />
    <line x1={217} y1={75} x2={270} y2={120} stroke="black" strokeWidth={2} />
    <polygon points="265,120 275,120 270,130" fill="black" />
    <circle cx={130} cy={150} r={30} fill="lightblue" stroke="black" />
    <circle cx={200} cy={150} r={30} fill="lightblue" stroke="black" />
    <circle cx={270} cy={150} r={30} fill="lightblue" stroke="black" />
    <line x1={130} y1={180} x2={130} y2={220} stroke="black" strokeWidth={2} />
    <polygon points="125,220 135,220 130,230" fill="black" />
    <line x1={200} y1={180} x2={200} y2={220} stroke="black" strokeWidth={2} />
    <polygon points="195,220 205,220 200,230" fill="black" />
    <line x1={270} y1={180} x2={270} y2={220} stroke="black" strokeWidth={2} />
    <polygon points="265,220 275,220 270,230" fill="black" />
    <circle cx={130} cy={250} r={30} fill="lightblue" stroke="black" />
    <circle cx={200} cy={250} r={30} fill="lightblue" stroke="black" />
    <circle cx={270} cy={250} r={30} fill="lightblue" stroke="black" />
  </svg>
);
