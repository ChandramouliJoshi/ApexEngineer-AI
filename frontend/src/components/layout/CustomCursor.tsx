import { useEffect, useState } from "react"

type CursorState = "normal" | "hover" | "click" | "busy"

function CustomCursor() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  })

  const [cursorState, setCursorState] =
    useState<CursorState>("normal")

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const target = event.target as HTMLElement | null

      if (
        target?.closest(
          "a, button, input, select, textarea, [role='button'], [data-cursor='hover']"
        )
      ) {
        setCursorState("hover")
      } else {
        setCursorState("normal")
      }
    }

    const handleMouseDown = () => {
      setCursorState("click")
    }

    const handleMouseUp = () => {
      setCursorState("normal")
    }

    const handleMouseLeave = () => {
      setCursorState("normal")
    }

    window.addEventListener(
      "mousemove",
      handleMouseMove
    )

    window.addEventListener(
      "mousedown",
      handleMouseDown
    )

    window.addEventListener(
      "mouseup",
      handleMouseUp
    )

    document.addEventListener(
      "mouseleave",
      handleMouseLeave
    )

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      )

      window.removeEventListener(
        "mousedown",
        handleMouseDown
      )

      window.removeEventListener(
        "mouseup",
        handleMouseUp
      )

      document.removeEventListener(
        "mouseleave",
        handleMouseLeave
      )
    }
  }, [])

  const cursorImage = {
    normal: "/cursor/normal.png",
    hover: "/cursor/hover.png",
    click: "/cursor/click.png",
    busy: "/cursor/busy.png",
  }[cursorState]

  return (
    <img
      src={cursorImage}
      alt=""
      aria-hidden="true"
      className="custom-cursor"
      style={{
        left: position.x,
        top: position.y,
      }}
    />
  )
}

export default CustomCursor