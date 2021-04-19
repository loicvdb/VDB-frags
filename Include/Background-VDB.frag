#donotrun
#include "Utils-VDB.frag"
#include "Color-Management.frag"

#define providesBackground
#define providesLight

// exp(x) is infinity for numbers bigger than this
#define EXP_UPPER 85.0
#define SKY_STEP_EXPONENT .5


#group Scene
uniform vec3 LightDirection; slider[(0,0,0),(0,1,0),(0,0,0)]
uniform vec4 LightColor; color[0,3,100,1.0,1.0,1.0]
uniform float LightRadius; slider[0,.01,.5]
uniform int SkySamples; slider[0,16,32]
uniform vec3 SkyUp; slider[(0,0,0),(0,1,0),(0,0,0)]
uniform vec4 RayleighColor; color[0,.3,1,.65,.82,.95]
uniform vec4 MieColor; color[0,.05,.2,1.,1.,1.]
uniform float MieAnisotropy; slider[-1.,.6,1.];


vec4 LinearLightColor = vec4(srgb2linear(LightColor.rgb), LightColor.w);
vec4 LinearRayleighColor = vec4(srgb2linear(RayleighColor.rgb), RayleighColor.w);
vec4 LinearMieColor = vec4(srgb2linear(MieColor.rgb), MieColor.w);


float anisotropicWeight(vec3 dirI, vec3 dirO, float a){
 	return .25*(1.-a*a) / pow(1.+a*(a-2.*dot(dirI, dirO)), 1.5);
}

vec3 integrateAbsorptionToInf(float localDensity, float verticalness, vec3 volumeDensities) {
    if(verticalness < 0.) return 1.-sign(volumeDensities);
    return exp(-volumeDensities/verticalness * localDensity);
}

vec3 lightSample(vec3 pos, out float dist) {
	dist = -1.;
	vec3 t = ORTHO(LightDirection);
	vec3 b = cross(t, LightDirection);
	mat3 light2Word = inverse(mat3(t, b, LightDirection));
	float a = RANDOM * 2.0 * PI;
	float r =  1. - (1.-cos(LightRadius)) * RANDOM;
	return vec3(sqrt(1. - r*r) * vec2(cos(a), sin(a)), r) * light2Word;
}

vec3 skyScatter(vec3 dir, vec3 backColor) {
	vec3 volumeDensities = LinearRayleighColor.rgb*LinearRayleighColor.w + LinearMieColor.w;
	float verticalness = dot(dir, SkyUp);
	float tmp;
	vec3 mcLightDirection = lightSample(vec3(0), tmp);
	float lightVerticalness = dot(mcLightDirection, SkyUp);
	float height = 0.0;
	vec3 weightedMieColor = LinearMieColor.rgb * anisotropicWeight(dir, mcLightDirection, MieAnisotropy);
	vec3 volCol = vec3(0.), volAbs = vec3(1.);
    for(int i = 0; i < SkySamples; i++) {
        float localDensity = exp(min(-height, EXP_UPPER));
		float delta = exp(min(height*SKY_STEP_EXPONENT, EXP_UPPER));
        height += verticalness*delta;
		if(height > 10000000.0) break;	// quick fix
        vec3 absRayleigh = exp(-delta * localDensity*LinearRayleighColor.rgb*LinearRayleighColor.w);
        float absMie = exp(-delta * localDensity*LinearMieColor.w);
		vec3 transmittance = (1.-absRayleigh) + (1.-absMie)*weightedMieColor;
		vec3 directLight = LinearLightColor.rgb*LinearLightColor.w*integrateAbsorptionToInf(localDensity, lightVerticalness, volumeDensities);
        volCol += volAbs * transmittance * directLight;
		volAbs *= absRayleigh*absMie;
    }
    return volCol + backColor*integrateAbsorptionToInf(1.0, verticalness, volumeDensities);
}

vec3 background(vec3 dir) {
	return skyScatter(dir, vec3(0.));
}

float lightPDF(vec3 V) {
	float sphericalCapArea = TWO_PI * (1.-cos(LightRadius));
	float isInCone = step(cos(LightRadius), dot(V, LightDirection));
	return isInCone / sphericalCapArea;
}

bool hitLight(vec3 pos, vec3 dir, float t, out vec3 color) {
	if(dot(dir, LightDirection) < cos(LightRadius) || t >= 0.) return false;
	float sphericalCapArea = TWO_PI * (1.-cos(LightRadius));
	color = skyScatter(dir, LinearLightColor.rgb*LinearLightColor.w/sphericalCapArea);
	return true;
}