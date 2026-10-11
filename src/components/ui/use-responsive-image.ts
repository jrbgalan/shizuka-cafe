import * as React from "react"
import { useSize } from "@/hooks/use-size"
import { cn } from "@/lib/utils"
import {
  DEFAULT_TRANSFORM_WIDTH,
  getImagePreviewClassName,
  type ParsedWixUrl,
  type TransformOptions,
} from "./image-helpers"

export interface UseResponsiveImageProps {
  parsed: ParsedWixUrl
  fittingType?: string
  focalPoint?: { x: number; y: number }
  quality?: number
  className?: string
  onLoad?: React.ReactEventHandler<HTMLImageElement>
  onSourceChange?: (src: string, className: string) => void
}

export function useResponsiveImage(
  {
    parsed,
    fittingType,
    focalPoint,
    quality,
    className,
    onLoad,
    onSourceChange,
  }: UseResponsiveImageProps,
  parentRef?: React.Ref<HTMLImageElement>
) {
  const wrapperRef = React.useRef<HTMLSpanElement>(null)
  const imgRef = React.useRef<HTMLImageElement>(null)
  const size = useSize(wrapperRef)
  const [loaded, setLoaded] = React.useState(false)

  React.useImperativeHandle(parentRef, () => imgRef.current as HTMLImageElement)
  React.useEffect(() => setLoaded(false), [parsed.baseUrl])
  React.useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper || !onSourceChange) return
    const replace = (event: Event) => {
      const customEvent = event as CustomEvent<{ src: string }>
      onSourceChange(
        customEvent.detail.src,
        getImagePreviewClassName(
          className,
          wrapper.className,
          cn("inline-block relative", className)
        )
      )
    }
    wrapper.addEventListener("image:replace", replace)
    return () => wrapper.removeEventListener("image:replace", replace)
  }, [className, onSourceChange])

  const crop = fittingType !== "fit"
  // Wait for useSize's pre-paint measurement before requesting a transform.
  const options: TransformOptions | undefined = size
    ? {
        width: size.width || DEFAULT_TRANSFORM_WIDTH,
        height: size.height || undefined,
        crop,
        focalPoint: crop ? focalPoint : undefined,
        quality,
      }
    : undefined

  return {
    wrapperRef,
    imgRef,
    loaded,
    options,
    handleLoad: (event: React.SyntheticEvent<HTMLImageElement>) => {
      setLoaded(true)
      onLoad?.(event)
    },
  }
}

