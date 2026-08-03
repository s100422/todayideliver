import Image from 'next/image'

export function DeliveryScooterIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/delivery-icon.png"
      alt="배달 오토바이"
      width={552}
      height={452}
      className={className}
      style={{ objectFit: 'contain' }}
      priority
    />
  )
}
