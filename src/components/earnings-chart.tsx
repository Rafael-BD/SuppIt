"use client";
import React, { useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/src/components/ui/chart";
import { Award, ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/src/components/ui/select";

const defaultChartData = [
    { month: "January", earnings: 0 },
    { month: "February", earnings: 0 },
    { month: "March", earnings: 0 },
    { month: "April", earnings: 0 },
    { month: "May", earnings: 0 },
    { month: "June", earnings: 0 },
    { month: "July", earnings: 0 },
    { month: "August", earnings: 0 },
    { month: "September", earnings: 0 },
    { month: "October", earnings: 0 },
    { month: "November", earnings: 0 },
    { month: "December", earnings: 0 },
];

const chartConfig = {
    earnings: {
        label: "Earnings",
        color: "hsl(var(--chart-1))",
        icon: Award,
    },
} satisfies ChartConfig;

type ChartData = { month: string; earnings: number };
type YearlyData = { year: number; months: ChartData[] };

const mergeChartData = (defaultData: ChartData[], actualData: ChartData[]): ChartData[] => {
    const mergedData = defaultData.map((defaultItem) => {
        const actualItem = actualData.find((item) => item.month === defaultItem.month);
        return actualItem ? actualItem : defaultItem;
    });
    return mergedData;
};

const EarningsChart = ({ size, data = [] }: { size: number; data: YearlyData[] }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const handleYearChange = (year: number) => {
        setSelectedYear(year);
    };

    const currentYearData = data.find(d => d.year === selectedYear)?.months || [];
    const mergedData = mergeChartData(defaultChartData, currentYearData);

    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

    return (
        <div className={`w-full flex flex-col items-center`}> 
            <div className="flex justify-center items-center mb-4 w-1/4">
                <button onClick={() => handleYearChange(selectedYear - 1)}>
                    <ChevronLeft />
                </button>
                <Select value={selectedYear.toString()} onValueChange={(value) => handleYearChange(parseInt(value, 10))}>
                    <SelectTrigger className="mx-2 bg-transparent appearance-none">
                        {selectedYear}
                    </SelectTrigger>
                    <SelectContent>
                    {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>
                        {year}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <button onClick={() => handleYearChange(selectedYear + 1)}>
                    <ChevronRight />
                </button>
            </div>
            <ChartContainer config={chartConfig} className="max-h-80 w-full">
                <BarChart width={600} height={400} data={mergedData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <YAxis
                        tickFormatter={(value) => `$ ${value}`}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="earnings" fill="var(--color-earnings)" radius={4} />
                </BarChart>
            </ChartContainer>
        </div>
    );
};

export default EarningsChart;
