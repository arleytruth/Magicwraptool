# Furniture Material Analysis Component

## Overview

The FurnitureMaterialAnalysis component is designed to analyze furniture material images and extract key properties needed for the wrapping process. It provides a user-friendly interface for uploading material images and viewing analysis results.

## Features

1. **Image Upload**: Drag and drop or click to upload material images
2. **Material Analysis**: Extracts key properties from the material image:
   - Texture type (wood, fabric, leather, vinyl, etc.)
   - Primary and secondary colors with RGB values
   - Surface finish type (matte, glossy, satin, distressed)
   - Pattern structure and direction
   - Material characteristics (grain lines, weave pattern, embossing)
   - Scale and detail level
   - Lighting properties (reflectivity, light absorption, shadow intensity)
   - Depth properties (wood grain depth, fabric texture depth, leather sheen level)
3. **Results Display**: Shows analysis results in an organized, user-friendly interface
4. **Adjustment Options**: Allows users to adjust or confirm analysis results
5. **Integration Ready**: Prepared material properties for the application process

## Usage

### Basic Implementation

```tsx
import { FurnitureMaterialAnalysis } from '@/components/FurnitureMaterialAnalysis';

function MyComponent() {
  return (
    <FurnitureMaterialAnalysis />
  );
}
```

### With Custom Handling

```tsx
import { FurnitureMaterialAnalysis } from '@/components/FurnitureMaterialAnalysis';

function MyComponent() {
  const handleAnalysisComplete = (analysisData) => {
    // Handle the analyzed material properties
    console.log('Analysis complete:', analysisData);
    
    // Prepare for application process
    // ... your logic here
  };

  return (
    <FurnitureMaterialAnalysis onAnalysisComplete={handleAnalysisComplete} />
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
interface MaterialAnalysis {
  textureType: 'wood' | 'fabric' | 'leather' | 'vinyl' | 'other';
  primaryColor: string; // Hex color value
  secondaryColor: string; // Hex color value
  colorPalette: string[]; // Array of hex color values
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
```

## Integration with Existing UI

The component is designed to integrate seamlessly with the existing UI components and state management patterns used in the project:

1. Uses the same styling components (Card, Button, etc.)
2. Follows the same localization pattern with i18next
3. Uses the same toast notification system
4. Follows the same TypeScript patterns and interfaces

## Localization

The component supports all existing languages (EN, TR, ES, FR, DE) with the following translation keys:

- `furnitureMaterialAnalysis.title`
- `furnitureMaterialAnalysis.uploadDescription`
- `furnitureMaterialAnalysis.supportedFormats`
- `furnitureMaterialAnalysis.analyze`
- `furnitureMaterialAnalysis.analyzing`
- `furnitureMaterialAnalysis.edit`
- `furnitureMaterialAnalysis.reset`
- `furnitureMaterialAnalysis.results`
- `furnitureMaterialAnalysis.texture`
- `furnitureMaterialAnalysis.textureType`
- `furnitureMaterialAnalysis.finish`
- `furnitureMaterialAnalysis.characteristics`
- `furnitureMaterialAnalysis.color`
- `furnitureMaterialAnalysis.primaryColor`
- `furnitureMaterialAnalysis.secondaryColor`
- `furnitureMaterialAnalysis.colorPalette`
- `furnitureMaterialAnalysis.pattern`
- `furnitureMaterialAnalysis.structure`
- `furnitureMaterialAnalysis.direction`
- `furnitureMaterialAnalysis.scale`
- `furnitureMaterialAnalysis.detail`
- `furnitureMaterialAnalysis.confirm`
- `furnitureMaterialAnalysis.lighting`
- `furnitureMaterialAnalysis.reflectivity`
- `furnitureMaterialAnalysis.lightAbsorption`
- `furnitureMaterialAnalysis.shadowIntensity`
- `furnitureMaterialAnalysis.depthProperties`
- `furnitureMaterialAnalysis.woodGrainDepth`
- `furnitureMaterialAnalysis.fabricTextureDepth`
- `furnitureMaterialAnalysis.leatherSheenLevel`

## Testing

To test the component functionality:

1. Create a test page that includes the FurnitureMaterialAnalysis component
2. Upload a material image
3. Click the "Analyze Material" button
4. Verify that analysis results are displayed
5. Try editing the results and confirming them
6. Test the reset functionality

## Example Test Implementation

See `FurnitureMaterialAnalysisExample.tsx` for a complete integration example.