#donotrun
#include "Utils-VDB.frag"




/****************************************************************
 * Surface BRDFs : work in surface space (z is normal).
 * Normalized to 2, 1 when cosine weighted.
 ****************************************************************/

vec3 lambertImportanceSampling(vec3 V) {
	float a = RANDOM * 2. * PI;
	float r = sqrt(RANDOM);
	return vec3(sqrt(1. - r * r) * vec2(cos(a), sin(a)), r);
}

float lambertPDF(vec3 V, vec3 R) {
	return max(R.z, 0.) * INV_PI;
}

vec3 lambertBRDF(vec3 V, vec3 L, vec3 color) {
	return max(sign(V.z*L.z) * color, vec3(0.)) * INV_PI;
}

vec3 translucentImportanceSampling(vec3 V) {
	return lambertImportanceSampling(V) * (RANDOM < .5 ? -1. : 1.);
}

float translucentPDF(vec3 V, vec3 R) {
	return abs(R.z) * .5 * INV_PI;
}

vec3 translucentBRDF(vec3 V, vec3 L, vec3 color) {
	return color * .5 * INV_PI;
}




/****************************************************************
 * Volume BRDFs : work in "scattering space" (z is intersection
 * direction). Normalized to 1.
 ****************************************************************/

float henyeyGreensteinIntegral(float cosTheta, float anisotropy){
	if(anisotropy == 0.) return cosTheta;
 	return (1.-anisotropy*anisotropy)/(anisotropy*sqrt(1.+anisotropy*(anisotropy-2.*cosTheta)));
}

vec3 henyeyGreensteinImportanceSampling(float anisotropy) {
	float cosTheta = 1. + henyeyGreensteinIntegral(-1., anisotropy) - henyeyGreensteinIntegral(RANDOM*2.-1., anisotropy);
	float r = sqrt(max(1.-cosTheta*cosTheta, 0.));
	float a = RANDOM * 2. * PI;
	return vec3(r*cos(a), r*sin(a), cosTheta);
}

float henyeyGreensteinPDF(vec3 V, float anisotropy){
	return .25 * INV_PI * (1.-anisotropy*anisotropy) / pow(1.+anisotropy*(anisotropy-2.*V.z), 1.5);
}

vec3 henyeyGreensteinBRDF(vec3 L, vec3 color, float anisotropy) {
 	return henyeyGreensteinPDF(L, anisotropy) * color;
}

vec3 isotropicImportanceSampling() {
	float cosTheta = RANDOM*2.-1.;
	float r = sqrt(max(1.-cosTheta*cosTheta, 0.));
	float a = RANDOM*2.*PI;
	return vec3(r*cos(a), r*sin(a), cosTheta);
}

float isotropicPDF(vec3 V) {
 	return .25 * INV_PI;
}

vec3 isotropicBrdf(vec3 L, vec3 color) {
 	return isotropicPDF(L) * color;
}