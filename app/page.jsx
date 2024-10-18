"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InputForm } from "./(components)/input-form";
import { DiscountVisualization } from "./(components)/discount-visualization";

export default function ShippingDiscountAnalyzer() {
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = (data) => {
    setShowResults(true);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Shipping Discount Analyzer
          </CardTitle>
          <CardDescription className="text-gray-300">
            Understand appropriate contract level discounts based on your
            shipping spend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InputForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>

      {showResults && (
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Discount Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="ups">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ups">UPS</TabsTrigger>
                <TabsTrigger value="fedex">FedEx</TabsTrigger>
                <TabsTrigger value="usps">USPS</TabsTrigger>
              </TabsList>
              <TabsContent value="ups">
                <ScrollArea className="h-[600px] w-full rounded-md border border-gray-700 p-4">
                  <DiscountVisualization carrier="UPS" />
                </ScrollArea>
              </TabsContent>
              <TabsContent value="fedex">
                <ScrollArea className="h-[600px] w-full rounded-md border border-gray-700 p-4">
                  <DiscountVisualization carrier="FedEx" />
                </ScrollArea>
              </TabsContent>
              <TabsContent value="usps">
                <ScrollArea className="h-[600px] w-full rounded-md border border-gray-700 p-4">
                  <DiscountVisualization carrier="USPS" />
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
