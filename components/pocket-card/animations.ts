export const listVariants = {
  hidden: {
    opacity: 0,
    scale: 0.98,
    filter: "blur(10px)",
  },
  hover: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
};

// Caret animation variants
export const caretVariants = {
  open: {
    rotate: 90,
  },
  closed: {
    rotate: 0,
  },
};

// model parent variants (stagger animation)
export const modelParentVariants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.2, staggerDirection: -1 },
  },
};

// model children variants
export const modelChildrenVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { stiffness: 300, damping: 24 },
  },
  closed: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
};
