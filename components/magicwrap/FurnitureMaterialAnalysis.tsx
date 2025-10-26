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
  textureType: 'wood' | 'fabric' | 'leather' | 'vinyl' | 'other';
  primaryColor: string;
  secondaryColor: string;
  colorPalette: string[];
  finishType: 'matte' | 'glossy' | 'satin' | 'distressed' | 'other';
  patternStructure: string;
  patternDirection: string;
  grainLines: boolean;
  weavePattern: boolean;
  embossing: boolean;
  scale: 'fine' | 'medium' | 'coarse';
  detailLevel: 'low' | 'medium' | 'high';
  // Lighting properties
  reflectivity: number; // 0-100
  lightAbsorption: number; // 0-100
  shadowIntensity: number; // 0-100
  depthProperties: {
    woodGrainDepth: number; // 0-100
    fabricTextureDepth: number; // 0-100
    leatherSheenLevel: number; // 0-100
  };
}

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export function FurnitureMaterialAnalysis({ onAnalysisComplete }: { onAnalysisComplete?: (analysis: MaterialAnalysis) => void }) {
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
    textureType: 'wood',
    primaryColor: '#8B4513',
    secondaryColor: '#5D2906',
    colorPalette: ['#8B4513', '#5D2906', '#A0522D', '#D2691E', '#8B4513'],
    finishType: 'matte',
    patternStructure: 'straight',
    patternDirection: 'horizontal',
    grainLines: true,
    weavePattern: false,
    embossing: false,
    scale: 'medium',
    detailLevel: 'medium',
    reflectivity: 30,
    lightAbsorption: 70,
    shadowIntensity: 50,
    depthProperties: {
      woodGrainDepth: 80,
      fabricTextureDepth: 60,
      leatherSheenLevel: 40
    }
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
      // Handle nested depthProperties updates
      if (field === 'depthProperties' && typeof value === 'object') {
        setAnalysis({
          ...analysis,
          depthProperties: {
            ...analysis.depthProperties,
            ...value
          }
        });
      } else {
        setAnalysis({
          ...analysis,
          [field]: value
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            {t('furnitureMaterialAnalysis.title', 'Furniture Material Analysis')}
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
                  {t('furnitureMaterialAnalysis.uploadDescription', 'Drag and drop your material image here, or click to select')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('furnitureMaterialAnalysis.supportedFormats', 'Supports JPG, PNG, WEBP up to 10MB')}
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
                  {t('furnitureMaterialAnalysis.analyzing', 'Analyzing...')}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {t('furnitureMaterialAnalysis.analyze', 'Analyze Material')}
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
                  {t('furnitureMaterialAnalysis.edit', 'Edit Results')}
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={handleReset}
                  className="flex-1 min-w-[120px]"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {t('furnitureMaterialAnalysis.reset', 'Reset')}
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
              {t('furnitureMaterialAnalysis.results', 'Analysis Results')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Texture Analysis */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Text className="h-4 w-4" />
                  {t('furnitureMaterialAnalysis.texture', 'Texture Analysis')}
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      {t('furnitureMaterialAnalysis.textureType', 'Texture Type')}
                    </Label>
                    {isEditing ? (
                      <select
                        value={analysis.textureType}
                        onChange={(e) => updateAnalysis('textureType', e.target.value as any)}
                        className="w-full mt-1 p-2 border rounded"
                      >
                        <option value="wood">Wood</option>
                        <option value="fabric">Fabric</option>
                        <option value="leather">Leather</option>
                        <option value="vinyl">Vinyl</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <p className="mt-1 font-medium capitalize">{analysis.textureType}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      {t('furnitureMaterialAnalysis.finish', 'Surface Finish')}
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
                        <option value="distressed">Distressed</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <p className="mt-1 font-medium capitalize">{analysis.finishType}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm text-muted-foreground">
                    {t('furnitureMaterialAnalysis.characteristics', 'Material Characteristics')}
                  </Label>
                  <div className="mt-2 space-y-2">
                    {isEditing ? (
                      <>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="grainLines"
                            checked={analysis.grainLines}
                            onChange={(e) => updateAnalysis('grainLines', e.target.checked)}
                            className="mr-2"
                          />
                          <Label htmlFor="grainLines" className="text-sm">
                            Grain Lines
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="weavePattern"
                            checked={analysis.weavePattern}
                            onChange={(e) => updateAnalysis('weavePattern', e.target.checked)}
                            className="mr-2"
                          />
                          <Label htmlFor="weavePattern" className="text-sm">
                            Weave Pattern
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="embossing"
                            checked={analysis.embossing}
                            onChange={(e) => updateAnalysis('embossing', e.target.checked)}
                            className="mr-2"
                          />
                          <Label htmlFor="embossing" className="text-sm">
                            Embossing
                          </Label>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {analysis.grainLines && (
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                            Grain Lines
                          </span>
                        )}
                        {analysis.weavePattern && (
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                            Weave Pattern
                          </span>
                        )}
                        {analysis.embossing && (
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                            Embossing
                          </span>
                        )}
                        {!analysis.grainLines && !analysis.weavePattern && !analysis.embossing && (
                          <span className="text-sm text-muted-foreground">None</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Color Analysis */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  {t('furnitureMaterialAnalysis.color', 'Color Analysis')}
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      {t('furnitureMaterialAnalysis.primaryColor', 'Primary Color')}
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
                      {t('furnitureMaterialAnalysis.secondaryColor', 'Secondary Color')}
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
                    {t('furnitureMaterialAnalysis.colorPalette', 'Color Palette')}
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
              
              {/* Pattern Analysis */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  {t('furnitureMaterialAnalysis.pattern', 'Pattern Analysis')}
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      {t('furnitureMaterialAnalysis.structure', 'Pattern Structure')}
                    </Label>
                    {isEditing ? (
                      <Input
                        value={analysis.patternStructure}
                        onChange={(e) => updateAnalysis('patternStructure', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 font-medium">{analysis.patternStructure}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      {t('furnitureMaterialAnalysis.direction', 'Pattern Direction')}
                    </Label>
                    {isEditing ? (
                      <select
                        value={analysis.patternDirection}
                        onChange={(e) => updateAnalysis('patternDirection', e.target.value)}
                        className="w-full mt-1 p-2 border rounded"
                      >
                        <option value="horizontal">Horizontal</option>
                        <option value="vertical">Vertical</option>
                        <option value="diagonal">Diagonal</option>
                        <option value="random">Random</option>
                      </select>
                    ) : (
                      <p className="mt-1 font-medium capitalize">{analysis.patternDirection}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      {t('furnitureMaterialAnalysis.scale', 'Material Scale')}
                    </Label>
                    {isEditing ? (
                      <select
                        value={analysis.scale}
                        onChange={(e) => updateAnalysis('scale', e.target.value as any)}
                        className="w-full mt-1 p-2 border rounded"
                      >
                        <option value="fine">Fine</option>
                        <option value="medium">Medium</option>
                        <option value="coarse">Coarse</option>
                      </select>
                    ) : (
                      <p className="mt-1 font-medium capitalize">{analysis.scale}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      {t('furnitureMaterialAnalysis.detail', 'Detail Level')}
                    </Label>
                    {isEditing ? (
                      <select
                        value={analysis.detailLevel}
                        onChange={(e) => updateAnalysis('detailLevel', e.target.value as any)}
                        className="w-full mt-1 p-2 border rounded"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    ) : (
                      <p className="mt-1 font-medium capitalize">{analysis.detailLevel}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Lighting Properties */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {t('furnitureMaterialAnalysis.lighting', 'Lighting Properties')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      {t('furnitureMaterialAnalysis.reflectivity', 'Reflectivity')}
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
                      {t('furnitureMaterialAnalysis.lightAbsorption', 'Light Absorption')}
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
                      {t('furnitureMaterialAnalysis.shadowIntensity', 'Shadow Intensity')}
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
                
                <div className="space-y-3">
                  <Label className="text-sm text-muted-foreground">
                    {t('furnitureMaterialAnalysis.depthProperties', 'Depth Properties')}
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        {t('furnitureMaterialAnalysis.woodGrainDepth', 'Wood Grain Depth')}
                      </Label>
                      {isEditing ? (
                        <Input
                          type="range"
                          min="0"
                          max="100"
                          value={analysis.depthProperties.woodGrainDepth}
                          onChange={(e) => updateAnalysis('depthProperties', {
                            ...analysis.depthProperties,
                            woodGrainDepth: parseInt(e.target.value)
                          })}
                          className="mt-1"
                        />
                      ) : (
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${analysis.depthProperties.woodGrainDepth}%` }}
                          ></div>
                        </div>
                      )}
                      <span className="text-xs text-muted-foreground">{analysis.depthProperties.woodGrainDepth}%</span>
                    </div>
                    
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        {t('furnitureMaterialAnalysis.fabricTextureDepth', 'Fabric Texture Depth')}
                      </Label>
                      {isEditing ? (
                        <Input
                          type="range"
                          min="0"
                          max="100"
                          value={analysis.depthProperties.fabricTextureDepth}
                          onChange={(e) => updateAnalysis('depthProperties', {
                            ...analysis.depthProperties,
                            fabricTextureDepth: parseInt(e.target.value)
                          })}
                          className="mt-1"
                        />
                      ) : (
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${analysis.depthProperties.fabricTextureDepth}%` }}
                          ></div>
                        </div>
                      )}
                      <span className="text-xs text-muted-foreground">{analysis.depthProperties.fabricTextureDepth}%</span>
                    </div>
                    
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        {t('furnitureMaterialAnalysis.leatherSheenLevel', 'Leather Sheen Level')}
                      </Label>
                      {isEditing ? (
                        <Input
                          type="range"
                          min="0"
                          max="100"
                          value={analysis.depthProperties.leatherSheenLevel}
                          onChange={(e) => updateAnalysis('depthProperties', {
                            ...analysis.depthProperties,
                            leatherSheenLevel: parseInt(e.target.value)
                          })}
                          className="mt-1"
                        />
                      ) : (
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${analysis.depthProperties.leatherSheenLevel}%` }}
                          ></div>
                        </div>
                      )}
                      <span className="text-xs text-muted-foreground">{analysis.depthProperties.leatherSheenLevel}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {isEditing && (
              <div className="flex justify-end mt-6">
                <Button onClick={handleConfirm} className="w-full md:w-auto">
                  <Check className="mr-2 h-4 w-4" />
                  {t('furnitureMaterialAnalysis.confirm', 'Confirm Analysis')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
