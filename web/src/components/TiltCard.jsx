import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

export default function TiltCard({ review }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative h-64 w-full rounded-xl bg-white p-6 shadow-xl border border-gray-100 group"
    >
      <div 
        style={{ transform: "translateZ(50px)" }} 
        className="absolute inset-4 flex flex-col justify-between"
      >
        <div>
          <div className="flex justify-between items-start mb-4">
            <div className="flex text-secondary text-sm">
              {[...Array(5)].map((_, i) => <FaStar key={i} />)}
            </div>
            <FaQuoteLeft className="text-gray-100 text-4xl" />
          </div>
          <p className="text-gray-600 text-sm leading-relaxed font-medium">
            "{review.text}"
          </p>
        </div>
        
        <div className="flex items-center gap-3 mt-4 border-t pt-3">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
            {review.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-dark text-sm">{review.name}</h4>
            <span className="text-xs text-gray-500 block">{review.route}</span>
          </div>
        </div>
      </div>
      
      {/* Glare Effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300" />
    </motion.div>
  );
}