import Image from "next/image";

export function Testimonial() {
  return (
    <section className="py-24 md:py-32 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <blockquote className="font-heading text-[24px] md:text-[28px] font-semibold leading-[1.4]">
              &ldquo;Thinkboard changed how I approach content creation. I used
              to have 20 browser tabs and three apps open. Now everything lives
              on one canvas — and the AI actually understands all of it
              together.&rdquo;
            </blockquote>
            <div className="mt-8 flex items-center gap-4">
              <div className="size-12 rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&q=80"
                  alt="Creator testimonial"
                  width={48}
                  height={48}
                  className="size-full object-cover"
                />
              </div>
              <div>
                <p className="font-sans text-sm font-medium">Alex Rivera</p>
                <p className="font-sans text-sm text-primary-foreground/60">
                  Content Creator & Researcher
                </p>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-8 max-w-xs">
              <div>
                <p className="font-heading text-[36px] font-bold text-accent">
                  80%
                </p>
                <p className="font-sans text-sm text-primary-foreground/60">
                  Less time spent on research
                </p>
              </div>
              <div>
                <p className="font-heading text-[36px] font-bold text-accent">
                  3×
                </p>
                <p className="font-sans text-sm text-primary-foreground/60">
                  Faster content output
                </p>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&q=80"
                alt="Creators collaborating and brainstorming"
                width={800}
                height={600}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
