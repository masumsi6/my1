import { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
  className?: string;
}

export function AnimatedBackground({ className = '' }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    const particles: Array<{
      x: number;
      y: number;
      dx: number;
      dy: number;
      size: number;
      color: string;
      opacity: number;
      isWhite: boolean;
    }> = [];

    // Create particles
    const createParticles = () => {
      const particleCount = window.innerWidth < 768 ? 30 : 50;
      particles.length = 0;

      for (let i = 0; i < particleCount; i++) {
        const isWhite = Math.random() > 0.3; // 70% white clouds, 30% black clouds
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          dx: (Math.random() - 0.5) * 0.8,
          dy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 8 + 3,
          color: isWhite ? '#ffffff' : '#2d3748',
          opacity: Math.random() * 0.4 + 0.3,
          isWhite: isWhite
        });
      }
    };

    createParticles();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#87ceeb');
      gradient.addColorStop(0.5, '#add8e6');
      gradient.addColorStop(1, '#e6f3ff');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        // Update position
        particle.x += particle.dx;
        particle.y += particle.dy;

        // Bounce off edges
        if (particle.x <= 0 || particle.x >= canvas.width) {
          particle.dx = -particle.dx;
        }
        if (particle.y <= 0 || particle.y >= canvas.height) {
          particle.dy = -particle.dy;
        }

        // Draw particle as cloud
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        
        // Add cloud effect with smaller circles
        if (particle.size > 4) {
          ctx.beginPath();
          ctx.arc(particle.x + particle.size * 0.3, particle.y - particle.size * 0.2, particle.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(particle.x - particle.size * 0.3, particle.y - particle.size * 0.2, particle.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw connections between nearby particles (subtle cloud formations)
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.5;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 80 && particles[i].isWhite && particles[j].isWhite) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ background: 'transparent' }}
    />
  );
}