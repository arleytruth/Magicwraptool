import type { WrapCategory } from "@/types/wrap";

const prompts: Record<WrapCategory, string> = {
    vehicle: `STRICT RULES:
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

OUTPUT: Photorealistic 8K wrap with EXACT material fidelity. Vehicle MUST remain in original position and orientation.`,
    furniture: `CRITICAL: ONLY apply material to furniture surfaces. FORBIDDEN: Add/remove objects, change angle/background/furniture/hardware/material properties.

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

OUTPUT: Photorealistic refinishing with EXACT material fidelity.`,
    wall: `CRITICAL: ONLY apply material to wall surfaces. FORBIDDEN: Add/remove objects, change angle/background/room/fixtures/material properties.

ANALYZE MATERIAL (EXACT):
- Identify material type: paint/wallpaper/tile/wood paneling/fabric
- EXACT RGB colors (no brightening/saturation)
- EXACT finish: matte/eggshell/satin/gloss
- EXACT pattern structure/repeat
- EXACT texture depth
- EXACT reflectivity (NO added shine)

APPLY COVERING:
For PAINT: even coverage, wall texture showing through.
For WALLPAPER: pattern alignment/repeat, scale to wall dimensions.
For TILE: grout lines consistent with reference.

PRESERVE: outlets, switches, fixtures, artwork, baseboards, moldings.

LIGHTING:
Match original shadows/highlights, no additional reflections beyond finish.

OUTPUT: Photorealistic interior wall transformation faithful to reference.`,
    building: `CRITICAL: ONLY apply material to building exterior walls. FORBIDDEN: Change geometry, windows, balconies, roofing, lighting.

ANALYZE MATERIAL:
- Determine facade material (brick/stone/metal/wood/composite)
- EXACT color + finish
- Pattern scale + joint layout
- Texture depth + weathering level

APPLY CLADDING:
- Wrap facade panels only
- Maintain seams, expansion joints, architectural lines
- Preserve windows, frames, trims, signage, lights

LIGHTING:
Respect scene illumination; reflections/properties must match new material type.

OUTPUT: Photorealistic architectural facade with EXAT reference fidelity.`,
    electronics: `CRITICAL: ONLY apply material to device casing. FORBIDDEN: Change buttons, ports, screen content, logos, camera layout.

ANALYZE MATERIAL:
- EXACT colors, finish (matte/gloss/satin/metallic)
- Texture scale/grain (leather/carbon fiber/etc.)
- Reflectivity level

APPLY WRAP:
- Cover back/sides while preserving openings + tolerances
- Maintain precise edge wrapping, no bulging/stretching
- Align patterns consistently across surfaces

LIGHTING:
Consistent with original highlights/shadows, preserve device reflections.

OUTPUT: Hyper-realistic device wrap accurately matching reference material.`,
    box: `CRITICAL: ONLY apply design/material to box outer surfaces. FORBIDDEN: Add/remove objects, change angle/background/box structure/material properties.

VERIFY: Same box shape? YES. Same angle? YES. Same background? YES. Only box surface changed? YES. Material matches reference? YES.

ANALYZE BOX:
Identify: box type (rectangular/cube/custom die-cut), visible surfaces (top/front/side panels), box angles/orientation, surface texture (cardboard/glossy laminated/matte), existing folds/seams, lighting direction/shadows.

ANALYZE DESIGN MATERIAL (EXACT):
Determine input type: graphic design (logo/text/patterns/images), technical drawing (dieline/template), material texture (wood grain/fabric/metallic finish).
Extract from reference WITHOUT changes:
- EXACT RGB colors (no brightening/saturation)
- Pattern elements, text/logo placement
- Design scale/proportions
- EXACT finish: matte/glossy/spot UV/embossed
- EXACT reflectivity (NO added shine)

FINISH RULES:
Matte ref→matte result (soft light absorption)
Glossy ref→moderate reflections
Spot UV ref→selective glossy areas only where shown
Embossed ref→raised texture matching reference depth
DO NOT add shine/gloss if reference lacks them. DO NOT make matte glossy.

APPLY DESIGN TO BOX:
For GRAPHIC DESIGN: wrap design onto visible box panels with correct perspective distortion matching box angles, proper alignment at edges/folds, appropriate scale to box size, seamless continuation across edges if design flows between panels.
For TECHNICAL DRAWING: interpret dieline and apply designed areas to corresponding box surfaces with correct orientation.
For MATERIAL TEXTURE: apply texture uniformly to box surfaces maintaining box shape/contours.
CRITICAL: Design must follow box perspective and surface angles naturally as if physically printed/applied on box.

LIGHTING:
Use original photo lighting.
Add: shadows/highlights appropriate to box angles and surface finish.
Finish interaction:
- Matte: light absorption, no reflections
- Glossy: reflections
- Spot UV: selective shine areas only
- Embossed: depth shadows at raised areas
Realistic depth at box edges/folds. Proper color rendering under lighting. NO artificial shine beyond reference.

CONSTRAINTS: Keep box shape, dimensions, orientation, angle, structural elements unchanged. Design MUST match reference. NO interpretation/enhancement.

OUTPUT: Photorealistic 8K packaging mockup with EXACT material fidelity for print production.`,
    auto_tuning: `CRITICAL: ONLY modify wrap appearance on vehicle body panels. FORBIDDEN: Alter geometry, wheels, lights, glass unless reference shows modifications.

APPLY MATERIAL:
- Follow vehicle contours, panel gaps, aerodynamic parts
- Maintain carbon fiber/metallic orientations and flake behavior
- Respect matte vs gloss vs chrome per reference

LIGHTING:
- Enhance reflections consistent with finish (glossy = sharp, matte = soft)
- Keep background + environment lighting identical

OUTPUT: High-fidelity automotive tuning render faithful to reference material.`,
    general_item: `CRITICAL: ONLY apply material to target object. Preserve shape, scale, background, lighting.

ANALYZE MATERIAL:
- Extract exact color palette and finish
- Identify texture scale/grain direction
- Note reflectivity + specular behavior

APPLY WRAP:
- Follow object topology
- Maintain seams/edges/fasteners
- Avoid distortions, stretching, or gloss changes

OUTPUT: Photo-real surface transformation matching reference material exactly.`,
};

export function promptForCategory(category: WrapCategory) {
    return prompts[category] ?? prompts.vehicle;
}

