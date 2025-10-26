-- Update generation category prompts with detailed instructions

-- Vehicle category prompt
UPDATE generation_categories
SET 
    prompt_template = 'CRITICAL RULES - ABSOLUTE PRESERVATION:
You MUST NOT add, remove, or change ANY elements. ONLY apply surface material to body panels.
❌ FORBIDDEN: Adding objects, changing camera angle, rotating vehicle, modifying background, altering vehicle model, changing material properties
✅ ALLOWED: Surface texture/material application on body panels ONLY - EXACTLY as shown in material reference image

VERIFICATION CHECKLIST:
- Same vehicle model? REQUIRED: YES
- Same camera angle? REQUIRED: YES  
- Same background? REQUIRED: YES
- Only texture changed? REQUIRED: YES
- No new objects added? REQUIRED: YES
- Material appearance matches reference image? REQUIRED: YES

STEP 1 - ANALYZE WRAP MATERIAL WITH EXACT FIDELITY:
Examine the wrap material reference image and extract EXACT properties WITHOUT interpretation or enhancement:
- EXACT color values (RGB) from reference - DO NOT brighten, saturate, or shift colors
- EXACT surface finish from reference: matte/semi-matte/satin/semi-gloss/glossy/metallic/chrome
- EXACT reflectivity level shown in material image - DO NOT add extra shine or metallic effects
- EXACT texture depth and pattern as shown - DO NOT enhance or exaggerate
- Surface texture type: smooth/rough/grainy/woven/brushed (EXACTLY as reference shows)
- Pattern structure: geometric/organic/random/repeating (EXACTLY as reference shows)
- Directional grain or weave (if present in reference)

CRITICAL MATERIAL FINISH RULES:
- If material reference is MATTE → wrapped vehicle MUST be matte (minimal reflections, soft light diffusion)
- If material reference is SEMI-MATTE/SATIN → wrapped vehicle MUST be semi-matte (subtle soft reflections only)
- If material reference is SEMI-GLOSS → wrapped vehicle MUST be semi-gloss (moderate reflections)
- If material reference is GLOSSY → wrapped vehicle MUST be glossy (sharp reflections)
- If material reference is METALLIC → wrapped vehicle MUST show metallic flake (but match intensity from reference)
- If material reference is CHROME → wrapped vehicle MUST be mirror-like chrome
- DO NOT ADD shine, metallic effects, or gloss if material reference doesn''t show them
- DO NOT make matte materials glossy
- DO NOT add artificial highlights or extra reflectivity

STEP 2 - IDENTIFY VEHICLE SURFACES:
Wrappable zones: hood, roof, trunk/tailgate, fenders, doors, quarter panels, body-colored bumper sections.
NON-wrappable zones (PRESERVE UNCHANGED): windows, glass, headlights, taillights, chrome trim, door handles, mirrors, wheels, tires, badges, logos, grilles, license plates, exhaust tips.

STEP 3 - APPLY WRAP TO BODY PANELS:
Transfer the analyzed material properties to vehicle body panels with EXACT REPLICATION - NO ENHANCEMENTS:
- Correct pattern scale and orientation matching material reference
- Seamless transitions between panels
- EXACT texture depth from material reference (do not exaggerate)
- EXACT color matching from material reference (do not brighten or saturate)
- EXACT reflectivity level from material reference (do not add extra shine)
- EXACT surface finish from material reference (matte stays matte, gloss stays gloss)

Realistic wrap appearance: Most vehicle wraps have a subtle matte-to-semi-gloss finish (NOT mirror-like or overly metallic unless material reference specifically shows this).

STEP 4 - LIGHTING AND REALISM:
Use the original vehicle photo''s lighting conditions. Add environmental integration with:
- Natural lighting matching original photo
- Shadows that respect the material''s ACTUAL surface properties from reference
- Reflections ONLY appropriate to the EXACT finish type shown in material reference:
  * Matte finish: soft diffused light, minimal reflections, no sharp highlights
  * Semi-matte/Satin: subtle soft reflections, gentle highlights
  * Glossy finish: moderate to sharp reflections
  * Metallic: directional sparkle matching reference intensity
  * Chrome: mirror-like reflections
- Ambient occlusion in panel gaps
- Realistic edge treatment
- DO NOT add artificial shine, extra highlights, or metallic effects beyond what material reference shows

CONSTRAINTS: 
- Keep vehicle shape, proportions, wheels, windows, badges, and structural design 100% unchanged
- ONLY modify surface appearance with the analyzed wrap material
- Material appearance on vehicle MUST precisely match the material reference image
- DO NOT interpret, enhance, or artificially improve the material finish
- DO NOT add gloss, shine, or metallic effects unless clearly visible in material reference

OUTPUT: Ultra-realistic, photorealistic, 8K quality, professional automotive wrap visualization with EXACT material fidelity to reference image, masterpiece.',
    updated_at = now()
WHERE slug = 'vehicle';

-- Furniture category prompt
UPDATE generation_categories
SET 
    prompt_template = 'CRITICAL: ONLY apply material to furniture surfaces. FORBIDDEN: Add/remove objects, change angle/background/furniture/hardware/material properties.

VERIFY: Same furniture? YES. Same angle? YES. Same background? YES. Only surface material changed? YES. Material matches reference? YES.

ANALYZE MATERIAL (EXACT):
Extract from reference WITHOUT changes:
- EXACT RGB colors (no brightening/saturation)
- Material type: wood grain/fabric/leather/laminate/paint
- EXACT finish: matte/satin/glossy/distressed
- EXACT texture: grain direction/weave structure/pattern scale
- EXACT reflectivity (NO added shine)

FINISH RULES:
Matte ref→matte result (soft light absorption)
Satin ref→subtle soft sheen
Glossy ref→moderate reflections
Wood ref→natural grain highlights (no over-enhancement)
Fabric ref→weave visibility, light absorption
Leather ref→appropriate sheen matching reference
DO NOT add shine/gloss if reference lacks them. DO NOT make matte glossy.

SURFACES:
Cover: tabletops, cabinet doors, drawer fronts, chair seats/backs, shelving, side panels, armrests, headboards.
PRESERVE: hardware, hinges, knobs, locks, decorative carvings, inlays, glass inserts, metal legs.

APPLY MATERIAL (NO ENHANCEMENTS):
- Grain/pattern direction matching design
- Seamless edge transitions
- EXACT texture depth maintaining contours
- EXACT color (no brightening)
- EXACT reflectivity (no extra shine)
- EXACT finish (matte stays matte)
- Fabric: correct weave scale consistency
- Wood: grain continuity across panels
- Leather: natural surface variations

LIGHTING:
Use original photo lighting (interior/natural).
Reflections match EXACT finish:
- Matte: soft diffused, minimal reflections
- Satin: subtle soft sheen
- Glossy: moderate reflections
- Wood: subtle grain highlights
- Fabric: light absorption, visible weave
- Leather: appropriate sheen from reference

CONSTRAINTS: Keep furniture shape, proportions, hardware unchanged. Material MUST match reference. NO interpretation/enhancement.

OUTPUT: Photorealistic refinishing with EXACT material fidelity.',
    updated_at = now()
WHERE slug = 'furniture';

