import { TransparentVideo } from './TransparentVideo'

export function DeliveryAnimation({
  className,
  tint,
}: {
  className?: string
  tint?: [number, number, number]
}) {
  return <TransparentVideo src="/delivery-animation.mp4" className={className} tint={tint} />
}
