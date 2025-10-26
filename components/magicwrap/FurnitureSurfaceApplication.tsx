"use client";

import Image from "next/image";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { MaterialAnalysis } from "./FurnitureMaterialAnalysis";

interface FurnitureSurfaceApplicationProps {
  materialAnalysis: MaterialAnalysis | null;
  objectImage: string | null;
  materialImage: string | null;
  onApply: (appliedProperties: AppliedMaterialProperties) => void;
}

export interface AppliedMaterialProperties {
  // Grain direction and flow properties
  grainDirection: 'horizontal' | 'vertical' | 'diagonal' | 'natural';
  patternContinuity: boolean;
  directionalConsistency: boolean;
  curvatureAdaptation: boolean;
  
  // Edge transition properties
  seamlessEdgeBlending: boolean;
  edgeWrapping: boolean;
  cornerTreatment: 'rounded' | 'sharp' | 'blended';
  surfaceBoundaryDetection: boolean;
  
  // Texture and color properties
  textureDepth: 'low' | 'medium' | 'high';
  colorFidelity: boolean;
  shadeConsistency: boolean;
  materialAuthenticity: boolean;
  
  // Finish properties
  sheenLevel: 'matte' | 'glossy' | 'satin' | 'distressed';
  surfaceReflection: boolean;
  lightInteraction: boolean;
  finishConsistency: boolean;
  
  // Lighting and realism properties
  interiorLighting: boolean;
  shadowCasting: boolean;
  ambientLighting: boolean;
  depthPerception: boolean;
  woodGrainDepth: boolean;
  fabricTextureVisibility: boolean;
  leatherSheen: boolean;
  
  // Surface-specific properties
  surfaces: {
    tabletops: boolean;
    cabinetDoors: boolean;
    drawerFronts: boolean;
    chairSeats: boolean;
    chairBacks: boolean;
    shelvingUnits: boolean;
    sidePanels: boolean;
  };
}

export function FurnitureSurfaceApplication({
  materialAnalysis,
  objectImage,
  materialImage,
  onApply
}: FurnitureSurfaceApplicationProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isApplying, setIsApplying] = useState(false);
  const [appliedProperties, setAppliedProperties] = useState<AppliedMaterialProperties | null>(null);

  // Default applied properties based on material analysis
  const getDefaultAppliedProperties = (): AppliedMaterialProperties => {
    // Map scale values from MaterialAnalysis to textureDepth
    let textureDepth: 'low' | 'medium' | 'high' = 'medium';
    if (materialAnalysis?.scale === 'fine') {
      textureDepth = 'high';
    } else if (materialAnalysis?.scale === 'coarse') {
      textureDepth = 'low';
    } else {
      textureDepth = 'medium';
    }

    // Map finishType values from MaterialAnalysis to sheenLevel
    let sheenLevel: 'matte' | 'glossy' | 'satin' | 'distressed' = 'matte';
    if (materialAnalysis?.finishType && materialAnalysis.finishType !== 'other') {
      sheenLevel = materialAnalysis.finishType as 'matte' | 'glossy' | 'satin' | 'distressed';
    }

    return {
      // Grain direction and flow
      grainDirection: (materialAnalysis?.patternDirection as 'horizontal' | 'vertical' | 'diagonal' | 'natural') || 'natural',
      patternContinuity: true,
      directionalConsistency: true,
      curvatureAdaptation: true,
      
      // Edge transitions
      seamlessEdgeBlending: true,
      edgeWrapping: true,
      cornerTreatment: 'blended',
      surfaceBoundaryDetection: true,
      
      // Texture and color
      textureDepth,
      colorFidelity: true,
      shadeConsistency: true,
      materialAuthenticity: true,
      
      // Finish properties
      sheenLevel,
      surfaceReflection: true,
      lightInteraction: true,
      finishConsistency: true,
      
      // Lighting and realism properties
      interiorLighting: true,
      shadowCasting: true,
      ambientLighting: true,
      depthPerception: true,
      woodGrainDepth: materialAnalysis?.textureType === 'wood',
      fabricTextureVisibility: materialAnalysis?.textureType === 'fabric',
      leatherSheen: materialAnalysis?.textureType === 'leather' || materialAnalysis?.textureType === 'vinyl',
      
      // Surfaces
      surfaces: {
        tabletops: true,
        cabinetDoors: true,
        drawerFronts: true,
        chairSeats: true,
        chairBacks: true,
        shelvingUnits: true,
        sidePanels: true
      }
    };
  };

  // Apply material to furniture surfaces
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
      const properties = getDefaultAppliedProperties();
      setAppliedProperties(properties);
      onApply(properties);
      setIsApplying(false);
      
      toast({
        title: "Malzeme Uygulandı",
        description: "Mobilya yüzeyleri malzeme özellikleriyle başarıyla güncellendi.",
      });
    }, 1500);
  };

  // Reset the application
  const handleReset = () => {
    setAppliedProperties(null);
    onApply(getDefaultAppliedProperties());
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {t('furnitureSurfaceApplication.title', 'Furniture Surface Application')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {materialAnalysis && objectImage && materialImage ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Object Preview */}
                <div>
                  <h3 className="font-semibold mb-2">
                    {t('furnitureSurfaceApplication.objectPreview', 'Object Preview')}
                  </h3>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="relative h-48 w-full">
                      <Image 
                        src={objectImage} 
                        alt="Furniture object" 
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
                    {t('furnitureSurfaceApplication.materialPreview', 'Material Preview')}
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
              
              {/* Application Controls */}
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={handleApplyMaterial} 
                  disabled={isApplying}
                  className="flex-1 min-w-[120px]"
                >
                  {isApplying ? (
                    <span>{t('furnitureSurfaceApplication.applying', 'Applying...')}</span>
                  ) : (
                    <span>{t('furnitureSurfaceApplication.applyMaterial', 'Apply Material')}</span>
                  )}
                </Button>
                
                {appliedProperties && (
                  <Button 
                    variant="outline" 
                    onClick={handleReset}
                    className="flex-1 min-w-[120px]"
                  >
                    {t('furnitureSurfaceApplication.reset', 'Reset')}
                  </Button>
                )}
              </div>
              
              {/* Applied Properties Preview */}
              {appliedProperties && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-3">
                    {t('furnitureSurfaceApplication.appliedProperties', 'Applied Properties')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Grain Direction:</span> {appliedProperties.grainDirection}
                    </div>
                    <div>
                      <span className="font-medium">Sheen Level:</span> {appliedProperties.sheenLevel}
                    </div>
                    <div>
                      <span className="font-medium">Texture Depth:</span> {appliedProperties.textureDepth}
                    </div>
                    <div>
                      <span className="font-medium">Edge Wrapping:</span> {appliedProperties.edgeWrapping ? 'Enabled' : 'Disabled'}
                    </div>
                    <div>
                      <span className="font-medium">Interior Lighting:</span> {appliedProperties.interiorLighting ? 'Enabled' : 'Disabled'}
                    </div>
                    <div>
                      <span className="font-medium">Shadow Casting:</span> {appliedProperties.shadowCasting ? 'Enabled' : 'Disabled'}
                    </div>
                    <div>
                      <span className="font-medium">Ambient Lighting:</span> {appliedProperties.ambientLighting ? 'Enabled' : 'Disabled'}
                    </div>
                    <div>
                      <span className="font-medium">Depth Perception:</span> {appliedProperties.depthPerception ? 'Enabled' : 'Disabled'}
                    </div>
                    {appliedProperties.woodGrainDepth && (
                      <div>
                        <span className="font-medium">Wood Grain Depth:</span> Enabled
                      </div>
                    )}
                    {appliedProperties.fabricTextureVisibility && (
                      <div>
                        <span className="font-medium">Fabric Texture:</span> Visible
                      </div>
                    )}
                    {appliedProperties.leatherSheen && (
                      <div>
                        <span className="font-medium">Leather Sheen:</span> Enabled
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>{t('furnitureSurfaceApplication.needAnalysis', 'Please complete material analysis and upload both object and material images')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
