import { Card, CardContent } from "@/components/ui/card";
import { FadeCard, RevealSection, FlickerText, AnimatedMetric } from "@/components/animations";

interface MetricCardsProps {
  metrics?: {
    psnr: number;
    ssim: number;
    fid: number;
    inferenceTime: number;
  } | null;
}

export function MetricCards({ metrics }: MetricCardsProps) {
  const cards = [
    {
      title: "PSNR (dB)",
      value: metrics ? metrics.psnr : "--",
      description: "Peak Signal-to-Noise Ratio",
    },
    {
      title: "SSIM",
      value: metrics ? metrics.ssim.toFixed(3) : "--",
      description: "Structural Similarity Index",
    },
    {
      title: "FID Score",
      value: metrics ? metrics.fid.toFixed(1) : "--",
      description: "Frechet Inception Distance",
    },
    {
      title: "Inference Time",
      value: metrics ? `${metrics.inferenceTime.toFixed(2)}s` : "--",
      description: "Per 256x256 tile",
    },
  ];

  return (
    <RevealSection className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full" delay={0.2}>
      {cards.map((card, i) => (
        <FadeCard key={card.title}>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(0,229,255,0.2)] transition-all duration-300 h-full">
            <CardContent className="p-6 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  <FlickerText delay={i * 0.1}>{card.title}</FlickerText>
                </span>
              </div>
              <div className="text-3xl font-bold font-mono tracking-tight text-foreground mt-2">
                {metrics ? (
                  <AnimatedMetric value={card.value as number | string} />
                ) : (
                  "--"
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        </FadeCard>
      ))}
    </RevealSection>
  );
}
