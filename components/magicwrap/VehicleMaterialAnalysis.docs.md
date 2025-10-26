# Vehicle Material Analysis Component

## Overview

The VehicleMaterialAnalysis component is designed to analyze vehicle wrap material images and extract key properties needed for the wrapping process. It provides a user-friendly interface for uploading material images and viewing analysis results.

## Features

1. **Image Upload**: Drag and drop or click to upload material images
2. **Material Analysis**: Extracts key properties from the material image:
   - Primary and secondary colors with RGB values
   - Texture type (smooth/matte/glossy/carbon fiber/chrome/metallic/brushed)
   - Pattern structure (geometric/organic/camouflage)
   - Surface finish type
   - Directional grain or weave orientation
   - Surface relief depth
3. **Results Display**: Shows analysis results in an organized, user-friendly interface
4. **Adjustment Options**: Allows users to adjust or confirm analysis results
5. **Integration Ready**: Prepared material properties for the application process

## Usage

### Basic Implementation

```tsx
import { VehicleMaterialAnalysis } from '@/components/VehicleMaterialAnalysis';

function MyComponent() {
  return (
    <VehicleMaterialAnalysis />
  );
}
```

### With Custom Handling

```tsx
import { VehicleMaterialAnalysis } from '@/components/VehicleMaterialAnalysis';

function MyComponent() {
  const handleAnalysisComplete = (analysisData) => {
    // Handle the analyzed material properties
    console.log('Analysis complete:', analysisData);
    
    // Prepare for application process
    // ... your logic here
  };

  return (
    <VehicleMaterialAnalysis onAnalysisComplete={handleAnalysisComplete} />
  );
}
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| onAnalysisComplete | function | Callback function called when analysis is complete |

## Analysis Data Structure

The component prepares the following data structure for the application process:

```ts
export interface MaterialAnalysis {
  textureType: 'smooth' | 'matte' | 'glossy' | 'carbon fiber' | 'chrome' | 'metallic' | 'brushed' | 'other';
  primaryColor: string; // Hex color value
  secondaryColor: string; // Hex color value
  colorPalette: string[]; // Array of hex color values
  finishType: 'matte' | 'glossy' | 'satin' | 'brushed' | 'chrome' | 'other';
  patternStructure: 'geometric' | 'organic' | 'camouflage' | 'none';
  grainDirection: 'horizontal' | 'vertical' | 'diagonal' | 'random' | 'none';
  surfaceReliefDepth: 'low' | 'medium' | 'high';
  // Lighting properties
  reflectivity: number; // 0-100
  lightAbsorption: number; // 0-100
  shadowIntensity: number; // 0-100
}
```

## Integration with Existing UI

The component is designed to integrate seamlessly with the existing UI components and state management patterns used in the project:

1. Uses the same styling components (Card, Button, etc.)
2. Follows the same localization pattern with i18next
3. Uses the same toast notification system
4. Follows the same TypeScript patterns and interfaces

## Localization

The component supports all existing languages (EN, TR, ES, FR, DE) with the following translation keys:

- `vehicleMaterialAnalysis.title`
- `vehicleMaterialAnalysis.uploadDescription`
- `vehicleMaterialAnalysis.supportedFormats`
- `vehicleMaterialAnalysis.analyze`
- `vehicleMaterialAnalysis.analyzing`
- `vehicleMaterialAnalysis.edit`
- `vehicleMaterialAnalysis.reset`
- `vehicleMaterialAnalysis.results`
- `vehicleMaterialAnalysis.texture`
- `vehicleMaterialAnalysis.textureType`
- `vehicleMaterialAnalysis.finish`
- `vehicleMaterialAnalysis.characteristics`
- `vehicleMaterialAnalysis.color`
- `vehicleMaterialAnalysis.primaryColor`
- `vehicleMaterialAnalysis.secondaryColor`
- `vehicleMaterialAnalysis.colorPalette`
- `vehicleMaterialAnalysis.pattern`
- `vehicleMaterialAnalysis.structure`
- `vehicleMaterialAnalysis.direction`
- `vehicleMaterialAnalysis.reliefDepth`
- `vehicleMaterialAnalysis.confirm`
- `vehicleMaterialAnalysis.lighting`
- `vehicleMaterialAnalysis.reflectivity`
- `vehicleMaterialAnalysis.lightAbsorption`
- `vehicleMaterialAnalysis.shadowIntensity`

## Testing

To test the component functionality:

1. Create a test page that includes the VehicleMaterialAnalysis component
2. Upload a material image
3. Click the "Analyze Material" button
4. Verify that analysis results are displayed
5. Try editing the results and confirming them
6. Test the reset functionality

## Example Test Implementation

See `VehicleMaterialAnalysisExample.tsx` for a complete integration example.