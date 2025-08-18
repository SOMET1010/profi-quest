import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, TrendingUp, PieChart } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Pie,
} from "recharts";

interface DashboardChartsProps {
  isLoading?: boolean;
  stats?: any;
}

// Données simulées pour les graphiques
const applicationData = [
  { month: "Août", candidatures: 12 },
  { month: "Sep", candidatures: 18 },
  { month: "Oct", candidatures: 25 },
  { month: "Nov", candidatures: 31 },
  { month: "Déc", candidatures: 28 },
  { month: "Jan", candidatures: 35 },
];

const domainData = [
  { name: "Technologies", value: 35, fill: "hsl(var(--primary))" },
  { name: "Finance", value: 25, fill: "hsl(var(--secondary))" },
  { name: "Santé", value: 20, fill: "hsl(var(--accent))" },
  { name: "Éducation", value: 12, fill: "hsl(var(--muted-foreground))" },
  { name: "Autres", value: 8, fill: "hsl(var(--border))" },
];

const chartConfig = {
  candidatures: {
    label: "Candidatures",
    color: "hsl(var(--primary))",
  },
  domain: {
    label: "Domaine",
    color: "hsl(var(--primary))",
  },
};

export default function DashboardCharts({ isLoading, stats }: DashboardChartsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12 content-[auto] contain-intrinsic-size-[1px_400px]">
      <Card className="shadow-card border-0 bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <BarChart3 className="mr-2 h-5 w-5 text-primary" />
            Évolution des Candidatures
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="h-64 w-full"
          >
            <BarChart data={applicationData}>
              <XAxis 
                dataKey="month" 
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
              />
              <Bar 
                dataKey="candidatures" 
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                className="animate-fade-in"
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="shadow-card border-0 bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <PieChart className="mr-2 h-5 w-5 text-primary" />
            Répartition par Domaine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="h-64 w-full"
          >
            <RechartsPieChart>
              <Pie
                data={domainData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                className="animate-fade-in"
              >
                {domainData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip
                content={<ChartTooltipContent 
                  formatter={(value: any, name: any) => [
                    `${value}%`, 
                    name
                  ]} 
                />}
              />
              <ChartLegend
                content={<ChartLegendContent />}
              />
            </RechartsPieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}