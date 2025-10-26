"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Palette,
  Eye,
  Text,
  Layers,
  Sparkles,
  Upload,
  RotateCcw,
  Check,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export interface MaterialAnalysis {
  textureType: 'smooth' | 'matte' | 'glossy' | 'satin' | 'carbon fiber' | 'chrome' | 'metallic' | 'brushed' | 'other';
  primaryColor: string;
  secondaryColor: string;
  colorPalette: string[];
  finishType: 'matte' | 'glossy' | 'satin' | 'brushed' | 'chrome' | 'other';
  patternStructure: 'geometric' | 'organic' | 'camouflage' | 'none';
  grainDirection: 'horizontal' | 'vertical' | 'diagonal' | 'random' | 'none';
  surfaceReliefDepth: 'low' | 'medium' | 'high';
  // Lighting properties
  reflectivity: number; // 0-100
  lightAbsorption: number; // 0-100
  shadowIntensity: number; // 0-100
}

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export function VehicleMaterialAnalysis({ onAnalysisComplete }: { onAnalysisComplete?: (analysis: MaterialAnalysis) => void }) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [materialImage, setMaterialImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<MaterialAnalysis | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default analysis values
  const defaultAnalysis: MaterialAnalysis = {
    textureType: 'glossy',
    primaryColor: '#FF0000',
    secondaryColor: '#CC0000',
    colorPalette: ['#FF0000', '#CC0000', '#990000', '#660000', '#330000'],
    finishType: 'glossy',
    patternStructure: 'none',
    grainDirection: 'none',
    surfaceReliefDepth: 'low',
    reflectivity: 85,
    lightAbsorption: 30,
    shadowIntensity: 60
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setMaterialImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setMaterialImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (!materialImage) {
      toast({
        title: t('common.error'),
        description: "Please upload a material image first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      setAnalysis(defaultAnalysis);
      setIsAnalyzing(false);
      setIsEditing(false);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(defaultAnalysis);
      }
      
      toast({
        title: "Analiz Tamamlandı",
        description: "Malzeme özellikleri başarıyla analiz edildi.",
      });
    }, 2000);
  };

  const handleConfirm = () => {
    setIsEditing(false);
    
    if (analysis && onAnalysisComplete) {
      onAnalysisComplete(analysis);
    }
    
    toast({
      title: "Analiz Onaylandı",
      description: "Malzeme analizi onaylanarak kaydedildi.",
    });
  };

  const handleReset = () => {
    setMaterialImage(null);
    setImagePreview(null);
    setAnalysis(null);
    setIsEditing(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const updateAnalysis = (field: keyof MaterialAnalysis, value: any) => {
    if (analysis) {
      setAnalysis({
        ...analysis,
        [field]: value
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            {t('vehicleMaterialAnalysis.title', 'Vehicle Material Analysis')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image Upload Section */}
          <div 
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <div className="relative">
                <Image
                  src={imagePreview}
                  alt="Material preview"
                  width={512}
                  height={512}
                  className="mx-auto max-h-64 w-auto rounded-lg object-contain"
                  unoptimized
                />
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-2 right-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReset();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {t('vehicleMaterialAnalysis.uploadDescription', 'Drag and drop your material image here, or click to select')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('vehicleMaterialAnalysis.supportedFormats', 'Supports JPG, PNG, WEBP up to 10MB')}
                </p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleAnalyze} 
              disabled={!materialImage || isAnalyzing}
              className="flex-1 min-w-[120px]"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  {t('vehicleMaterialAnalysis.analyzing', 'Analyzing...')}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {t('vehicleMaterialAnalysis.analyze', 'Analyze Material')}
                </>
              )}
            </Button>
            
            {analysis && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(true)}
                  className="flex-1 min-w-[120px]"
                >
                  <Palette className="mr-2 h-4 w-4" />
                  {t('vehicleMaterialAnalysis.edit', 'Edit Results')}
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={handleReset}
                  className="flex-1 min-w-[120px]"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {t('vehicleMaterialAnalysis.reset', 'Reset')}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary" />
              {t('vehicleMaterialAnalysis.results', 'Analysis Results')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Texture Analysis */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Text className="h-4 w-4" />
                  {t('vehicleMaterialAnalysis.texture', 'Texture Analysis')}
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      {t('vehicleMaterialAnalysis.textureType', 'Texture Type')}
                    </Label>
                    {isEditing ? (
                      <select
                        value={analysis.textureType}
                        onChange={(e) => updateAnalysis('textureType', e.target.value as any)}
                        className="w-full mt-1 p-2 border rounded"
                      >
                        <option value="smooth">Smooth</option>
                        <option value="matte">Matte</option>
                        <option value="glossy">Glossy</option>
                        <option value="carbon fiber">Carbon Fiber</option>
                        <option value="chrome">Chrome</option>
                        <option value="metallic">Metallic</option>
                        <option value="brushed">Brushed</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <p className="mt-1 font-medium capitalize">{analysis.textureType}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      {t('vehicleMaterialAnalysis.finish', 'Surface Finish')}
                    </Label>
                    {isEditing ? (
                      <select
                        value={analysis.finishType}
                        onChange={(e) => updateAnalysis('finishType', e.target.value as any)}
                        className="w-full mt-1 p-2 border rounded"
                      >
                        <option value="matte">Matte</option>
                        <option value="glossy">Glossy</option>
                        <option value="satin">Satin</option>
                        <option value="brushed">Brushed</option>
                        <option value="chrome">Chrome</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <p className="mt-1 font-medium capitalize">{analysis.finishType}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm text-muted-foreground">
                    {t('vehicleMaterialAnalysis.pattern', 'Pattern Structure')}
                  </Label>
                  {isEditing ? (
                    <select
                      value={analysis.patternStructure}
                      onChange={(e) => updateAnalysis('patternStructure', e.target.value as any)}
                      className="w-full mt-1 p-2 border rounded"
                    >
                      <option value="geometric">Geometric</option>
                      <option value="organic">Organic</option>
                      <option value="camouflage">Camouflage</option>
                      <option value="none">None</option>
                    </select>
                  ) : (
                    <p className="mt-1 font-medium capitalize">{analysis.patternStructure}</p>
                  )}
                </div>
              </div>
              
              {/* Color Analysis */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  {t('vehicleMaterialAnalysis.color', 'Color Analysis')}
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      {t('vehicleMaterialAnalysis.primaryColor', 'Primary Color')}
                    </Label>
                    <div className="flex items-center mt-1">
                      <div 
                        className="w-8 h-8 rounded border mr-2" 
                        style={{ backgroundColor: analysis.primaryColor }}
                      />
                      {isEditing ? (
                        <Input
                          type="color"
                          value={analysis.primaryColor}
                          onChange={(e) => updateAnalysis('primaryColor', e.target.value)}
                          className="w-16 p-1"
                        />
                      ) : (
                        <span className="font-mono text-sm">{analysis.primaryColor}</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      {t('vehicleMaterialAnalysis.secondaryColor', 'Secondary Color')}
                    </Label>
                    <div className="flex items-center mt-1">
                      <div 
                        className="w-8 h-8 rounded border mr-2" 
                        style={{ backgroundColor: analysis.secondaryColor }}
                      />
                      {isEditing ? (
                        <Input
                          type="color"
                          value={analysis.secondaryColor}
                          onChange={(e) => updateAnalysis('secondaryColor', e.target.value)}
                          className="w-16 p-1"
                        />
                      ) : (
                        <span className="font-mono text-sm">{analysis.secondaryColor}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm text-muted-foreground">
                    {t('vehicleMaterialAnalysis.colorPalette', 'Color Palette')}
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {analysis.colorPalette.map((color, index) => (
                      <div 
                        key={index}
                        className="w-8 h-8 rounded border cursor-pointer"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Direction and Relief */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  {t('vehicleMaterialAnalysis.directionAndRelief', 'Direction & Relief')}
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      {t('vehicleMaterialAnalysis.direction', 'Grain Direction')}
                    </Label>
                    {isEditing ? (
                      <select
                        value={analysis.grainDirection}
                        onChange={(e) => updateAnalysis('grainDirection', e.target.value as any)}
                        className="w-full mt-1 p-2 border rounded"
                      >
                        <option value="horizontal">Horizontal</option>
                        <option value="vertical">Vertical</option>
                        <option value="diagonal">Diagonal</option>
                        <option value="random">Random</option>
                        <option value="none">None</option>
                      </select>
                    ) : (
                      <p className="mt-1 font-medium capitalize">{analysis.grainDirection}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      {t('vehicleMaterialAnalysis.reliefDepth', 'Surface Relief Depth')}
                    </Label>
                    {isEditing ? (
                      <select
                        value={analysis.surfaceReliefDepth}
                        onChange={(e) => updateAnalysis('surfaceReliefDepth', e.target.value as any)}
                        className="w-full mt-1 p-2 border rounded"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    ) : (
                      <p className="mt-1 font-medium capitalize">{analysis.surfaceReliefDepth}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Lighting Properties */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {t('vehicleMaterialAnalysis.lighting', 'Lighting Properties')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      {t('vehicleMaterialAnalysis.reflectivity', 'Reflectivity')}
                    </Label>
                    {isEditing ? (
                      <Input
                        type="range"
                        min="0"
                        max="100"
                        value={analysis.reflectivity}
                        onChange={(e) => updateAnalysis('reflectivity', parseInt(e.target.value))}
                        className="mt-1"
                      />
                    ) : (
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${analysis.reflectivity}%` }}
                        ></div>
                      </div>
                    )}
                    <span className="text-xs text-muted-foreground">{analysis.reflectivity}%</span>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      {t('vehicleMaterialAnalysis.lightAbsorption', 'Light Absorption')}
                    </Label>
                    {isEditing ? (
                      <Input
                        type="range"
                        min="0"
                        max="100"
                        value={analysis.lightAbsorption}
                        onChange={(e) => updateAnalysis('lightAbsorption', parseInt(e.target.value))}
                        className="mt-1"
                      />
                    ) : (
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${analysis.lightAbsorption}%` }}
                        ></div>
                      </div>
                    )}
                    <span className="text-xs text-muted-foreground">{analysis.lightAbsorption}%</span>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      {t('vehicleMaterialAnalysis.shadowIntensity', 'Shadow Intensity')}
                    </Label>
                    {isEditing ? (
                      <Input
                        type="range"
                        min="0"
                        max="100"
                        value={analysis.shadowIntensity}
                        onChange={(e) => updateAnalysis('shadowIntensity', parseInt(e.target.value))}
                        className="mt-1"
                      />
                    ) : (
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${analysis.shadowIntensity}%` }}
                        ></div>
                      </div>
                    )}
                    <span className="text-xs text-muted-foreground">{analysis.shadowIntensity}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            {isEditing && (
              <div className="flex justify-end mt-6">
                <Button onClick={handleConfirm} className="w-full md:w-auto">
                  <Check className="mr-2 h-4 w-4" />
                  {t('vehicleMaterialAnalysis.confirm', 'Confirm Analysis')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
