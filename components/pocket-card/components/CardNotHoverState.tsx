import { motion } from 'motion/react'
import React from 'react'

const CardNotHoverState = () => {
  return (
    <motion.div
    className="absolute inset-0 flex items-center justify-center"
    initial={{
      opacity: 0,
      scale: 0.95,
      filter: "blur(10px)",
      translateY: 300,
    }}
    animate={{
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      translateY: 0,
    }}
    exit={{
      opacity: 0,
      scale: 0.95,
      filter: "blur(10px)",
      translateY: 100,
    }}
    transition={{
      ease: "easeInOut",
      duration: 0.3,
    }}
  >
    <p className="font-press-start-2p absolute top-0 left-0 px-4 py-1 text-center text-lg text-neutral-400/80 opacity-30">
      Hover
    </p>
    <p className="font-press-start-2p absolute top-10 left-20 px-4 py-1 text-center text-lg text-neutral-400/80 opacity-30">
      to
    </p>
    <p className="font-press-start-2p absolute top-20 left-30 px-4 py-1 text-center text-lg text-neutral-400/80 opacity-30">
      reveal
    </p>
    <p className="font-press-start-2p absolute top-30 left-55 px-4 py-1 text-center text-lg text-neutral-400/80 opacity-30">
      models
    </p>

    {/* now we are going to flip it to the right */}

    <p className="font-press-start-2p absolute top-0 right-0 px-4 py-1 text-center text-lg text-neutral-400/80 opacity-30">
      Hover
    </p>
    <p className="font-press-start-2p absolute top-10 right-20 px-4 py-1 text-center text-lg text-neutral-400/80 opacity-30">
      to
    </p>

    {/* now we gonna go back in reverse from here to left */}
    <p className="font-press-start-2p absolute top-40 left-55 px-4 py-1 text-center text-lg text-neutral-400/80 opacity-30">
      models
    </p>
    <p className="font-press-start-2p absolute top-50 left-30 px-4 py-1 text-center text-lg text-neutral-400/80 opacity-30">
      reveal
    </p>
    <p className="font-press-start-2p absolute top-60 left-20 p-4 text-center text-lg text-neutral-400/80 opacity-30">
      to
    </p>
    <p className="font-press-start-2p absolute top-70 left-0 px-4 py-1 text-center text-lg text-neutral-400/80 opacity-30">
      Hover
    </p>

    {/* we are gonna flip it now to the right */}
    <p className="font-press-start-2p absolute top-60 right-20 p-4 text-center text-lg text-neutral-400/80 opacity-30">
      to
    </p>
    <p className="font-press-start-2p absolute top-70 right-0 px-4 py-1 text-center text-lg text-neutral-400/80 opacity-30">
      Hover
    </p>

    {/* now we gonna go back in reverse from here to right */}
    <p className="font-press-start-2p absolute top-80 left-0 px-4 py-1 text-center text-lg text-neutral-400/80 opacity-30">
      Hover
    </p>
    <p className="font-press-start-2p absolute top-90 left-20 px-4 py-1 text-center text-lg text-neutral-400/80 opacity-30">
      to
    </p>
    <p className="font-press-start-2p absolute top-100 left-30 px-4 py-1 text-center text-lg text-neutral-400/80 opacity-30">
      reveal
    </p>
    <p className="font-press-start-2p absolute top-110 left-55 px-4 py-1 text-center text-lg text-neutral-400/80 opacity-30">
      models
    </p>

    {/* now we are goning to flip it to the right */}
    <p className="font-press-start-2p absolute top-80 right-0 px-4 py-1 text-center text-lg text-neutral-400/80 opacity-30">
      Hover
    </p>
    <p className="font-press-start-2p absolute top-90 right-20 px-4 py-1 text-center text-lg text-neutral-400/80 opacity-30">
      to
    </p>
    <p className="font-press-start-2p absolute top-100 left-30 px-4 py-1 text-center text-lg text-neutral-400/80 opacity-30">
      reveal
    </p>
    <p className="font-press-start-2p absolute top-110 left-55 px-4 py-1 text-center text-lg text-neutral-400/80 opacity-30">
      models
    </p>

    {/* now we gonna go back in reverse from here to left */}
    <p className="font-press-start-2p absolute top-120 left-55 px-4 py-1 text-center text-lg text-neutral-400/80 opacity-30">
      models
    </p>
    <p className="font-press-start-2p absolute top-130 left-30 px-4 py-1 text-center text-lg text-neutral-400/80 opacity-30">
      reveal
    </p>
    <p className="font-press-start-2p absolute top-140 left-20 px-4 py-1 text-center text-lg text-neutral-400/80 opacity-30">
      to
    </p>
    <p className="font-press-start-2p absolute top-150 left-0 px-4 py-1 text-center text-lg text-neutral-400/80 opacity-30">
      Hover
    </p>

    {/* now we gonn flip it to the right */}
    <p className="font-press-start-2p absolute top-120 left-55 px-4 py-1 text-center text-lg text-neutral-400/80 opacity-30">
      models
    </p>
    <p className="font-press-start-2p absolute top-130 left-30 px-4 py-1 text-center text-lg text-neutral-400/80 opacity-30">
      reveal
    </p>
    <p className="font-press-start-2p absolute top-140 right-20 px-4 py-1 text-center text-lg text-neutral-400/80 opacity-30">
      to
    </p>
    <p className="font-press-start-2p absolute top-150 right-0 px-4 py-1 text-center text-lg text-neutral-400/80 opacity-30">
      Hover
    </p>
  </motion.div>
  )
}

export default CardNotHoverState