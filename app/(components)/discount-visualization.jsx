"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const WhiskerPlot = ({ title, data, spending, setSpending, color }) => {
  const min = data.Min_Discount;
  const max = data.Max_Discount;
  const range = max - min;
  const average = data.Average_Discount;

  console.log(data.Min_Discount, data.Max_Discount, data.Average_Discount);

  const minSavings = Math.max(spending * (data.Max_Discount / 100) * -1);
  const maxSavings = Math.max(spending * (data.Min_Discount / 100) * -1);

  return (
    <div className="mb-8">
      <h3 className="text-white mb-2 flex items-center">
        <Badge className={`mr-2 ${color}`}></Badge>
        {title}
      </h3>
      <div className="relative h-12 bg-gray-800 rounded-lg">
        <div
          className="absolute top-0 bottom-0 bg-gray-700"
          style={{
            left: `${((data.Min_Discount - min) / range) * 100}%`,
            right: `${((max - data.Max_Discount) / range) * 100}%`,
          }}
        ></div>
        <div
          className="absolute top-0 bottom-0 w-1 bg-red-500"
          style={{ left: `${((average - min) / range) * 100}%` }}
        ></div>
        {data.Discount_Values.map((value, index) => (
          <div
            key={index}
            className={`absolute w-2 h-2 rounded-full top-1/2 transform -translate-y-1/2 ${color}`}
            style={{ left: `${((value - min) / range) * 100}%` }}
            title={`Value: ${value}`}
          ></div>
        ))}
        <div className="absolute -bottom-6 left-0 text-xs text-gray-400">
          {min.toFixed(2)}%
        </div>
        <div className="absolute -bottom-6 right-0 text-xs text-gray-400">
          {max.toFixed(2)}%
        </div>
        <div
          className="absolute -top-6 text-xs text-gray-400"
          style={{ left: `${((average - min) / range) * 100}%` }}
        >
          {average.toFixed(2)}%
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <Label htmlFor={`spending-${title}`} className="mr-2 text-white">
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

export function DiscountVisualization({ carrier, data, annualSpend }) {
  const getRandomPercentage = () => {
    const percent = Math.random() * 5 + 5;
    return percent.toFixed(0);
  };

  const carrierData = data.error ? [] : data;
  const [spendings, setSpendings] = useState(
    carrierData.map(() => (annualSpend * getRandomPercentage()) / 100)
  );

  if (data.error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{data.error}</AlertDescription>
      </Alert>
    );
  }

  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-red-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-cyan-500",
  ];

  const totalSavings = spendings.reduce((total, spending, index) => {
    const maxSavings = spending * (data[index]["Min Discount"] / 100) * -1;
    return total + maxSavings;
  }, 0);

  return (
    <Card className="w-full mx-auto bg-gray-900 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4">
          {carrier} Discount Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center flex-wrap">
          {data.map((plot, index) => (
            <div key={index} className="flex items-center mr-4 mb-2">
              <Badge
                className={`mr-1 ${colors[index % colors.length]}`}
              ></Badge>
              <span className="text-sm">{plot["Service Level"]}</span>
            </div>
          ))}
          <div className="flex items-center mr-4 mb-2">
            <div className="w-4 h-4 bg-red-500 mr-1"></div>
            <span className="text-sm">Average</span>
          </div>
        </div>
        {data.map((plot, index) => (
          <WhiskerPlot
            key={index}
            title={plot["Service Level"]}
            data={{
              Min_Discount: plot["Min Discount"],
              Max_Discount: plot["Max Discount"],
              Average_Discount: plot["Average Discount"],
              Contracts_Count: plot["Contracts Count"],
              Discount_Values: plot["Discount Values"],
            }}
            spending={spendings[index].toFixed(0)}
            setSpending={(value) => {
              const newSpendings = [...spendings];
              newSpendings[index] = value;
              setSpendings(newSpendings);
            }}
            color={colors[index % colors.length]}
          />
        ))}
        <div className="mt-8 text-xl font-bold">
          Total potential savings: ${totalSavings.toFixed(2)}
        </div>
        <div className="mt-4">
          <h4 className="text-lg font-semibold mb-2">Savings Breakdown:</h4>
          {data.map((plot, index) => {
            const minSavings = Math.abs(
              Math.max(
                spendings[index] -
                  (1 - plot["Max Discount"] / 100) * spendings[index]
              )
            );
            const maxSavings = Math.abs(
              Math.max(
                spendings[index] -
                  (1 - plot["Min Discount"] / 100) * spendings[index]
              )
            );
            return (
              <div
                key={index}
                className="flex items-center justify-between mb-1"
              >
                <span>{plot["Service Level"]}:</span>
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
