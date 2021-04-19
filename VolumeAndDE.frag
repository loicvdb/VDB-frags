#define volumetric
#include "Background-VDB.frag"
#include "DE-Raytracer-VDB.frag"

float getDensity(vec3 p) {
	vec2 z = vec2(p.z, p.z);
	vec2 c = vec2(p.x, p.y);
	for(int i = 0; i < 16; i++) {
		z = vec2(z.x*z.x-z.y*z.y, 2.*z.x*z.y) + c;
		if(dot(z, z) >= 4.) break;
	}
	return dot(z, z) >= 4. ? 0. : 1.;
}


float boxDE(vec3 p, vec3 s) {
	vec3 a = abs(p.xyz) - s;
	return (min(max(max(a.x, a.y), a.z), 0.) + length(max(a, 0.0)));
}

float DE(vec3 pos) {
	pos *= 2.;
	vec3 cPos = floor(clamp(pos+.5, vec3(-2, 0, -1), vec3(2, 0, 1)));
	return boxDE(pos-cPos, vec3(.1, 2., .1)) * .5;
}

#preset Default
FOV = 0.3
Eye = -4.25756092,-0.517471921,3.67268137
Target = 3.13498104,0.443053054,-2.9927305
Up = -0.016564908,0.992069888,0.124591118
FocalPlane = 4.883721
Aperture = 0.05573771
LightDirection = 0.237530396,0.715986149,0.6564626
SceneRadius = 2
Bounces = 8
VolumeStepSize = 0.05
VolumeDensity = 30
VolumeColor = 0.596078431,0.91372549,1
#endpreset
