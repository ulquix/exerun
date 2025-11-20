import { useSelector } from "react-redux";
import { type RootState } from "@/store/store";
import type { CursorProps } from "@/types/globaltype";
const Cursor = ({ x, y, color }: CursorProps) => {
  const heightwidth = useSelector((state: RootState) => state.todo);
  const height = heightwidth.height;
  const width = heightwidth.width;
  const { totalHeight, totalWidth } = heightwidth;
  const calcHeight = (y * height) / 100 + (totalHeight || 0);
  const calcWidth = (x * width) / 100 + (totalWidth || 0);

  return (
    // <div
    //   style={{
    //     position: "fixed",
    //     top: calcHeight,
    //     left: calcWidth,
    //     width: 0,
    //     height: 0,
    //     borderLeft: "8px solid transparent",
    //     borderRight: "8px solid transparent",
    //     borderBottom: `16px solid ${color}`,
    //     transform: "translate(-50%, -50%) rotate(-15deg)",
    //     filter: "drop-shadow(0 0 2px rgba(0,0,0,0.5))",
    //     pointerEvents: "none",
    //     zIndex: 9999,
    //   }}
    // />


<svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translate(${calcWidth}px, ${calcHeight}px)`,
        zIndex: 9999, // ensures visibility
        pointerEvents: "none", // lets clicks pass through
      }}
      width={16}
      height={16}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m13.67 6.03-11-4a.5.5 0 0 0-.64.64l4 11a.5.5 0 0 0 .935.015l1.92-4.8 4.8-1.92a.5.5 0 0 0 0-.935h-.015Z"
        fill={color} // test with solid color first
      />
    </svg>
  );
};




export default Cursor;
