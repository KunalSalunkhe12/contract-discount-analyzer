"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSignIcon,
  BuildingIcon,
  MailIcon,
  TruckIcon,
  WeightIcon,
} from "lucide-react";

export function InputForm({ onSubmit }) {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [annualSpend, setAnnualSpend] = useState("");
  const [originLocations, setOriginLocations] = useState("");
  const [destinationLocations, setDestinationLocations] = useState("");
  const [minWeight, setMinWeight] = useState("");
  const [maxWeight, setMaxWeight] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const carriers = ["ups", "fedex", "usps"];

    try {
      const responses = await Promise.all(
        carriers.map((carrier) =>
          fetch(`https://contract-shipping-api.onrender.com/get-discounts`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              carrier,
              annual_spend: annualSpend,
              top_n_service_types: 5,
              tolerance: 0.2,
            }),
          }).then((response) => {
            if (!response.ok) {
              throw new Error(
                `Failed to fetch ${carrier.toUpperCase()} discounts`
              );
            }
            return response.json();
          })
        )
      );

      const discountData = {
        ups: responses[0],
        fedex: responses[1],
        usps: responses[2],
        annualSpend,
      };
      onSubmit(discountData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="company-name" className="text-lg font-semibold">
          Company Name
        </Label>
        <div className="relative">
          <BuildingIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Enter your company name"
            className="pl-10 bg-gray-700 text-white border-gray-600 focus:border-blue-500"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-lg font-semibold">
          Email Address
        </Label>
        <div className="relative">
          <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="email"
            placeholder="Enter your email address"
            className="pl-10 bg-gray-700 text-white border-gray-600 focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company-type" className="text-lg font-semibold">
          Company Type
        </Label>
        <Select onValueChange={setCompanyType} required>
          <SelectTrigger className="bg-gray-700 text-white border-gray-600 focus:border-blue-500">
            <SelectValue placeholder="Select company type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 text-white border-gray-600">
            <SelectItem value="ecommerce">E-commerce</SelectItem>
            <SelectItem value="manufacturing">Manufacturing</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="wholesale">Wholesale</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="annual-spend" className="text-lg font-semibold">
          Annual Shipping Spend (USD)
        </Label>
        <div className="relative">
          <DollarSignIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="number"
            placeholder="Enter your annual shipping spend"
            className="pl-10 bg-gray-700 text-white border-gray-600 focus:border-blue-500"
            value={annualSpend}
            onChange={(e) => setAnnualSpend(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="origin-locations" className="text-lg font-semibold">
          Origin Locations
        </Label>
        <div className="relative">
          <TruckIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Enter origin cities separated by commas"
            className="pl-10 bg-gray-700 text-white border-gray-600 focus:border-blue-500"
            value={originLocations}
            onChange={(e) => setOriginLocations(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="destination-locations"
          className="text-lg font-semibold"
        >
          Destination Locations
        </Label>
        <div className="relative">
          <TruckIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Enter destination cities separated by commas"
            className="pl-10 bg-gray-700 text-white border-gray-600 focus:border-blue-500"
            value={destinationLocations}
            onChange={(e) => setDestinationLocations(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="min-weight" className="text-lg font-semibold">
            Minimum Package Weight (lbs)
          </Label>
          <div className="relative">
            <WeightIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="number"
              placeholder="Min weight"
              className="pl-10 bg-gray-700 text-white border-gray-600 focus:border-blue-500"
              value={minWeight}
              onChange={(e) => setMinWeight(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="max-weight" className="text-lg font-semibold">
            Maximum Package Weight (lbs)
          </Label>
          <div className="relative">
            <WeightIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="number"
              placeholder="Max weight"
              className="pl-10 bg-gray-700 text-white border-gray-600 focus:border-blue-500"
              value={maxWeight}
              onChange={(e) => setMaxWeight(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Analyzing..." : "Analyze Discounts"}
      </Button>

      {error && <div className="text-red-500 text-center">{error}</div>}
    </form>
  );
}
