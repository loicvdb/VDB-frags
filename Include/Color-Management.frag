#donotrun

#ifndef COLOR_MANAGEMENT_IMPORTED
#define COLOR_MANAGEMENT_IMPORTED

#extension GL_ARB_gpu_shader5 : enable

#define SRGB_GAMMA 2.2

const mat3 linear2acescg = mat3(0.613117812906440, 0.341181995855625, 0.045787344282337, 0.069934082307513, 0.918103037508582, 0.011932775530201, 0.020462992637737, 0.106768663382511, 0.872715910619442);
const mat3 acescg2linear = inverse(linear2acescg);

vec3 srgb2linear(vec3 c) {
	return pow(max(c, vec3(0)), vec3(SRGB_GAMMA));
}

vec3 linear2srgb(vec3 c) {
	return pow(max(c, vec3(0)), vec3(1./SRGB_GAMMA));
}

vec3 srgb2acescg(vec3 c) {
	return linear2acescg * srgb2linear(c);
}

vec3 acescg2srgb(vec3 c) {
	return linear2srgb(acescg2linear * c);
}

// takes linear input and returns sRGB
vec3 tonemapping(vec3 x) {
	// probably not proper ACES, but it looks nice
	const float a = 2.51;
	const float b = 0.03;
	const float c = 2.43;
	const float d = 0.59;
	const float e = 0.14;
	return (x*(a*x+b))/(x*(c*x+d)+e);
}

#endif
