"use client";

import Image from "next/image";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { MaterialAnalysis } from "./VehicleMaterialAnalysis";
import { RotateCcw, Play, Check } from "lucide-react";

interface AppliedMaterialProperties {
  // Pattern properties
  patternScale: number;
  patternOrientation: number;
  seamlessTransitions: boolean;
  
  // Texture and color properties
  textureDepth: 'low' | 'medium' | 'high';
  colorAccuracy: boolean;
  
  // Finish properties
  reflectivity: 'matte' | 'glossy' | 'brushed' | 'chrome';
  
  // Surface-specific properties
  surfaces: {
    hood: boolean;
    roof: boolean;
    trunk: boolean;
    fenders: boolean;
    doors: boolean;
    quarterPanels: boolean;
    bumpers: boolean;
  };
}

export function VehicleMaterialApplication({
  materialAnalysis,
  objectImage,
  materialImage,
  onApply
}: {
  materialAnalysis: MaterialAnalysis | null;
  objectImage: string | null;
  materialImage: string | null;
  onApply: (appliedProperties: AppliedMaterialProperties) => void;
}) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isApplying, setIsApplying] = useState(false);
  const [appliedProperties, setAppliedProperties] = useState<AppliedMaterialProperties | null>(null);
  const [patternScale, setPatternScale] = useState(100);
  const [patternOrientation, setPatternOrientation] = useState(0);

  // Default applied properties based on material analysis
  const getDefaultAppliedProperties = (): AppliedMaterialProperties => {
    // Map textureType values from MaterialAnalysis to reflectivity
    let reflectivity: 'matte' | 'glossy' | 'brushed' | 'chrome' = 'glossy';
    if (materialAnalysis?.textureType) {
      switch (materialAnalysis.textureType) {
        case 'smooth':
        case 'matte':
          reflectivity = 'matte';
          break;
        case 'glossy':
        case 'satin':
          reflectivity = 'glossy';
          break;
        case 'brushed':
        case 'carbon fiber':
        case 'metallic':
          reflectivity = 'brushed';
          break;
        case 'chrome':
          reflectivity = 'chrome';
          break;
        case 'other':
          reflectivity = 'glossy';
          break;
        default:
          reflectivity = 'glossy';
      }
    }

    // Map surfaceReliefDepth values from MaterialAnalysis to textureDepth
    let textureDepth: 'low' | 'medium' | 'high' = 'medium';
    if (materialAnalysis?.surfaceReliefDepth) {
      textureDepth = materialAnalysis.surfaceReliefDepth;
    }

    return {
      // Pattern properties
      patternScale: 100,
      patternOrientation: 0,
      seamlessTransitions: true,
      
      // Texture and color properties
      textureDepth,
      colorAccuracy: true,
      
      // Finish properties
      reflectivity,
      
      // Surfaces
      surfaces: {
        hood: true,
        roof: true,
        trunk: true,
        fenders: true,
        doors: true,
        quarterPanels: true,
        bumpers: true
      }
    };
  };

  // Apply material to vehicle surfaces
  const handleApplyMaterial = () => {
    if (!materialAnalysis || !objectImage || !materialImage) {
      toast({
        title: t('common.error'),
        description: "Please provide material analysis and both images",
        variant: "destructive",
      });
      return;
    }

    setIsApplying(true);
    
    // Simulate the application process
    setTimeout(() => {
      const properties = {
        ...getDefaultAppliedProperties(),
        patternScale,
        patternOrientation
      };
      setAppliedProperties(properties);
      onApply(properties);
      setIsApplying(false);
      
      toast({
        title: "Malzeme Uygulandı",
        description: "Araç yüzeyleri malzeme özellikleriyle başarıyla güncellendi.",
      });
    }, 1500);
  };

  // Reset the application
  const handleReset = () => {
    setAppliedProperties(null);
    setPatternScale(100);
    setPatternOrientation(0);
    onApply(getDefaultAppliedProperties());
  };

  // Toggle surface application
  const toggleSurface = (surface: keyof AppliedMaterialProperties['surfaces']) => {
    if (appliedProperties) {
      setAppliedProperties({
        ...appliedProperties,
        surfaces: {
          ...appliedProperties.surfaces,
          [surface]: !appliedProperties.surfaces[surface]
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {t('vehicleMaterialApplication.title', 'Vehicle Material Application')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {materialAnalysis && objectImage && materialImage ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Object Preview */}
                <div>
                  <h3 className="font-semibold mb-2">
                    {t('vehicleMaterialApplication.vehiclePreview', 'Vehicle Preview')}
                  </h3>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="relative h-48 w-full">
                      <Image 
                        src={objectImage} 
                        alt="Vehicle" 
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                </div>
                
                {/* Material Preview */}
                <div>
                  <h3 className="font-semibold mb-2">
                    {t('vehicleMaterialApplication.materialPreview', 'Material Preview')}
                  </h3>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="relative h-48 w-full">
                      <Image 
                        src={materialImage} 
                        alt="Material" 
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Pattern Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {t('vehicleMaterialApplication.patternControls', 'Pattern Controls')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('vehicleMaterialApplication.scale', 'Pattern Scale')}: {patternScale}%
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        value={patternScale}
                        onChange={(e) => setPatternScale(parseInt(e.target.value))}
                        className="w-full"
                        disabled={isApplying}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('vehicleMaterialApplication.orientation', 'Pattern Orientation')}: {patternOrientation}°
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={patternOrientation}
                        onChange={(e) => setPatternOrientation(parseInt(e.target.value))}
                        className="w-full"
                        disabled={isApplying}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Surface Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {t('vehicleMaterialApplication.surfaceSelection', 'Surface Selection')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant={appliedProperties?.surfaces.hood ? "default" : "outline"}
                        onClick={() => toggleSurface('hood')}
                        disabled={isApplying}
                        size="sm"
                      >
                        {t('vehicleMaterialApplication.hood', 'Hood')}
                      </Button>
                      <Button
                        variant={appliedProperties?.surfaces.roof ? "default" : "outline"}
                        onClick={() => toggleSurface('roof')}
                        disabled={isApplying}
                        size="sm"
                      >
                        {t('vehicleMaterialApplication.roof', 'Roof')}
                      </Button>
                      <Button
                        variant={appliedProperties?.surfaces.trunk ? "default" : "outline"}
                        onClick={() => toggleSurface('trunk')}
                        disabled={isApplying}
                        size="sm"
                      >
                        {t('vehicleMaterialApplication.trunk', 'Trunk')}
                      </Button>
                      <Button
                        variant={appliedProperties?.surfaces.fenders ? "default" : "outline"}
                        onClick={() => toggleSurface('fenders')}
                        disabled={isApplying}
                        size="sm"
                      >
                        {t('vehicleMaterialApplication.fenders', 'Fenders')}
                      </Button>
                      <Button
                        variant={appliedProperties?.surfaces.doors ? "default" : "outline"}
                        onClick={() => toggleSurface('doors')}
                        disabled={isApplying}
                        size="sm"
                      >
                        {t('vehicleMaterialApplication.doors', 'Doors')}
                      </Button>
                      <Button
                        variant={appliedProperties?.surfaces.quarterPanels ? "default" : "outline"}
                        onClick={() => toggleSurface('quarterPanels')}
                        disabled={isApplying}
                        size="sm"
                      >
                        {t('vehicleMaterialApplication.quarterPanels', 'Quarter Panels')}
                      </Button>
                      <Button
                        variant={appliedProperties?.surfaces.bumpers ? "default" : "outline"}
                        onClick={() => toggleSurface('bumpers')}
                        disabled={isApplying}
                        size="sm"
                        className="col-span-2"
                      >
                        {t('vehicleMaterialApplication.bumpers', 'Bumpers')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Application Controls */}
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={handleApplyMaterial} 
                  disabled={isApplying}
                  className="flex-1 min-w-[120px]"
                >
                  {isApplying ? (
                    <>
                      <Play className="mr-2 h-4 w-4 animate-spin" />
                      {t('vehicleMaterialApplication.applying', 'Applying...')}
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      {t('vehicleMaterialApplication.applyMaterial', 'Apply Material')}
                    </>
                  )}
                </Button>
                
                {appliedProperties && (
                  <Button 
                    variant="outline" 
                    onClick={handleReset}
                    className="flex-1 min-w-[120px]"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    {t('vehicleMaterialApplication.reset', 'Reset')}
                  </Button>
                )}
              </div>
              
              {/* Applied Properties Preview */}
              {appliedProperties && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-3">
                    {t('vehicleMaterialApplication.appliedProperties', 'Applied Properties')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Pattern Scale:</span> {appliedProperties.patternScale}%
                    </div>
                    <div>
                      <span className="font-medium">Pattern Orientation:</span> {appliedProperties.patternOrientation}°
                    </div>
                    <div>
                      <span className="font-medium">Texture Depth:</span> {appliedProperties.textureDepth}
                    </div>
                    <div>
                      <span className="font-medium">Reflectivity:</span> {appliedProperties.reflectivity}
                    </div>
                    <div>
                      <span className="font-medium">Seamless Transitions:</span> {appliedProperties.seamlessTransitions ? 'Enabled' : 'Disabled'}
                    </div>
                    <div>
                      <span className="font-medium">Color Accuracy:</span> {appliedProperties.colorAccuracy ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>{t('vehicleMaterialApplication.needAnalysis', 'Please complete material analysis and upload both vehicle and material images')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
