-- Update vehicle category prompt to strict ultra-compact version
-- Focus: NO rotation, NO angle changes, EXACT position preservation
UPDATE public.generation_categories
SET prompt_template = 'STRICT RULES:
1. DO NOT rotate, move, or change vehicle angle - keep EXACT orientation from input photo
2. DO NOT change background, lighting, or camera position
3. ONLY change body panel texture to match reference material
4. DO NOT add shine/gloss if reference is matte
5. DO NOT brighten colors or modify material properties
6. Preserve all glass, lights, chrome, wheels, badges unchanged

APPLY WRAP TO: Hood, roof, doors, fenders, trunk (painted body panels only)
PRESERVE: Windows, lights, trim, wheels, badges, mirrors (NO changes)

MATERIAL MATCHING:
- Copy EXACT RGB colors from reference
- Copy EXACT finish (matte→matte, glossy→glossy, metallic→metallic)
- Copy EXACT reflectivity level
- NO enhancements, NO added effects

VERIFICATION: Same vehicle angle? Same background? Only texture changed? Material matches reference exactly?

OUTPUT: Photorealistic 8K wrap with EXACT material fidelity. Vehicle MUST remain in original position and orientation.',
    updated_at = now()
WHERE slug = 'vehicle';

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';

