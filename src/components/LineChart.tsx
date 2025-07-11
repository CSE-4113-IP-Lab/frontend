import React, { useEffect, useRef } from "react";
import { Chart, ChartConfiguration, ChartOptions } from "chart.js/auto";

interface LineChartProps {
  allLabels: string[];
  allData: number[];
}

const LineChart: React.FC<LineChartProps> = ({ allLabels, allData }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const canvas = chartRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Destroy previous chart instance if it exists
    if ((canvas as any).chart instanceof Chart) {
      (canvas as any).chart.destroy();
    }

    const config: ChartConfiguration = {
      type: "line",
      data: {
        labels: allLabels,
        datasets: [
          {
            label: "Info",
            data: allData,
            backgroundColor: "#1E2A44",
            borderColor: "#1E2A44",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: "category",
          },
          y: {
            min: 2,
            beginAtZero: false,
          },
        },
      } as ChartOptions<"line">,
    };

    const chartInstance = new Chart(context, config);
    (canvas as any).chart = chartInstance;

    return () => {
      chartInstance.destroy();
    };
  }, [allLabels, allData]);

  return (
    <div className="overflow-x-auto h-[60svh] min-h-[300px]">
      <canvas
        ref={chartRef}
        className="w-[95%] min-w-[400px] max-w-[800px] mx-auto"
      />
    </div>
  );
};

export default LineChart;
