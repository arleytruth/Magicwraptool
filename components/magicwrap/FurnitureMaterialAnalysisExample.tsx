"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FurnitureMaterialAnalysis } from "./FurnitureMaterialAnalysis";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export function FurnitureMaterialAnalysisExample() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleAnalysisComplete = (analysisData: any) => {
    // This would be called when analysis is complete
    console.log("Material analysis complete:", analysisData);
    
    // In a real implementation, you would prepare the analyzed material properties
    // for the application process here
    
    toast({
      title: "Analiz Tamamlandı",
      description: "Malzeme özellikleri analiz edilip uygulamaya hazırlandı.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Furniture Material Analysis Integration Example</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            This is an example of how the FurnitureMaterialAnalysis component can be integrated 
            into the application workflow for furniture wrapping.
          </p>
          
          {!showAnalysis ? (
            <Button onClick={() => setShowAnalysis(true)}>
              Show Furniture Material Analysis
            </Button>
          ) : (
            <div className="space-y-6">
              <FurnitureMaterialAnalysis />
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowAnalysis(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    // In a real implementation, you would get the analysis data from the component
                    // and prepare it for the application process
                    handleAnalysisComplete({});
                  }}
                >
                  Use Analysis for Wrapping
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Integration Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">How to Integrate</h3>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Import the FurnitureMaterialAnalysis component</li>
                <li>Include it in your UI where material analysis is needed</li>
                <li>Handle the analysis results to prepare material properties for application</li>
                <li>Pass the analyzed properties to the wrapping process</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold">Prepared Material Properties</h3>
              <p className="text-sm text-muted-foreground mt-2">
                The component prepares the following material properties for the application process:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Texture type (wood, fabric, leather, vinyl, etc.)</li>
                <li>Color palette with primary and secondary colors</li>
                <li>Surface finish type (matte, glossy, satin, distressed)</li>
                <li>Pattern structure and direction</li>
                <li>Material characteristics (grain lines, weave pattern, embossing)</li>
                <li>Scale and detail level for proper application</li>
                <li>Lighting properties (reflectivity, light absorption, shadow intensity)</li>
                <li>Depth properties (wood grain depth, fabric texture depth, leather sheen level)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}