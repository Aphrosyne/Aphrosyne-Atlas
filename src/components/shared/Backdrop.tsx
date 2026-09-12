'use client'

import { useEffect, useRef, useState, type SyntheticEvent } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { publicPath } from '@/lib/public-path'
import { SITE } from '@/config/site'

type BackgroundPanel = keyof typeof SITE.assets.backgrounds

type BackgroundTransition = {
  id: number
  from: BackgroundPanel
  to: BackgroundPanel
  direction: 1 | -1
}

const PANEL_ORDER: readonly BackgroundPanel[] = ['home', 'knowledge', 'blog', 'projects', 'about']
const BACKGROUND_SCALE = 1.08
const TRANSITION_DISTANCE = 6
const TRANSITION_DURATION = 0.38
const OVERLAY_EXCLUDED_PANELS: readonly BackgroundPanel[] = ['home', 'about']
const SCROLL_BLUR_PANELS: readonly BackgroundPanel[] = ['home', 'about']

function getPanel(pathname: string): BackgroundPanel {
  if (pathname.startsWith('/knowledge')) return 'knowledge'
  if (pathname.startsWith('/blog')) return 'blog'
  if (pathname.startsWith('/projects')) return 'projects'
  if (pathname.startsWith('/about')) return 'about'
  return 'home'
}

function hideFailedBackground(event: SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.onerror = null
  event.currentTarget.remove()
}

function PanelImage({ panel, blur }: {
  panel: BackgroundPanel
  blur?: MotionValue<string>
}) {
  return (
    <motion.img
      src={publicPath(SITE.assets.backgrounds[panel])}
      alt=""
      aria-hidden="true"
      className="absolute inset-0 size-full object-cover"
      style={{ scale: BACKGROUND_SCALE, filter: blur }}
      onError={hideFailedBackground}
    />
  )
}

/**
 * 每个页面保留一张放大的背景。导航时，旧图固定铺满底层，
 * 新图从方向侧短距滑入并回到中心；没有透明度动画或跨页背景轨道。
 */
export default function Backdrop() {
  const pathname = usePathname()
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scrollBlur = useTransform(scrollYProgress, [0, 1], ['blur(0px)', 'blur(12px)'])
  const requestedPanel = getPanel(pathname)
  const [activePanel, setActivePanel] = useState<BackgroundPanel>(requestedPanel)
  const [backgroundTransition, setBackgroundTransition] = useState<BackgroundTransition | null>(null)
  const activePanelRef = useRef(activePanel)
  const transitionIdRef = useRef(0)
  const visiblePanel = backgroundTransition?.to ?? activePanel
  const shouldApplyScrollBlur = !shouldReduceMotion && SCROLL_BLUR_PANELS.includes(visiblePanel)

  useEffect(() => {
    if (requestedPanel === activePanelRef.current) return

    const previousPanel = activePanelRef.current
    const frame = requestAnimationFrame(() => {
      if (shouldReduceMotion) {
        transitionIdRef.current += 1
        setBackgroundTransition(null)
        setActivePanel(requestedPanel)
        activePanelRef.current = requestedPanel
        return
      }

      transitionIdRef.current += 1
      setBackgroundTransition({
        id: transitionIdRef.current,
        from: previousPanel,
        to: requestedPanel,
        direction: PANEL_ORDER.indexOf(requestedPanel) > PANEL_ORDER.indexOf(previousPanel) ? 1 : -1,
      })
    })
    return () => cancelAnimationFrame(frame)
  }, [requestedPanel, shouldReduceMotion])

  useEffect(() => {
    if (shouldReduceMotion || !SCROLL_BLUR_PANELS.includes(requestedPanel)) return

    const syncScrollProgress = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      scrollYProgress.set(maxScroll > 0 ? window.scrollY / maxScroll : 0)
    }

    // 路由导航会把页面滚动位置复位，但不一定触发 useScroll 的原始事件。
    // 先清空旧页面进度，再在两帧后读取最终位置，以兼容浏览器恢复滚动位置。
    scrollYProgress.set(0)
    let secondFrame = 0
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(syncScrollProgress)
    })

    return () => {
      cancelAnimationFrame(firstFrame)
      cancelAnimationFrame(secondFrame)
    }
  }, [requestedPanel, scrollYProgress, shouldReduceMotion])

  const transition = {
    duration: TRANSITION_DURATION,
    ease: [0.22, 1, 0.36, 1] as const,
  }

  const finishTransition = (completedTransition: BackgroundTransition) => {
    if (completedTransition.id !== transitionIdRef.current) return

    activePanelRef.current = completedTransition.to
    setActivePanel(completedTransition.to)
    setBackgroundTransition(null)
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-bg" aria-hidden="true">
      {backgroundTransition ? (
        <>
          <PanelImage panel={backgroundTransition.from} blur={shouldApplyScrollBlur ? scrollBlur : undefined} />
          <motion.img
            key={backgroundTransition.id}
            src={publicPath(SITE.assets.backgrounds[backgroundTransition.to])}
            alt=""
            aria-hidden="true"
            initial={{ x: `${backgroundTransition.direction * TRANSITION_DISTANCE}%`, scale: BACKGROUND_SCALE }}
            animate={{ x: '0%', scale: BACKGROUND_SCALE }}
            transition={transition}
            className="absolute inset-0 size-full object-cover"
            style={{ filter: shouldApplyScrollBlur ? scrollBlur : 'none' }}
            onAnimationComplete={() => finishTransition(backgroundTransition)}
            onError={hideFailedBackground}
          />
        </>
      ) : <PanelImage panel={activePanel} blur={shouldApplyScrollBlur ? scrollBlur : undefined} />}
      {!OVERLAY_EXCLUDED_PANELS.includes(visiblePanel) && <div className="absolute inset-0 bg-white/30 dark:bg-black/30" />}
    </div>
  )
}
