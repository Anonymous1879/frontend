"use client";

import { Tweet } from 'react-tweet';
import React, { useEffect, useState } from "react";
import { AiFillStar } from 'react-icons/ai';

export default function CleanLayout() {
  return (
    <div className="min-h-screen bg-[#fafafa]"> {/* Off-white background */}
      {/* Hero Section with How to Use */}
      <section className="py-24 bg-gradient-to-b from-gray-50/50 to-[#fafafa]">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold text-center mb-20 text-gray-900">
            How to Use <span className="text-gray-900">NoaiGPT</span>
          </h1>
          
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
            {/* Steps Cards */}
            <div className="lg:w-1/2 space-y-8">
              {/* Step 1 */}
              <div className="group bg-white rounded-3xl p-8 shadow-[0_0_20px_rgba(0,0,0,0.03)] hover:shadow-[0_0_30px_rgba(0,0,0,0.05)] transition-all duration-300">
                <div className="flex items-start gap-6">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-medium text-lg">
                    1
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Create Your Account</h3>
                    <p className="text-gray-600 leading-relaxed">Get started with a free account. No credit card required - sign up in just seconds.</p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group bg-white rounded-3xl p-8 shadow-[0_0_20px_rgba(0,0,0,0.03)] hover:shadow-[0_0_30px_rgba(0,0,0,0.05)] transition-all duration-300">
                <div className="flex items-start gap-6">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-medium text-lg">
                    2
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Choose Your Plan</h3>
                    <p className="text-gray-600 leading-relaxed">Select from our flexible plans designed for different needs and usage levels.</p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group bg-white rounded-3xl p-8 shadow-[0_0_20px_rgba(0,0,0,0.03)] hover:shadow-[0_0_30px_rgba(0,0,0,0.05)] transition-all duration-300">
                <div className="flex items-start gap-6">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-medium text-lg">
                    3
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Start Using NoaiGPT</h3>
                    <p className="text-gray-600 leading-relaxed">Access our intuitive interface and begin exploring AI capabilities instantly.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tweet Section */}
            <div className="lg:w-1/2 flex items-center justify-center">
              <div className="bg-white rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.04)] p-10 w-full max-w-xl">
                <Tweet id="1732824684683784516" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}