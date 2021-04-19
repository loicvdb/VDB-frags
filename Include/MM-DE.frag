#donotrun

#include "Color-Management.frag"

#define providesColor

#group Fractal
uniform float FracScale; slider[1,1.8,3]
uniform float FracAng1; slider[-3.14159265358979323846264,-.12,3.14159265358979323846264]
uniform float FracAng2; slider[-3.14159265358979323846264,.5,3.14159265358979323846264]
uniform vec3 FracShift; slider[(-12,-12,-12),(-2.12,-2.75,.49),(12,12,12)]
uniform int FracIter; slider[1,16,32]

#group Coloring
uniform vec3 FracCol; slider[(-2,-2,-2),(.42,.38,.19),(2,2,2)]


vec3 fractalColor = vec3(1.);

float de_box(vec3 p, vec3 s) {
	vec3 a = abs(p.xyz) - s;
	return (min(max(max(a.x, a.y), a.z), 0.) + length(max(a, 0.0)));
}

/*
void mengerFold(inout vec3 z) {
	const vec2 mp = vec2(-1.,1.);
	z.xy += min(z.x - z.y, 0.0)*mp;
	z.xz += min(z.x - z.z, 0.0)*mp;
	z.yz += min(z.y - z.z, 0.0)*mp;
}

float MM_DE(vec3 pos) {
	vec2 a1 = vec2(sin(FracAng1), cos(FracAng1));
	vec2 a2 = vec2(sin(FracAng2), cos(FracAng2));
	mat2 rmZ = mat2(a1.y, a1.x, -a1.x, a1.y);
	mat2 rmX = mat2(a2.y, a2.x, -a2.x, a2.y);
	vec3 orbit = vec3(0.);
	vec4 p = vec4(pos, 1.);
	for (int i = 0; i < FracIter; i++) {
		p.xyz = abs(p.xyz);
		p.xy *= rmZ;
		mengerFold(p.xyz);
		p.yz *= rmX;
		p *= FracScale;
		p.xyz += FracShift;
		orbit = max(orbit, p.xyz*FracCol);
	}
	fractalColor = clamp(orbit, vec3(0), vec3(1));
	return de_box(p.xyz, vec3(6.))/p.w;
}*/


float MM_DE(vec3 pos) {
	vec2 a1 = vec2(sin(FracAng1), cos(FracAng1));
	vec2 a2 = vec2(sin(FracAng2), cos(FracAng2));
	mat2 rmZ = mat2(a1.y, a1.x, -a1.x, a1.y);
	mat2 rmX = mat2(a2.y, a2.x, -a2.x, a2.y);
	vec3 orbit = vec3(0.);
	vec4 p = vec4(pos, 1.);
	const vec2 mp = vec2(-1.,1.);
	for (int i = 0; i < FracIter; i++) {
		p.xyz = abs(p.xyz);
		p.xy *= rmZ;
		p.xy += min(p.x - p.y, 0.0)*mp;
		p.xz += min(p.x - p.z, 0.0)*mp;
		p.yz += min(p.y - p.z, 0.0)*mp;
		p.yz *= rmX;
		p *= FracScale;
		p.xyz += FracShift;
		orbit = max(orbit, p.xyz*FracCol);
	}
	fractalColor = clamp(orbit, vec3(0), vec3(1));
	return de_box(p.xyz, vec3(6.))/p.w;
}

vec3 baseColor(vec3 point, vec3 normal) {
	MM_DE(point-MM_DE(point)*normal);
	return srgb2linear(fractalColor);
}

#preset JumpTheCrater
FracScale = 1.8
FracAng1 = -0.12
FracAng2 = 0.5
FracShift = -2.12, -2.75, 0.49
FracCol = 0.42, 0.38, 0.19
#endpreset

#preset TooManyTrees
FracScale = 1.9073
FracAng1 = 2.736
FracAng2 = -1.16
FracShift = -3.508, -3.593, 3.295
FracCol = -0.34, 0.12, -0.08
#endpreset

#preset HoleInOne
FracScale = 2.02
FracAng1 = -1.57
FracAng2 = 1.62
FracShift = -3.31, 6.19, 1.53
FracCol = 0.12, -0.09, -0.09
#endpreset

#preset AroundTheWorld
FracScale = 1.65
FracAng1 = 0.37
FracAng2 = -1.023
FracShift = -1.41, -0.22, -0.77
FracCol = 0.14, -1.71, 0.31
#endpreset

#preset BewareOfBumps     
FracScale = 1.66
FracAng1 = 1.52
FracAng2 = 0.19
FracShift = -3.83, -1.94, -1.09
FracCol = 0.42, 0.38, 0.19
#endpreset

#preset MountainClimbing
FracScale = 1.58
FracAng1 = -1.45
FracAng2 = -2.333
FracShift = -1.55, -0.13, -2.52
FracCol = -1.17, -0.4, -1.0
#endpreset

#preset MindTheGap                        
FracScale = 1.81
FracAng1 = 1.443
FracAng2 = -2.99
FracShift = -2.905, 0.765, -4.165
FracCol = 0.251, 0.337, 0.161
#endpreset

#preset TheSponge
FracScale = 1.88
FracAng1 = 1.52
FracAng2 = -1.373
FracShift = -4.54, -1.26, 0.1
FracCol = -1.0, 0.3, -0.43
#endpreset

#preset BuildUpSpeed
FracScale = 2.08
FracAng1 = 1.493
FracAng2 = -3.123
FracShift = -7.43, 5.96, -6.23
FracCol = 0.16, 0.38, 0.15
#endpreset

#preset TheCitadel
FracScale = 2.0773
FracAng1 = 2.906
FracAng2 = -1.34
FracShift = -1.238, -1.533, 1.085
FracCol = 0.42, 0.38, 0.19
#endpreset

#preset MegaCitadel
FracScale = 1.4731
FracAng1 = 0.0
FracAng2 = 0.0
FracShift = -10.27, 3.28, -1.90
FracCol = 1.17, 0.07, 1.27
#endpreset