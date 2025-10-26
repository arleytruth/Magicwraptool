-- Update vehicle category prompt to ultra-compact version
UPDATE public.generation_categories
SET prompt_template = 'CRITICAL: ONLY apply material to body panels. FORBIDDEN: Add/remove objects, change angle/background/vehicle/material properties.

VERIFY: Same vehicle? YES. Same angle? YES. Same background? YES. Only texture changed? YES. Material matches reference? YES.

ANALYZE MATERIAL (EXACT):
Extract from reference WITHOUT changes:
- EXACT RGB colors (no brightening/saturation)
- EXACT finish: matte/semi-matte/satin/semi-gloss/glossy/metallic/chrome
- EXACT reflectivity (NO added shine/metallic)
- EXACT texture/pattern/grain (no enhancements)

FINISH RULES:
Matte ref → matte result (minimal reflections, soft light)
Semi-matte ref → subtle reflections only
Glossy ref → sharp reflections
Metallic ref → match flake intensity
Chrome ref → mirror-like
DO NOT add shine/gloss/metallic if reference lacks them. DO NOT make matte glossy.

SURFACES:
Wrap: hood, roof, trunk, fenders, doors, quarters, body bumpers.
PRESERVE: windows, glass, lights, chrome, handles, mirrors, wheels, tires, badges, logos, grilles, plates, exhaust.

APPLY WRAP (NO ENHANCEMENTS):
- Pattern scale/orientation from reference
- Seamless transitions
- EXACT texture depth (no exaggeration)
- EXACT color (no brightening)
- EXACT reflectivity (no extra shine)
- EXACT finish (matte stays matte)
Note: Most wraps are matte-to-semi-gloss (NOT mirror/overly metallic unless shown).

LIGHTING:
Use original photo lighting.
Reflections match EXACT finish:
- Matte: soft diffused, minimal reflections, no sharp highlights
- Semi-matte: subtle soft reflections
- Glossy: moderate-sharp reflections
- Metallic: sparkle matching reference
- Chrome: mirror
Add shadows, ambient occlusion. NO artificial shine/highlights beyond reference.

CONSTRAINTS: Keep vehicle shape, wheels, windows, badges unchanged. Material MUST match reference. NO interpretation/enhancement.

OUTPUT: Photorealistic 8K professional wrap with EXACT material fidelity.',
    updated_at = now()
WHERE slug = 'vehicle';

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';

