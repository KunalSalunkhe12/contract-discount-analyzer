'use client';

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const WhiskerPlot = ({ title, data, spending, setSpending, color }) => {
  const min = -15;
  const max = 100;
  const range = max - min;
  const median = data.sort((a, b) => a - b)[Math.floor(data.length / 2)];
  const minSavings = Math.max(0, spending - Math.max(...data));
  const maxSavings = Math.max(0, spending - Math.min(...data));

  return (
    <div className="mb-8">
      <h3
        className="text-white mb-2 flex items-center"
      >
        <Badge className={`mr-2 ${color}`}></Badge>
        {title}
      </h3>
      <div
        className="relative h-12 bg-gray-800 rounded-lg"
      >
        <div
          className="absolute top-0 bottom-0 bg-gray-700"
          style={{
            left: `${((Math.min(...data) - min) / range) * 100}%`,
            right: `${((max - Math.max(...data)) / range) * 100}%`,
          }}
        ></div>
        <div
          className="absolute top-0 bottom-0 w-1 bg-red-500"
          style={{ left: `${((median - min) / range) * 100}%` }}
        ></div>
        {data.map((value, index) => (
          <div
            key={index}
            className={`absolute w-2 h-2 rounded-full top-1/2 transform -translate-y-1/2 ${color}`}
            style={{ left: `${((value - min) / range) * 100}%` }}
            title={`Value: ${value}`}
          ></div>
        ))}
        <div
          className="absolute -bottom-6 left-0 text-xs text-gray-400"
        >
          {min}%
        </div>
        <div
          className="absolute -bottom-6 right-0 text-xs text-gray-400"
        >
          {max}%
        </div>
        <div
          className="absolute -top-6 text-xs text-gray-400"
          style={{ left: `${((median - min) / range) * 100}%` }}
        >
          {median}%
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <Label
          htmlFor={`spending-${title}`}
          className="mr-2 text-white"
        >
          Your spending:
        </Label>
        <Input
          id={`spending-${title}`}
          type="number"
          value={spending}
          onChange={(e) => setSpending(Number(e.target.value))}
          className="w-24 mr-4 bg-gray-700 text-white border-gray-600 focus:border-blue-500"
        />

        <span className="text-white">
          Minimum savings: ${minSavings.toFixed(2)}
        </span>
        <span className="text-white ml-4">
          Maximum savings: ${maxSavings.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export function DiscountVisualization({ carrier }) {
  const [spendings, setSpendings] = useState([0, 0, 0, 0, 0]);

  const plotsData = {
    UPS: [
      {
        title: "Base Rate Discount",
        data: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
        color: "bg-blue-500",
      },
      {
        title: "Fuel Surcharge Discount",
        data: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
        color: "bg-green-500",
      },
      {
        title: "Residential Surcharge Waiver",
        data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
        color: "bg-yellow-500",
      },
      {
        title: "Additional Handling Fee Waiver",
        data: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45],
        color: "bg-purple-500",
      },
      {
        title: "Dimensional Weight Divisor",
        data: [139, 150, 166, 180, 194, 210, 225, 240, 250, 260],
        color: "bg-pink-500",
      },
    ],

    FedEx: [
      {
        title: "Base Rate Discount",
        data: [12, 18, 22, 28, 32, 38, 42, 48, 52, 58],
        color: "bg-blue-500",
      },
      {
        title: "Fuel Surcharge Discount",
        data: [8, 12, 18, 22, 28, 32, 38, 42, 48, 52],
        color: "bg-green-500",
      },
      {
        title: "Residential Surcharge Waiver",
        data: [5, 15, 25, 35, 45, 55, 65, 75, 85, 95],
        color: "bg-yellow-500",
      },
      {
        title: "Additional Handling Fee Waiver",
        data: [2, 8, 12, 18, 22, 28, 32, 38, 42, 48],
        color: "bg-purple-500",
      },
      {
        title: "Dimensional Weight Divisor",
        data: [140, 155, 170, 185, 200, 215, 230, 245, 255, 265],
        color: "bg-pink-500",
      },
    ],

    USPS: [
      {
        title: "Base Rate Discount",
        data: [8, 13, 18, 23, 28, 33, 38, 43, 48, 53],
        color: "bg-blue-500",
      },
      {
        title: "Fuel Surcharge Discount",
        data: [3, 8, 13, 18, 23, 28, 33, 38, 43, 48],
        color: "bg-green-500",
      },
      {
        title: "Residential Surcharge Waiver",
        data: [0, 5, 15, 25, 35, 45, 55, 65, 75, 85],
        color: "bg-yellow-500",
      },
      {
        title: "Additional Handling Fee Waiver",
        data: [0, 3, 8, 13, 18, 23, 28, 33, 38, 43],
        color: "bg-purple-500",
      },
      {
        title: "Dimensional Weight Divisor",
        data: [135, 145, 160, 175, 190, 205, 220, 235, 245, 255],
        color: "bg-pink-500",
      },
    ],
  };

  const totalSavings = spendings.reduce((total, spending, index) => {
    const data = plotsData[carrier][index].data;
    const minSavings = Math.max(0, spending - Math.max(...data));
    const maxSavings = Math.max(0, spending - Math.min(...data));
    return total + (minSavings + maxSavings) / 2;
  }, 0);

  return (
    <Card
      className="w-full mx-auto bg-gray-900 text-white"
    >
      <CardHeader>
        <CardTitle
          className="text-2xl font-bold mb-4"
        >
          {carrier} Discount Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="mb-4 flex items-center flex-wrap"
        >
          {plotsData[carrier].map((plot, index) => (
            <div
              key={index}
              className="flex items-center mr-4 mb-2"
            >
              <Badge
                className={`mr-1 ${plot.color}`}
              ></Badge>
              <span className="text-sm">
                {plot.title}
              </span>
            </div>
          ))}
          <div
            className="flex items-center mr-4 mb-2"
          >
            <div
              className="w-4 h-4 bg-red-500 mr-1"
            ></div>
            <span className="text-sm">
              Median
            </span>
          </div>
        </div>
        {plotsData[carrier].map((plot, index) => (
          <WhiskerPlot
            key={index}
            title={plot.title}
            data={plot.data}
            spending={spendings[index]}
            setSpending={(value) => {
              const newSpendings = [...spendings];
              newSpendings[index] = value;
              setSpendings(newSpendings);
            }}
            color={plot.color}
          />
        ))}
        <div className="mt-8 text-xl font-bold">
          Total potential savings: ${totalSavings.toFixed(2)}
        </div>
        <div className="mt-4">
          <h4
            className="text-lg font-semibold mb-2"
          >
            Savings Breakdown:
          </h4>
          {plotsData[carrier].map((plot, index) => {
            const minSavings = Math.max(
              0,
              spendings[index] - Math.max(...plot.data),
            );
            const maxSavings = Math.max(
              0,
              spendings[index] - Math.min(...plot.data),
            );
            return (
              <div
                key={index}
                className="flex items-center justify-between mb-1"
              >
                <span>{plot.title}:</span>
                <span>
                  ${minSavings.toFixed(2)} - ${maxSavings.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
