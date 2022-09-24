import * as SPOTLIGHTLIGHT from '../three.js-master/src/lights/SpotLight.js';
import * as POINTLIGHT from '../three.js-master/src/lights/PointLight.js';


export function enlight(object, intensity){

	var spotlight = new SPOTLIGHTLIGHT.SpotLight(0x0000ff);//0x338EF4
	spotlight.name = 'treasureLight';
	spotlight.intensity = intensity;
	spotlight.penumbra = 0.8;
	spotlight.angle = 1;
	spotlight.target = object;
	spotlight.physicallyCorrectLights = true;
	object.add(spotlight);
	spotlight.position.y+=2;

	return spotlight;
}

export function enlightTeleport(object, intensity){

	var pointlight = new POINTLIGHT.PointLight(0x76f731, intensity, 2, 2);//0x338EF4
	object.add(pointlight);
	pointlight.position.y+=1.5;
}

export function enlightPoint(object, distance){
	var pointlight;
	if(distance==undefined){pointlight = new POINTLIGHT.PointLight(0xff0000, 2, 2, 2);}
	else{pointlight = new POINTLIGHT.PointLight(0xff0000, 2*distance, distance, 2);}
	object.add(pointlight);
	
	return object;
}
