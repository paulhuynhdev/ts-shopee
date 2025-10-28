import type { ClockPort } from '../ports/ClockPort';

export class SystemClock implements ClockPort {
  now(): number {
    return Math.floor(Date.now() / 1000);
  }
}
