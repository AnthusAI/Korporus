import * as React from "react";
import { motion } from "framer-motion";

// Directly based on the Kanbus FeaturePictogram "kanban-board" visual.
export function KanbanBusPictogram() {
  return (
    <div className="relative w-full min-h-[280px] rounded-2xl overflow-hidden bg-card">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 500 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 m-auto"
        preserveAspectRatio="none"
      >
        <rect x="0" y="0" width="500" height="300" fill="var(--column)" rx="10" />

        <rect x="20" y="20" width="140" height="260" fill="var(--background)" rx="8" />
        <rect x="180" y="20" width="140" height="260" fill="var(--background)" rx="8" />
        <rect x="340" y="20" width="140" height="260" fill="var(--background)" rx="8" />

        <rect x="30" y="35" width="120" height="48" fill="var(--card)" rx="6" />

        <motion.g
          animate={{ y: [0, 0, 63, 63, 0, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 0.53, 0.9, 0.95, 1] }}
        >
          <rect x="350" y="35" width="120" height="48" fill="var(--card)" rx="6" />
        </motion.g>

        <motion.g
          animate={{ x: [0, 0, 160, 160, 0, 0], opacity: [1, 1, 1, 1, 0, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", times: [0, 0.51, 0.54, 0.9, 0.95, 1] }}
        >
          <rect x="190" y="35" width="120" height="48" fill="var(--accent-blue)" rx="6" />
        </motion.g>

        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 1, 1, 0, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", times: [0, 0.05, 0.1, 0.9, 0.95, 1] }}
        >
          <rect x="30" y="98" width="120" height="48" fill="var(--accent-blue)" rx="6" />
        </motion.g>
      </svg>
    </div>
  );
}
