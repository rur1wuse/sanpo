import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDeviceId(): string {
  let deviceId = localStorage.getItem('sanpo_device_id')
  if (!deviceId) {
    deviceId = crypto.randomUUID()
    localStorage.setItem('sanpo_device_id', deviceId)
  }
  return deviceId
}
