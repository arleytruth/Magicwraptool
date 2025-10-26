"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { 
  Eye, 
  Car, 
  Shield, 
  Scan, 
  CheckCircle, 
  XCircle,
  RotateCcw,
  Check
} from "lucide-react";

interface SurfaceIdentification {
  wrappableZones: string[];
  preservedZones: string[];
  vehicleModel?: string;
}

const WRAPPABLE_ZONES = [
  "Hood",
  "Roof",
  "Trunk/Tailgate",
  "Fenders",
  "Doors",
  "Quarter Panels",
  "Bumpers (painted sections only)"
];

const PRESERVED_ZONES = [
  "Windows and glass surfaces",
  "Lights and lenses",
  "Chrome trim",
  "Door handles",
  "Mirrors",
  "Wheels",
  "Tires",
  "Badges and logos",
  "Grilles",
  "Exhaust tips",
  "License plates"
];

export function VehicleSurfaceIdentification({ 
  objectImage,
  onIdentificationComplete 
}: { 
  objectImage: string | null;
  onIdentificationComplete?: (identification: SurfaceIdentification) => void;
}) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [identification, setIdentification] = useState<SurfaceIdentification | null>(null);
  const [selectedWrappable, setSelectedWrappable] = useState<string[]>([
    "Hood",
    "Roof",
    "Trunk/Tailgate",
    "Fenders",
    "Doors",
    "Quarter Panels"
  ]);
  const [selectedPreserved, setSelectedPreserved] = useState<string[]>([
    "Windows and glass surfaces",
    "Lights and lenses",
    "Chrome trim",
    "Door handles",
    "Mirrors",
    "Wheels",
    "Tires",
    "Badges and logos",
    "Grilles",
    "Exhaust tips",
    "License plates"
  ]);

  const defaultIdentification: SurfaceIdentification = {
    wrappableZones: selectedWrappable,
    preservedZones: selectedPreserved,
    vehicleModel: "Unknown"
  };

  const handleIdentify = () => {
    if (!objectImage) {
      toast({
        title: t('common.error'),
        description: "Please upload a vehicle image first",
        variant: "destructive",
      });
      return;
    }

    setIsIdentifying(true);
    
    // Simulate identification process
    setTimeout(() => {
      const result = defaultIdentification;
      setIdentification(result);
      setIsIdentifying(false);
      
      if (onIdentificationComplete) {
        onIdentificationComplete(result);
      }
      
      toast({
        title: "Yüzey Tanıma Tamamlandı",
        description: "Araç yüzeyleri başarıyla belirlendi.",
      });
    }, 2000);
  };

  const handleConfirm = () => {
    if (identification && onIdentificationComplete) {
      onIdentificationComplete({
        ...identification,
        wrappableZones: selectedWrappable,
        preservedZones: selectedPreserved
      });
    }
    
    toast({
      title: "Yüzey Tanıma Onaylandı",
      description: "Yüzey tanıma sonuçları onaylanarak kaydedildi.",
    });
  };

  const handleReset = () => {
    setIdentification(null);
    setSelectedWrappable([
      "Hood",
      "Roof",
      "Trunk/Tailgate",
      "Fenders",
      "Doors",
      "Quarter Panels"
    ]);
    setSelectedPreserved([
      "Windows and glass surfaces",
      "Lights and lenses",
      "Chrome trim",
      "Door handles",
      "Mirrors",
      "Wheels",
      "Tires",
      "Badges and logos",
      "Grilles",
      "Exhaust tips",
      "License plates"
    ]);
  };

  const toggleWrappableZone = (zone: string) => {
    if (selectedWrappable.includes(zone)) {
      setSelectedWrappable(selectedWrappable.filter(z => z !== zone));
    } else {
      setSelectedWrappable([...selectedWrappable, zone]);
    }
  };

  const togglePreservedZone = (zone: string) => {
    if (selectedPreserved.includes(zone)) {
      setSelectedPreserved(selectedPreserved.filter(z => z !== zone));
    } else {
      setSelectedPreserved([...selectedPreserved, zone]);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            {t('vehicleSurfaceIdentification.title', 'Vehicle Surface Identification')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {objectImage ? (
            <>
              {/* Vehicle Preview */}
              <div className="border rounded-lg overflow-hidden">
                <div className="relative h-64 w-full bg-background">
                  <Image 
                    src={objectImage} 
                    alt="Vehicle" 
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={handleIdentify} 
                  disabled={isIdentifying}
                  className="flex-1 min-w-[120px]"
                >
                  {isIdentifying ? (
                    <>
                      <Scan className="mr-2 h-4 w-4 animate-spin" />
                      {t('vehicleSurfaceIdentification.identifying', 'Identifying...')}
                    </>
                  ) : (
                    <>
                      <Scan className="mr-2 h-4 w-4" />
                      {t('vehicleSurfaceIdentification.identify', 'Identify Surfaces')}
                    </>
                  )}
                </Button>
                
                {identification && (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={handleConfirm}
                      className="flex-1 min-w-[120px]"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      {t('vehicleSurfaceIdentification.confirm', 'Confirm')}
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={handleReset}
                      className="flex-1 min-w-[120px]"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      {t('vehicleSurfaceIdentification.reset', 'Reset')}
                    </Button>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Car className="mx-auto h-12 w-12" />
              <p className="mt-2">
                {t('vehicleSurfaceIdentification.needVehicle', 'Please upload a vehicle image to identify surfaces')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Surface Zones */}
      {identification && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Wrappable Zones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                {t('vehicleSurfaceIdentification.wrappable', 'Wrappable Zones')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {WRAPPABLE_ZONES.map((zone) => (
                  <div 
                    key={zone}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedWrappable.includes(zone) 
                        ? "bg-green-100 border border-green-300" 
                        : "bg-muted hover:bg-muted/80"
                    }`}
                    onClick={() => toggleWrappableZone(zone)}
                  >
                    <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                      selectedWrappable.includes(zone) 
                        ? "bg-green-500 border-green-500" 
                        : "border-gray-300"
                    }`}>
                      {selectedWrappable.includes(zone) && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span className={selectedWrappable.includes(zone) ? "font-medium" : ""}>
                      {zone}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preserved Zones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Shield className="h-5 w-5" />
                {t('vehicleSurfaceIdentification.preserved', 'Preserved Zones')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {PRESERVED_ZONES.map((zone) => (
                  <div 
                    key={zone}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedPreserved.includes(zone) 
                        ? "bg-red-100 border border-red-300" 
                        : "bg-muted hover:bg-muted/80"
                    }`}
                    onClick={() => togglePreservedZone(zone)}
                  >
                    <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                      selectedPreserved.includes(zone) 
                        ? "bg-red-500 border-red-500" 
                        : "border-gray-300"
                    }`}>
                      {selectedPreserved.includes(zone) && (
                        <XCircle className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span className={selectedPreserved.includes(zone) ? "font-medium" : ""}>
                      {zone}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
