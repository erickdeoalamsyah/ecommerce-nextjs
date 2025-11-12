"use client"
import { Ruler, Shirt, Loader2 } from "lucide-react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import tshirt from "../../../public/images/sizeShort.webp"
import longSleeve from "../../../public/images/sizeLong.webp"
import Image from "next/image"

export default function SizeGuide() {
    const [activeTab, setActiveTab] = useState("long-sleeve")
    const [isLoading, setIsLoading] = useState(false)

  const handleTabChange = (value: string) => {
    setIsLoading(true)
    setTimeout(() => {
      setActiveTab(value)
      setIsLoading(false)
    }, 800) // Simulate loading time
  }
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent"></div>
        <div className="relative container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Ruler className="w-8 h-8 text-red-600 mr-3" />
              <h1 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Size Guide
              </h1>
            </div>
            <p className="text-md text-gray-400 mb-8">Find your perfect fit with our comprehensive sizing chart</p>
            <Card className="bg-black border-red-900 mb-12">
            <CardHeader>
              <CardTitle className="text-md text-white flex items-center">
                <Shirt className="w-6 h-6 text-red-600 mr-3" />
                How to Measure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-between gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-red-600 font-bold text-xl">1</span>
                  </div>
                  <h3 className="font-semibold text-sm text-white mb-2">Width</h3>
                  <p className="text-gray-400 text-xs">Measure around the fullest part of your chest</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-red-600 font-bold text-xl">2</span>
                  </div>
                  <h3 className="font-semibold text-sm text-white mb-2">Length</h3>
                  <p className="text-gray-400 text-xs">From shoulder seam to bottom hem</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-red-600 font-bold text-xl">3</span>
                  </div>
                  <h3 className="font-semibold text-sm text-white mb-2">Sleeve</h3>
                  <p className="text-gray-400 text-xs">From shoulder seam to cuff</p>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-10 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Size Charts */}
          <Card className="bg-black border-red-600">
            <CardHeader>
              <CardTitle className="text-md text-white flex items-center">
                <Shirt className="w-6 h-6 text-red-600 mr-3" />
                Size Charts
              </CardTitle>
              <p className="text-gray-400 text-xs">Choose your garment type to view the size chart</p>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-black border border-red-600 mb-8 text-gray-200">
                  
                  <TabsTrigger
                    value="short-sleeve"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-xs text-bold uppercase p-2"
                    disabled={isLoading}
                  >
                    T-shirt
                  </TabsTrigger>
                  <TabsTrigger
                    value="long-sleeve"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-xs text-bold uppercase p-2"
                    disabled={isLoading}
                  >
                    Long Sleeve
                  </TabsTrigger>
                </TabsList>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-4">
                    <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                    <p className="text-gray-400">Loading size chart...</p>
                  </div>
                ) : (
                  <>
                    <TabsContent value="long-sleeve" className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-sm text-white mb-6">Long Sleeve Size Chart</h3>
                        <div className="max-w-md mx-auto">
                          <Image
                            src={longSleeve}
                            alt="Long Sleeve Size Chart"
                            className="w-full h-auto rounded-lg"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="short-sleeve" className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-sm text-white mb-6">T-shirt Size Chart</h3>
                        <div className="max-w-md mx-auto">
                          <Image
                            src={tshirt}
                            alt="T-short Size Chart"
                            className="w-full h-auto rounded-lg"
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </>
                )}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


