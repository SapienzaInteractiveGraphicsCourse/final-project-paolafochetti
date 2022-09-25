import * as THREE from '../three.js-master/build/three.module.js';

var groundDistance=0;
var objects=[];

//treasures
export function treasureAnimation(treasure, world, level){
	treasure.visible = false;
	var lightTreasure = treasure.getObjectByName('treasureLight')
    createjs.Tween.get(lightTreasure).to({intensity: 0},1000);
    setTimeout(()=>{
    	if(level==0){
    	    	world.sceneTop.attach(treasure)
    		    treasure.position.set(0,5.5,9.5);
    		    treasure.scale.set(0.09,0.09,0.09);
    		    treasure.visible=true
    		    treasure.rotation.y=-10*Math.PI/180
    		    world.scene.remove(lightTreasure)}
    	else if(level==1){
    	    	world.sceneTop.attach(treasure)
    		    treasure.position.set(0,4.8,10);
    		    treasure.visible=true
    		    treasure.rotation.y=-10*Math.PI/180
    		    world.scene.remove(lightTreasure)}

    },1000);
}

export function raise(treasure){
	treasure.visible = true;
    createjs.Tween.get(treasure.position).to({y:-0.6},10000);
    
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------------


//planet
export function animatePlanet(planet){
	createjs.Tween.get(planet.rotation,{loop:true}).to({y: 360*Math.PI/180},100000);
}	
//-----------------------------------------------------------------------------------------------------------------------------------------------------------


//racoon

export function grabTreasure(skeleton){
	skeleton.grab=false;
	createjs.Tween.get(skeleton.model.position).to({x: skeleton.model.position.x+0.1},150).wait(500).to({x: skeleton.model.position.x+0.3},150);

	createjs.Tween.get(skeleton.lowerSpine.rotation).to({x: skeleton.lowerSpine.rotation.x -20*Math.PI/180},150).wait(500).to({x: skeleton.lowerSpine.rotation.x},150);
	createjs.Tween.get(skeleton.upperSpine.rotation).to({x:skeleton.upperSpine.rotation.x -30*Math.PI/180},150).wait(500).to({x:skeleton.upperSpine.rotation.x },150);
	createjs.Tween.get(skeleton.head.rotation).to({x:skeleton.head.rotation.x +20*Math.PI/180},150).wait(500).to({x:skeleton.head.rotation.x},150);
	
	createjs.Tween.get(skeleton.rightThigh.rotation).to({x: skeleton.rightThigh.rotation.x-20*Math.PI/180},50).to({x:skeleton.rightThigh.rotation.x +30 *Math.PI/180},50).to({x: skeleton.rightThigh.rotation.x},50);

    createjs.Tween.get(skeleton.leftThigh.rotation).to({x: skeleton.leftThigh.rotation.x +30*Math.PI/180},50).to({x:skeleton.leftThigh.rotation.x -20 *Math.PI/180},50).to({x:skeleton.leftThigh.rotation.x},50);

	createjs.Tween.get(skeleton.rightShoulder.rotation).to({x: skeleton.rightShoulder.rotation.x - 32 *Math.PI/180, z: skeleton.rightShoulder.rotation.z - 20 *Math.PI/180},150).wait(500).to({x: skeleton.rightShoulder.rotation.x, z: skeleton.rightShoulder.rotation.z},150);
	createjs.Tween.get(skeleton.rightArm.rotation).to({x:skeleton.rightArm.rotation.x - 10*Math.PI/180},150).wait(500).to({x:skeleton.rightArm.rotation.x},150);		
	createjs.Tween.get(skeleton.rightHand.rotation).to({x:skeleton.rightHand.rotation.x+55*Math.PI/180},150).wait(500).to({x: skeleton.rightHand.rotation.x},150);
					
	createjs.Tween.get(skeleton.leftArm.rotation).to({x:skeleton.leftArm.rotation.x - 10*Math.PI/180},150).wait(500).to({x:skeleton.leftArm.rotation.x},150);
	createjs.Tween.get(skeleton.leftElbow.rotation).to({x:skeleton.leftElbow.rotation.x - 38*Math.PI/180},150).wait(500).to({x:skeleton.leftElbow.rotation.x},150);		
	createjs.Tween.get(skeleton.leftHand.rotation).to({x:skeleton.leftHand.rotation.x+20*Math.PI/180},150).wait(500).to({x:skeleton.leftHand.rotation.x},150);
}


export function rotate(racoon, pressed, camera){
	racoon.direction.x = racoon.model.position.x;
	racoon.direction.y = racoon.model.position.y;
	racoon.direction.z = racoon.model.position.z;
	racoon.previousDirection = racoon.model.position.clone();


	if(pressed[0]==true){
		racoon.direction.x += 0.8;
		if(pressed[1]==pressed[2] || pressed[3]==true){
			racoon.root.rotation.y = 90*Math.PI/180;
		}
		else if(pressed[1]==true){
			racoon.direction.z += 0.8;
			racoon.root.rotation.y = 45*Math.PI/180;
		}
		else if(pressed[2]==true){
			racoon.direction.z -= 0.8;
			racoon.root.rotation.y = 135*Math.PI/180;
		}

	}

	else if(pressed[3]==true){
		racoon.direction.x -= 0.8;

		if(pressed[1]==pressed[2] || pressed[0]==true){
			racoon.root.rotation.y = 270*Math.PI/180;
		}
		else if(pressed[1]==true){
			racoon.direction.z += 0.8;
			racoon.root.rotation.y = -45*Math.PI/180;
		}
		else if(pressed[2]==true){
			racoon.direction.z -= 0.8;
			racoon.root.rotation.y = -135*Math.PI/180;
		}
	}

	else if(pressed[1]==true){
		racoon.direction.z += 0.8; 
		racoon.root.rotation.y = 0*Math.PI/180;
	}

	else if(pressed[2]==true){
		racoon.direction.z -= 0.8;
		racoon.root.rotation.y = 180*Math.PI/180;
	}

	else{
		racoon.direction.x += 0.8;
		racoon.root.rotation.y = 90*Math.PI/180;}
}


export function move(racoon,world){
	var found;
	var obstacles = window.setInterval(function(){racoon=check4Obstacles(racoon,world);},100)
	
	rotate(racoon, racoon.pressed, world.camera);

	if(racoon.level<2){
	
		if (racoon.pressed[0]==true){
			createjs.Tween.get(racoon.model.position).to({x:racoon.model.position.x+0.3},300);
			createjs.Tween.get(world.camera.position).to({x: world.camera.position.x+0.3} ,300);
		}
			
		if (racoon.pressed[1]==true){
			createjs.Tween.get(racoon.model.position).to({z: racoon.model.position.z+0.3},300);
			createjs.Tween.get(world.camera.position).to({z: world.camera.position.z+0.3} ,300);
		}
	
		if (racoon.pressed[2]==true){
			createjs.Tween.get(racoon.model.position).to({z: racoon.model.position.z-0.3},300);
			createjs.Tween.get(world.camera.position).to({z: world.camera.position.z-0.3} ,300);
		}
	
		if (racoon.pressed[3]==true){
			createjs.Tween.get(racoon.model.position).to({x: racoon.model.position.x-0.3},300);
			createjs.Tween.get(world.camera.position).to({x: world.camera.position.x-0.3} ,300);
		}
	
		setTimeout(()=>{clearInterval(obstacles)},300)
		return racoon}

	else{
	
		if (racoon.pressed[0]==true){
			createjs.Tween.get(racoon.model.position).to({x:racoon.model.position.x+1},900);
			createjs.Tween.get(world.camera.position).to({x: world.camera.position.x+1},900);
		}
			
		if (racoon.pressed[1]==true){
			createjs.Tween.get(racoon.model.position).to({z: racoon.model.position.z+1},900);
			createjs.Tween.get(world.camera.position).to({z: world.camera.position.z+1},900);
		}
	
		if (racoon.pressed[2]==true){
			createjs.Tween.get(racoon.model.position).to({z: racoon.model.position.z-1},900);
			createjs.Tween.get(world.camera.position).to({z: world.camera.position.z-1},900);
		}
	
		if (racoon.pressed[3]==true){
			createjs.Tween.get(racoon.model.position).to({x: racoon.model.position.x-1},900);
			createjs.Tween.get(world.camera.position).to({x: world.camera.position.x-1},900);
		}
	
		setTimeout(()=>{clearInterval(obstacles)},900)
		return racoon}
}



function check4Obstacles(model, world){

	const rayCasterFace = new THREE.Raycaster();

	var origin = model.model.position.clone();
	var direction = model.direction;

	if(model.previousDirection.x < model.direction.x){origin.x+=0.8}
	if(model.previousDirection.x > model.direction.x){origin.x-=0.8}
	if(model.previousDirection.z < model.direction.z){origin.z+=0.8}
	if(model.previousDirection.z > model.direction.z){origin.z-=0.8}

	rayCasterFace.set(origin, direction);
	rayCasterFace.far = 0.8;

	var out = rayCasterFace.intersectObjects(world.scene.children);

	for(var i = 0; i< out.length;i++){
		if(out[i].object.name=='bBoxcolumnTreasure'){
			model.canWalk=false;
			model.grab=true;
		}
		else if(out[i].object.name=='bBoxspaceShip' && model.stolen==true){
			leave(model,world,out[i].object.parent);
		}	
		else if(out[i].object.name.includes('treasure') && model.level==0)
			{model.canWalk=false;
			model.grab=true;}

		else if(out[i].object.name=='bBoxbuoy' && model.level==2)
			{model.canWalk=false;
			death(model, world)}
		
		else if(out[i].object.name=='bBoxfish' && model.level==2)
			{model.canWalk=false;
			death(model, world)}
			
		else if(out[i].object.name=='bBoxshark' && model.level==2)
			{model.canWalk=false;
			death(model, world)}

		else if(out[i].object.name.includes('lifesaver') && model.level==2)
			{model.canWalk=false;
			model.position=out[i].object}

	}
	
	return model;
}

export function leave(racoon,world,ship){
	racoon.model.visible=false;
	createjs.Tween.get(ship.position).to({z:-0.5},100).to({y:50,z:-100, x:100},50000);	
	world.completed = true;
	nextLevel(racoon.level,world);

}

export function moveLegs(skeleton){
	
	createjs.Tween.get(skeleton.head.rotation).to({x:skeleton.head.rotation.x +2*Math.PI/180},100).to({x:skeleton.upperSpine.rotation.x -2*Math.PI/180},100).to({x: skeleton.head.rotation.x},100);	
	
	createjs.Tween.get(skeleton.rightThigh.rotation).to({x: skeleton.rightThigh.rotation.x-40*Math.PI/180},100).to({x:skeleton.rightThigh.rotation.x +50 *Math.PI/180},100).to({x:1.28},100);
	createjs.Tween.get(skeleton.rightLeg.rotation).to({x:skeleton.rightLeg.rotation.x+60*Math.PI/180},100).to({x: skeleton.rightLeg.rotation.x-60*Math.PI/180},100).to({x: 1.13},100);		

    createjs.Tween.get(skeleton.leftThigh.rotation).to({x: skeleton.leftThigh.rotation.x +50*Math.PI/180},100).to({x:skeleton.leftThigh.rotation.x -40 *Math.PI/180},100).to({x:1.28},100);
	createjs.Tween.get(skeleton.leftLeg.rotation).to({x:skeleton.leftLeg.rotation.x-60*Math.PI/180},100).to({x: skeleton.leftLeg.rotation.x+60*Math.PI/180},100).to({x: 1.13},100);	

	createjs.Tween.get(skeleton.rightShoulder.rotation).to({x: skeleton.rightShoulder.rotation.x + 30 *Math.PI/180},100).to({x: skeleton.rightShoulder.rotation.x -30 *Math.PI/180},100).to({x: 1.22},100);
	createjs.Tween.get(skeleton.rightArm.rotation).to({x:skeleton.rightArm.rotation.x + 30*Math.PI/180},100).to({x:skeleton.rightArm.rotation.x -30*Math.PI/180},100).to({x: 0.62},100);		
	createjs.Tween.get(skeleton.rightElbow.rotation).to({x:skeleton.rightElbow.rotation.x - 42*Math.PI/180},100).to({x: skeleton.rightElbow.rotation.x+ 42*Math.PI/180},100).to({x: -0.40},100);		
	createjs.Tween.get(skeleton.rightHand.rotation).to({x:skeleton.rightHand.rotation.x-5*Math.PI/180},100).to({x: skeleton.rightHand.rotation.x +5*Math.PI/180},100).to({x: -0.60},100);
					
	createjs.Tween.get(skeleton.leftShoulder.rotation).to({x: skeleton.leftShoulder.rotation.x - 30 *Math.PI/180},100).to({x: skeleton.leftShoulder.rotation.x +30 *Math.PI/180},100).to({x: 1.22},100);
	createjs.Tween.get(skeleton.leftArm.rotation).to({x:skeleton.leftArm.rotation.x - 30*Math.PI/180},100).to({x:skeleton.leftArm.rotation.x +30*Math.PI/180},100).to({x: 0.62},100);		
	createjs.Tween.get(skeleton.leftElbow.rotation).to({x:skeleton.leftElbow.rotation.x + 42*Math.PI/180},100).to({x: skeleton.leftElbow.rotation.x - 42*Math.PI/180},100).to({x: -0.40},100);		
	createjs.Tween.get(skeleton.leftHand.rotation).to({x:skeleton.leftHand.rotation.x+5*Math.PI/180},100).to({x: skeleton.leftHand.rotation.x -5*Math.PI/180},100).to({x: -0.60},100);	

	createjs.Tween.get(skeleton.upperTail.rotation).to({x:skeleton.upperTail.rotation.x+20*Math.PI/180, z: skeleton.upperTail.rotation.z+10*Math.PI/180},100).to({x: skeleton.upperTail.rotation.x -20*Math.PI/180, z: skeleton.upperTail.rotation.z-10*Math.PI/180},100).to({x: 2.96, z: 0},100);	
	createjs.Tween.get(skeleton.lowerTail.rotation).to({x:skeleton.lowerTail.rotation.x-2*Math.PI/180,z: skeleton.lowerTail.rotation.z+10*Math.PI/180},100).to({x: skeleton.lowerTail.rotation.x +2*Math.PI/180,z: skeleton.lowerTail.rotation.z-10*Math.PI/180},100).to({x: -0.51,z: 0},100);	
	
}


export function swim(skeleton){

	createjs.Tween.get(skeleton.head.rotation).to({x:skeleton.head.rotation.x +2*Math.PI/180},300).to({x:skeleton.upperSpine.rotation.x -2*Math.PI/180},300).to({x: skeleton.head.rotation.x},300);	
	createjs.Tween.get(skeleton.root.position).to({y:-0.50},300).to({y:-0.6},300).to({y:-0.55},300);	

	createjs.Tween.get(skeleton.rightThigh.rotation).to({x: skeleton.rightThigh.rotation.x-40*Math.PI/180},300).to({x:skeleton.rightThigh.rotation.x +60 *Math.PI/180},300).to({x:1.28},300);
	createjs.Tween.get(skeleton.rightLeg.rotation).to({x:skeleton.rightLeg.rotation.x+60*Math.PI/180},300).to({x: skeleton.rightLeg.rotation.x-40*Math.PI/180},300).to({x: 1.13},300);		
	createjs.Tween.get(skeleton.rightFoot.rotation).wait(300).to({x: skeleton.rightFoot.rotation.x+80*Math.PI/180},300).to({x: 2.53},300);		

    createjs.Tween.get(skeleton.leftThigh.rotation).to({x: skeleton.leftThigh.rotation.x +60*Math.PI/180},300).to({x:skeleton.leftThigh.rotation.x -40 *Math.PI/180},300).to({x:1.28},300);
	createjs.Tween.get(skeleton.leftLeg.rotation).to({x:skeleton.leftLeg.rotation.x-40*Math.PI/180},300).to({x: skeleton.leftLeg.rotation.x+60*Math.PI/180},300).to({x: 1.13},300);	
	createjs.Tween.get(skeleton.leftFoot.rotation).to({x: skeleton.leftFoot.rotation.x+80*Math.PI/180},300).to({x: 2.53},300).wait(300);	

	createjs.Tween.get(skeleton.rightShoulder.rotation).to({z:skeleton.rightShoulder.rotation.z + 90*Math.PI/180,x:skeleton.rightShoulder.rotation.x -30*Math.PI/180},300).to({x:skeleton.rightShoulder.rotation.x +60*Math.PI/180,z:0.43},300).to({x: 0.35},300);		
	createjs.Tween.get(skeleton.rightArm.rotation).to({x:skeleton.rightArm.rotation.x + 40*Math.PI/180},300).to({x:skeleton.rightArm.rotation.x + 30*Math.PI/180},300).to({x: 0.97},300);		
	createjs.Tween.get(skeleton.rightHand.rotation).to({x:skeleton.rightHand.rotation.x+10*Math.PI/180},300).to({x: skeleton.rightHand.rotation.x -5*Math.PI/180},300).to({x: 0.26},300);
					
	createjs.Tween.get(skeleton.leftShoulder.rotation).to({z:skeleton.leftShoulder.rotation.z -90*Math.PI/180,x:skeleton.leftShoulder.rotation.x -30*Math.PI/180},300).to({x:skeleton.leftShoulder.rotation.x +60*Math.PI/180,z:-0.43},300).to({x: 0.35},300);		
	createjs.Tween.get(skeleton.leftArm.rotation).to({x:skeleton.leftArm.rotation.x + 40*Math.PI/180},300).to({x:skeleton.leftArm.rotation.x + 30*Math.PI/180},300).to({x: 0.97},300);		
	createjs.Tween.get(skeleton.leftHand.rotation).to({x:skeleton.leftHand.rotation.x+10*Math.PI/180},300).to({x: skeleton.leftHand.rotation.x -5*Math.PI/180},300).to({x: 0.26},300);

	createjs.Tween.get(skeleton.upperTail.rotation).to({z:skeleton.upperTail.rotation.z+50*Math.PI/180},300).to({z: skeleton.upperTail.rotation.z -50*Math.PI/180},300).to({z: 0},300);

}

export function jump(racoon, level, world,objects){

	var findGround = window.setInterval(function(){search4Landing(racoon,world,objects);},100)

		setTimeout(()=>{createjs.Tween.get(racoon.model.position).to({ y: groundDistance},500);
						clearInterval(findGround);},1900)
		
		createjs.Tween.get(racoon.model.position).to({ y: racoon.model.position.y+0.5},500).to({ y: racoon.model.position.y+0.5},1000)//.to({ y: groundDistance},500);
		
		createjs.Tween.get(racoon.lowerSpine.rotation).to({z: racoon.lowerSpine.rotation.z +10*Math.PI/180},500).to({z: racoon.lowerSpine.rotation.z -10*Math.PI/180},1000).to({z: 0},500);
		createjs.Tween.get(racoon.upperSpine.rotation).to({z:racoon.upperSpine.rotation.z -10*Math.PI/180},500).to({z:racoon.upperSpine.rotation.z +10*Math.PI/180},1000).to({z: 0},500);	
		createjs.Tween.get(racoon.head.rotation).to({x:racoon.head.rotation.x +2*Math.PI/180},1000).to({x:racoon.upperSpine.rotation.x -2*Math.PI/180},1000).to({x: -0.26},1000);	
		
		createjs.Tween.get(racoon.rightThigh.rotation).to({z: racoon.rightThigh.rotation.z+60*Math.PI/180},1000).to({z:0.28},1000);
		createjs.Tween.get(racoon.rightLeg.rotation).to({z:racoon.rightLeg.rotation.z+60*Math.PI/180},1000).to({z: -0.21},1000);		

	    createjs.Tween.get(racoon.leftThigh.rotation).to({z: racoon.leftThigh.rotation.z-60*Math.PI/180},1000).to({z:-0.28},1000);
		createjs.Tween.get(racoon.leftLeg.rotation).to({z:racoon.leftLeg.rotation.z-60*Math.PI/180},1000).to({z: 0.21},1000);	

		createjs.Tween.get(racoon.rightShoulder.rotation).to({z: racoon.rightShoulder.rotation.z + 50 *Math.PI/180},1000).to({z: 0.43},1000);
		createjs.Tween.get(racoon.rightArm.rotation).to({z:racoon.rightArm.rotation.z + 50*Math.PI/180},1000).to({z: -0.17},1000);		
		createjs.Tween.get(racoon.rightElbow.rotation).to({z:racoon.rightElbow.rotation.z + 42*Math.PI/180},1000).to({z: -0.27},1000);		
		createjs.Tween.get(racoon.rightHand.rotation).to({z:racoon.rightHand.rotation.z+5*Math.PI/180},1000).to({z: -0.10},1000);
						
		createjs.Tween.get(racoon.leftShoulder.rotation).to({z: racoon.leftShoulder.rotation.z -50 *Math.PI/180},1000).to({z: -0.43},1000);
		createjs.Tween.get(racoon.leftArm.rotation).to({z:racoon.leftArm.rotation.z -50*Math.PI/180},1000).to({z: 0.17},1000);		
		createjs.Tween.get(racoon.leftElbow.rotation).to({z:racoon.leftElbow.rotation.z - 42*Math.PI/180},1000).to({z: 0.27},1000);		
		createjs.Tween.get(racoon.leftHand.rotation).to({z:racoon.leftHand.rotation.z-5*Math.PI/180},1000).to({z: 0.10},1000);	

	setTimeout(()=>{whereAmI(racoon,objects,world)},1990);
}

export function teleport(racoon, next, camera){

	createjs.Tween.get(racoon.model.position).to({y:-0.5, x:racoon.position.position.x, z:racoon.position.position.z},1000).to({x:next.position.x, z:next.position.z+1},1).to({y: 0.35},1000);
	createjs.Tween.get(camera.position).wait(1000).to({x:next.position.x+0.5-2, z:next.position.z},10).to({y: 0.35},1000);
	racoon.position=null;
	setTimeout(()=>{
		camera.lookAt(racoon.model.position);
		racoon.canWalk=true;
		return racoon;},2001);
}

function search4Landing(model,world,objects){
	const rayCasterDown = new THREE.Raycaster();

	var origin = model.model.position.clone();

	rayCasterDown.set(model.model.position,new THREE.Vector3(0,-1,0));

	var out = rayCasterDown.intersectObjects(objects);

	for(var i = 0; i< out.length;i++){
		if(out.length==0){
			model.position = 'void';
			break;}

		//level 0
		else if(out[i].object.name.includes('ground1')||out[i].object.name.includes('ground2')){
			groundDistance = 0.35;
			break;

		}

		//level 1 & 2
		else if(out[i].object.name=='stoneGround' && model.stolen==false){
			groundDistance = 0.35;
			break;

		}
		else if(out[i].object.name=='baseTreasure'&& model.stolen==true){
			model.position = out[i].object;
			groundDistance = out[i].object.parent.parent.position.y+out[i].object.children[0].geometry.parameters.height*3.55/2;
			break;
		}
		else if(out[i].object.name.includes('plane')&& model.stolen==true){
			model.position = out[i].object;
			groundDistance = out[i].object.position.y-(model.root.position.y)+0.03;
			break;
		}
		else if(out[i].object.name.includes('bBox')&& model.stolen==true){
			model.position = out[i].object;
			groundDistance = out[i].object.parent.position.y+out[i].object.geometry.parameters.height*3.55/2;			
			break;
		}
		
	}
	return groundDistance;
}
		
export function whereAmI(racoon,obj,world){
	objects=obj;
	const rayCaster = new THREE.Raycaster();
	
	rayCaster.set(racoon.model.position,new THREE.Vector3(0,-1,0));
		
	var out;
	if(racoon.level==2){out=rayCaster.intersectObject(objects);}
	if(racoon.level<2){out = rayCaster.intersectObjects(objects);}

	if (out.length==0){
		racoon.canWalk=false;
		racoon.position='void';
		let isDead = death(racoon,world);
		racoon.lostLife=true;
	}
	else if ((out.length==2 && out[0].object.name=='lavaGround' && out[1].object.name=='lavaGround')||(out.length==1 && out[0].object.name=='lavaGround')){
		racoon.position=out[0].object;
		racoon.canWalk=false;
		racoon.lostLife=true;
		death(racoon,world);}
	else{
		racoon.canWalk=true;

		for(var i=0;i<out.length;i++){
			if (out[i].object.name.includes('pla')){racoon.position=out[i].object;}
			else if(out[i].object.name=='bBoxteleport1'){

					racoon.position = objects[objects.length-2];
					racoon.canWalk=false;
					setTimeout(()=>{
					racoon.model.position.x = racoon.position.position.x;
					racoon.model.position.z = racoon.position.position.z;
					world.camera.position.x = racoon.position.position.x;
					world.camera.position.z = racoon.position.position.z;
					},100)
					

				}
			else if(out[i].object.parent.name=='bBoxteleport2'){

					racoon.position = objects[objects.length-3];
					setTimeout(()=>{
					racoon.model.position.x = racoon.position.position.x;
					racoon.model.position.z = racoon.position.position.z;
					world.camera.position.x = racoon.position.position.x;
					world.camera.position.z = racoon.position.position.z;
					},100)

				}

			else if (out[i].object.name.includes('ground') && racoon.level<2){racoon.position=out[i].object}
			}
		}
	return racoon;
	

}

export function amIAttacked(racoon,obj,world){
	objects=obj;
	const rayCasterRight = new THREE.Raycaster();
	const rayCasterLeft = new THREE.Raycaster();

	rayCasterRight.set(racoon.model.position,new THREE.Vector3(0,0,0.2));
	rayCasterLeft.set(racoon.model.position,new THREE.Vector3(0,0,-0.2));
	
	var outRight = rayCasterRight.intersectObjects(objects);
	var outLeft = rayCasterLeft.intersectObjects(objects);
	if (outRight.length==0 && outLeft.length==0){ //no collisions detected
		racoon.canWalk=true;}
	else {
		if(outRight.length>0){
			if(outRight[0].distance<0.5){
				racoon.canWalk=false;
		racoon.lostLife=true;
		death(racoon,world);
			}

		}
		else{
			if(outLeft[0].distance<0.5){
				racoon.canWalk=false;
		racoon.lostLife=true;
		death(racoon,world);
			}
		}
	}
	return racoon;
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Death 

export function death(racoon, world){
	racoon.canWalk=false;
	createjs.Tween.get(racoon.model.position).to({y: -0.5},1500);
	setTimeout(()=>{
		var life = world.sceneTop.getObjectByName('life'.concat((racoon.life).toString()));
		if(life!=undefined){racoon.loseLife();}
		world.sceneTop.remove(life);
		racoon.recoverPosition(racoon.checkPoint);
		world.camera.position.x=racoon.checkPoint.x-3;
		world.camera.position.z=0;
		if(racoon.level!=2){setTimeout(()=>{whereAmI(racoon,objects,world.camera);},10);}
		if(racoon.life==0){
			racoon.dead=true;
			gameOver(world);
			return racoon;}
	},1500)

}

//gameover

export function gameOver(world){
	
	document.getElementById('ins').innerHTML = "Game over, Captain. I though you were trained enough for this mission... apparently you weren't. Press R if you'd like to risk your life one again, otherwise what are you doing here?\nYou can also press M if you want to try something else.";
}

function nextLevel(lvl,world){
	if(lvl<2){document.getElementById('ins').innerHTML = "Mission accomplished, Captain. Let's hunt another treasure! Press N to go to next level or M to go to the main page.";}
	else if(lvl==2){document.getElementById('ins').innerHTML = "Congratulations, Captain. Final Mission accomplished! Press N to go to the main page.";}
}
