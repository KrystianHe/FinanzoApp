import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-particles',
  standalone: true,
  template: `
    <canvas #particlesCanvas></canvas>
  `,
  styles: [`
    :host {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }
    canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  `]
})
export class ParticlesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('particlesCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private mouse = { x: 0, y: 0 };
  private animationFrameId: number = 0;
  private readonly particleCount = 50;
  private readonly connectionDistance = 170;
  private readonly particleRadius = 3;

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.initCanvas();
    this.createParticles();
    this.addEventListeners();
    this.animate();
  }

  ngOnDestroy() {
    this.removeEventListeners();
    cancelAnimationFrame(this.animationFrameId);
  }

  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private createParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(new Particle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        this.particleRadius
      ));
    }
  }

  private addEventListeners() {
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private removeEventListeners() {
    window.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  private handleMouseMove(event: MouseEvent) {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
  }

  private handleResize() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private animate() {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Update and draw particles
    this.particles.forEach(particle => {
      particle.update(window.innerWidth, window.innerHeight);
      particle.draw(this.ctx);
    });

    // Draw connections
    this.particles.forEach(particle => {
      // Connect to mouse if close enough
      const mouseDistance = Math.hypot(particle.x - this.mouse.x, particle.y - this.mouse.y);
      if (mouseDistance < this.connectionDistance) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${1 - mouseDistance / this.connectionDistance})`;
        this.ctx.lineWidth = 0.5;
        this.ctx.moveTo(particle.x, particle.y);
        this.ctx.lineTo(this.mouse.x, this.mouse.y);
        this.ctx.stroke();
      }

      // Connect to other particles if close enough
      this.particles.forEach(otherParticle => {
        if (particle === otherParticle) return;
        const distance = Math.hypot(particle.x - otherParticle.x, particle.y - otherParticle.y);
        if (distance < this.connectionDistance) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / this.connectionDistance})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(otherParticle.x, otherParticle.y);
          this.ctx.stroke();
        }
      });
    });

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }
}

class Particle {
  constructor(
    public x: number,
    public y: number,
    public vx: number,
    public vy: number,
    public radius: number
  ) {}

  update(width: number, height: number) {
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
  }
}
