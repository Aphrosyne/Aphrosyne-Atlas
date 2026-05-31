import type { Metadata } from 'next'
import PageTransition from '@/components/shared/PageTransition'
import AnimatedSection from '@/components/shared/AnimatedSection'

export const metadata: Metadata = {
  title: 'About',
  description: 'Embedded systems engineer, tinkerer, and builder.',
}

const timeline = [
  {
    year: '2025 – Present',
    title: 'Embedded Systems Engineer',
    description:
      'Working on embedded Linux and RTOS-based systems. Rust adoption, CI/CD for firmware, and tooling automation.',
  },
  {
    year: '2023 – 2025',
    title: 'Firmware Developer',
    description:
      'Developed bare-metal and RTOS firmware for STM32 and ESP32 microcontrollers. Built test harnesses and hardware-in-the-loop validation.',
  },
  {
    year: '2021 – 2023',
    title: 'Hardware Engineer',
    description:
      'Designed PCBs, wrote low-level drivers, and debugged protocols (I2C, SPI, UART, CAN) on custom hardware.',
  },
  {
    year: '2019 – 2021',
    title: 'Electronics & Embedded Intern',
    description:
      'Started the journey — learning C, assembly, and digital logic design on 8-bit microcontrollers.',
  },
]

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">About</h1>
        <p className="mt-4 text-muted leading-relaxed">
          Embedded systems engineer by trade, tinkerer by nature. I work at the
          intersection of hardware and software, building things that bridge the
          digital and physical worlds.
        </p>
        <p className="mt-4 text-muted leading-relaxed">
          This site is my corner of the internet — a place to document what I
          learn, share projects, and occasionally write about things that
          interest me.
        </p>

        <AnimatedSection className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight">Experience</h2>
          <div className="mt-8 space-y-8">
            {timeline.map((item) => (
              <div key={item.year} className="relative pl-6 border-l-2 border-border">
                <div className="absolute left-[-5px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent" />
                <span className="text-xs font-medium text-accent">{item.year}</span>
                <h3 className="mt-1 font-semibold text-fg">{item.title}</h3>
                <p className="mt-1 text-sm text-muted leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </PageTransition>
  )
}
