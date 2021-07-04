#donotrun

#ifndef COLOR_MANAGEMENT_IMPORTED
#define COLOR_MANAGEMENT_IMPORTED

#extension GL_ARB_gpu_shader5 : enable

// from https://www.colour-science.org/apps/
const mat3 linear2acescg = mat3(0.613117812906440, 0.069934082307513, 0.020462992637737, 0.341181995855625, 0.918103037508582, 0.106768663382511, 0.045787344282337, 0.011932775530201, 0.872715910619442);
const mat3 acescg2linear = inverse(linear2acescg);

vec3 srgb2linear(vec3 c) {
	c = clamp(c, 0., 1.);
	return mix(pow((c+.055) / 1.055, vec3(2.4)), c / 12.92, step(c, vec3(.04045)));
}

vec3 linear2srgb(vec3 c) {
	return clamp(mix(1.055 * pow(c, vec3(1./2.4)), 12.92 * c, step(c, vec3(.0031308))), 0., 1.);
}

// fit from https://github.com/TheRealMJP/BakingLab/blob/master/BakingLab/ACES.hlsl
vec3 RRTAndODTFit(vec3 v){
	vec3 a = v * (v + 0.0245786f) - 0.000090537f;
	vec3 b = v * (0.983729f * v + 0.4329510f) + 0.238081f;
	return a / b;
}

#endif
