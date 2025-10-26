"use client";

import Image from "next/image";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { MaterialAnalysis } from "./VehicleMaterialAnalysis";
import { Play, RotateCcw, Check, Sun, Moon, Cloud } from "lucide-react";

interface RealisticLightingProperties {
  lightingConditions: 'natural' | 'studio' | 'indoor' | 'outdoor';
  shadowProperties: {
    intensity: number;
    softness: number;
    direction: number;
  };
  reflectionProperties: {
    intensity: number;
    sharpness: number;
    type: 'matte' | 'glossy' | 'brushed' | 'chrome';
  };
  ambientOcclusion: boolean;
  edgeTreatment: 'sharp' | 'soft' | 'blended';
}

export function VehicleLightingRealism({
  materialAnalysis,
  objectImage,
  materialImage,
  onLightingApply
}: {
  materialAnalysis: MaterialAnalysis | null;
  objectImage: string | null;
  materialImage: string | null;
  onLightingApply: (lightingProperties: RealisticLightingProperties) => void;
}) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lightingProperties, setLightingProperties] = useState<RealisticLightingProperties | null>(null);
  const [lightingCondition, setLightingCondition] = useState<'natural' | 'studio' | 'indoor' | 'outdoor'>('natural');
  const [shadowIntensity, setShadowIntensity] = useState(70);
  const [shadowSoftness, setShadowSoftness] = useState(50);
  const [shadowDirection, setShadowDirection] = useState(45);
  const [reflectionIntensity, setReflectionIntensity] = useState(80);
  const [reflectionSharpness, setReflectionSharpness] = useState(70);
  const [ambientOcclusion, setAmbientOcclusion] = useState(true);
  const [edgeTreatment, setEdgeTreatment] = useState<'sharp' | 'soft' | 'blended'>('blended');

  // Default lighting properties based on material analysis
  const getDefaultLightingProperties = (): RealisticLightingProperties => {
    // Map textureType values from MaterialAnalysis to reflection type
    let reflectionType: 'matte' | 'glossy' | 'brushed' | 'chrome' = 'glossy';
    if (materialAnalysis?.textureType) {
      switch (materialAnalysis.textureType) {
        case 'smooth':
        case 'matte':
          reflectionType = 'matte';
          break;
        case 'glossy':
        case 'satin':
          reflectionType = 'glossy';
          break;
        case 'brushed':
        case 'carbon fiber':
        case 'metallic':
          reflectionType = 'brushed';
          break;
        case 'chrome':
          reflectionType = 'chrome';
          break;
        case 'other':
          reflectionType = 'glossy';
          break;
        default:
          reflectionType = 'glossy';
      }
    }

    return {
      lightingConditions: 'natural',
      shadowProperties: {
        intensity: 70,
        softness: 50,
        direction: 45
      },
      reflectionProperties: {
        intensity: materialAnalysis?.reflectivity || 80,
        sharpness: 70,
        type: reflectionType
      },
      ambientOcclusion: true,
      edgeTreatment: 'blended'
    };
  };

  // Apply lighting and realism effects
  const handleApplyLighting = () => {
    if (!materialAnalysis || !objectImage || !materialImage) {
      toast({
        title: t('common.error'),
        description: "Please provide material analysis and both images",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate the lighting process
    setTimeout(() => {
      const properties: RealisticLightingProperties = {
        lightingConditions: lightingCondition,
        shadowProperties: {
          intensity: shadowIntensity,
          softness: shadowSoftness,
          direction: shadowDirection
        },
        reflectionProperties: {
          intensity: reflectionIntensity,
          sharpness: reflectionSharpness,
          type:
            materialAnalysis.textureType === 'matte' || materialAnalysis.textureType === 'smooth'
              ? 'matte'
              : materialAnalysis.textureType === 'glossy'
              ? 'glossy'
              : materialAnalysis.textureType === 'brushed' ||
                materialAnalysis.textureType === 'carbon fiber' ||
                materialAnalysis.textureType === 'metallic'
              ? 'brushed'
              : materialAnalysis.textureType === 'chrome'
              ? 'chrome'
              : 'glossy'
        },
        ambientOcclusion,
        edgeTreatment
      };
      
      setLightingProperties(properties);
      onLightingApply(properties);
      setIsProcessing(false);
      
      toast({
        title: "Işıklandırma Uygulandı",
        description: "Gerçekçi ışık efektleri başarıyla sahneye aktarıldı.",
      });
    }, 2000);
  };

  // Reset the lighting
  const handleReset = () => {
    setLightingProperties(null);
    setLightingCondition('natural');
    setShadowIntensity(70);
    setShadowSoftness(50);
    setShadowDirection(45);
    setReflectionIntensity(80);
    setReflectionSharpness(70);
    setAmbientOcclusion(true);
    setEdgeTreatment('blended');
    onLightingApply(getDefaultLightingProperties());
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {t('vehicleLightingRealism.title', 'Vehicle Lighting & Realism')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {materialAnalysis && objectImage && materialImage ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Object Preview */}
                <div>
                  <h3 className="font-semibold mb-2">
                    {t('vehicleLightingRealism.vehiclePreview', 'Vehicle Preview')}
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
                    {t('vehicleLightingRealism.materialPreview', 'Material Preview')}
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
              
              {/* Lighting Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sun className="h-5 w-5" />
                      {t('vehicleLightingRealism.lighting', 'Lighting Conditions')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant={lightingCondition === 'natural' ? "default" : "outline"}
                        onClick={() => setLightingCondition('natural')}
                        disabled={isProcessing}
                        size="sm"
                      >
                        <Sun className="mr-2 h-4 w-4" />
                        {t('vehicleLightingRealism.natural', 'Natural')}
                      </Button>
                      <Button
                        variant={lightingCondition === 'studio' ? "default" : "outline"}
                        onClick={() => setLightingCondition('studio')}
                        disabled={isProcessing}
                        size="sm"
                      >
                        <Cloud className="mr-2 h-4 w-4" />
                        {t('vehicleLightingRealism.studio', 'Studio')}
                      </Button>
                      <Button
                        variant={lightingCondition === 'indoor' ? "default" : "outline"}
                        onClick={() => setLightingCondition('indoor')}
                        disabled={isProcessing}
                        size="sm"
                      >
                        <Moon className="mr-2 h-4 w-4" />
                        {t('vehicleLightingRealism.indoor', 'Indoor')}
                      </Button>
                      <Button
                        variant={lightingCondition === 'outdoor' ? "default" : "outline"}
                        onClick={() => setLightingCondition('outdoor')}
                        disabled={isProcessing}
                        size="sm"
                      >
                        <Sun className="mr-2 h-4 w-4" />
                        {t('vehicleLightingRealism.outdoor', 'Outdoor')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Shadow Controls */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {t('vehicleLightingRealism.shadows', 'Shadow Properties')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('vehicleLightingRealism.intensity', 'Intensity')}: {shadowIntensity}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={shadowIntensity}
                        onChange={(e) => setShadowIntensity(parseInt(e.target.value))}
                        className="w-full"
                        disabled={isProcessing}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('vehicleLightingRealism.softness', 'Softness')}: {shadowSoftness}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={shadowSoftness}
                        onChange={(e) => setShadowSoftness(parseInt(e.target.value))}
                        className="w-full"
                        disabled={isProcessing}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('vehicleLightingRealism.direction', 'Direction')}: {shadowDirection}°
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={shadowDirection}
                        onChange={(e) => setShadowDirection(parseInt(e.target.value))}
                        className="w-full"
                        disabled={isProcessing}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Reflection Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {t('vehicleLightingRealism.reflections', 'Reflection Properties')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('vehicleLightingRealism.intensity', 'Intensity')}: {reflectionIntensity}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={reflectionIntensity}
                        onChange={(e) => setReflectionIntensity(parseInt(e.target.value))}
                        className="w-full"
                        disabled={isProcessing}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('vehicleLightingRealism.sharpness', 'Sharpness')}: {reflectionSharpness}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={reflectionSharpness}
                        onChange={(e) => setReflectionSharpness(parseInt(e.target.value))}
                        className="w-full"
                        disabled={isProcessing}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('vehicleLightingRealism.type', 'Type')}: {materialAnalysis.textureType}
                      </label>
                      <div className="p-3 bg-muted rounded">
                        <p className="text-sm">
                          {t('vehicleLightingRealism.autoDetected', 'Auto-detected from material analysis')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Additional Effects */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {t('vehicleLightingRealism.effects', 'Additional Effects')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">
                        {t('vehicleLightingRealism.ambientOcclusion', 'Ambient Occlusion')}
                      </label>
                      <Button
                        variant={ambientOcclusion ? "default" : "outline"}
                        onClick={() => setAmbientOcclusion(!ambientOcclusion)}
                        disabled={isProcessing}
                        size="sm"
                      >
                        {ambientOcclusion ? t('common.enabled', 'Enabled') : t('common.disabled', 'Disabled')}
                      </Button>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('vehicleLightingRealism.edgeTreatment', 'Edge Treatment')}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant={edgeTreatment === 'sharp' ? "default" : "outline"}
                          onClick={() => setEdgeTreatment('sharp')}
                          disabled={isProcessing}
                          size="sm"
                        >
                          {t('vehicleLightingRealism.sharp', 'Sharp')}
                        </Button>
                        <Button
                          variant={edgeTreatment === 'soft' ? "default" : "outline"}
                          onClick={() => setEdgeTreatment('soft')}
                          disabled={isProcessing}
                          size="sm"
                        >
                          {t('vehicleLightingRealism.soft', 'Soft')}
                        </Button>
                        <Button
                          variant={edgeTreatment === 'blended' ? "default" : "outline"}
                          onClick={() => setEdgeTreatment('blended')}
                          disabled={isProcessing}
                          size="sm"
                        >
                          {t('vehicleLightingRealism.blended', 'Blended')}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Processing Controls */}
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={handleApplyLighting} 
                  disabled={isProcessing}
                  className="flex-1 min-w-[120px]"
                >
                  {isProcessing ? (
                    <>
                      <Play className="mr-2 h-4 w-4 animate-spin" />
                      {t('vehicleLightingRealism.processing', 'Processing...')}
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      {t('vehicleLightingRealism.applyLighting', 'Apply Lighting')}
                    </>
                  )}
                </Button>
                
                {lightingProperties && (
                  <Button 
                    variant="outline" 
                    onClick={handleReset}
                    className="flex-1 min-w-[120px]"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    {t('vehicleLightingRealism.reset', 'Reset')}
                  </Button>
                )}
              </div>
              
              {/* Applied Properties Preview */}
              {lightingProperties && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-3">
                    {t('vehicleLightingRealism.appliedProperties', 'Applied Properties')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Lighting Conditions:</span> {lightingProperties.lightingConditions}
                    </div>
                    <div>
                      <span className="font-medium">Shadow Intensity:</span> {lightingProperties.shadowProperties.intensity}%
                    </div>
                    <div>
                      <span className="font-medium">Shadow Softness:</span> {lightingProperties.shadowProperties.softness}%
                    </div>
                    <div>
                      <span className="font-medium">Shadow Direction:</span> {lightingProperties.shadowProperties.direction}°
                    </div>
                    <div>
                      <span className="font-medium">Reflection Intensity:</span> {lightingProperties.reflectionProperties.intensity}%
                    </div>
                    <div>
                      <span className="font-medium">Reflection Sharpness:</span> {lightingProperties.reflectionProperties.sharpness}%
                    </div>
                    <div>
                      <span className="font-medium">Ambient Occlusion:</span> {lightingProperties.ambientOcclusion ? 'Enabled' : 'Disabled'}
                    </div>
                    <div>
                      <span className="font-medium">Edge Treatment:</span> {lightingProperties.edgeTreatment}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>{t('vehicleLightingRealism.needAnalysis', 'Please complete material analysis and upload both vehicle and material images')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
